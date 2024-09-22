from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os
import aiofiles

app = FastAPI()

async def send_file_in_chunks(client, url, file_path, chunk_size=1024*1024):
    file_name = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    
    async with aiofiles.open(file_path, 'rb') as file:
        offset = 0
        while offset < file_size:
            chunk = await file.read(chunk_size)
            headers = {
                'Content-Range': f'bytes {offset}-{offset+len(chunk)-1}/{file_size}',
                'Content-Disposition': f'attachment; filename="{file_name}"'
            }
            response = await client.post(url, headers=headers, content=chunk)
            if response.status_code not in [200, 206]:
                raise HTTPException(status_code=response.status_code, detail=f"Error from Server 1: {response.text}")
            offset += len(chunk)
    
    return response

@app.get("/send_file")
async def send_file(source_path: str):
    try:
        if not os.path.exists(source_path):
            raise HTTPException(status_code=404, detail="Source file not found")
        
        async with httpx.AsyncClient() as client:
            response = await send_file_in_chunks(client, 'http://localhost:8000/upload', source_path)
        
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