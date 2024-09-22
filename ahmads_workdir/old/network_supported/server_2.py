import os
import time
import asyncio
import aiofiles
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

async def send_file_in_chunks(client, url, file_path, chunk_size=1024*1024):
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    
    print(f"Preparing to send file: {file_name}")
    print(f"File size: {file_size / (1024*1024):.2f} MB")
    
    start_time = time.time()
    last_update_time = start_time
    bytes_sent = 0
    
    async with aiofiles.open(file_path, 'rb') as file:
        while bytes_sent < file_size:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            
            headers = {
                'Content-Range': f'bytes {bytes_sent}-{bytes_sent+len(chunk)-1}/{file_size}',
                'Content-Disposition': f'attachment; filename="{file_name}"'
            }
            response = await client.post(url, headers=headers, content=chunk)
            if response.status_code not in [200, 206]:
                raise HTTPException(status_code=response.status_code, detail=f"Error from Server 1: {response.text}")
            
            bytes_sent += len(chunk)
            current_time = time.time()
            
            if current_time - last_update_time >= 5:
                elapsed_time = current_time - start_time
                speed = bytes_sent / elapsed_time
                remaining_bytes = file_size - bytes_sent
                eta = remaining_bytes / speed
                
                print(f"Progress: {bytes_sent/file_size*100:.2f}% complete")
                print(f"Estimated time remaining: {eta:.2f} seconds")
                print(f"Transfer speed: {speed/1024/1024:.2f} MB/s")
                
                last_update_time = current_time
    
    total_time = time.time() - start_time
    print(f"Transfer complete. Total time: {total_time:.2f} seconds")
    return response

@app.get("/send_file")
async def send_file(source_path: str, receiver_ip: str):
    try:
        if not os.path.exists(source_path):
            raise HTTPException(status_code=404, detail="Source file not found")
        
        async with httpx.AsyncClient() as client:
            response = await send_file_in_chunks(client, f'http://{receiver_ip}:8000/upload', source_path)
        
        return JSONResponse(
            content={
                "message": "File sent and uploaded successfully",
                "server1_response": response.json()
            },
            status_code=200
        )
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Source file not found")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while sending the file: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)