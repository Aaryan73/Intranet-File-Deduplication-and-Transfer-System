import os
import time
import asyncio
import uvicorn
import platform
import aiofiles
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict
from threading import Lock

app = FastAPI()

#UPLOAD_DIR = "D:/SIH/data"


# Default download folder
def get_download_folder():
    system = platform.system()
    if system == "Windows":
        return os.path.join(os.path.expanduser("~"), "Downloads")
    elif system == "Darwin":  # macOS
        return os.path.join(os.path.expanduser("~"), "Downloads")
    elif system == "Linux":
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:
        raise RuntimeError("Unsupported operating system")

UPLOAD_DIR = get_download_folder()


# Function to send a file in chunks
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


# Healthcheck
@app.get("/healthcheck")
def healthcheck():
    return {"status": "chill buddy, backed is up and running!"}


# Send file
@app.get("/send_file")
async def send_file(source_path: str, receiver_ip: str):
    try:
        if not os.path.exists(source_path):
            raise HTTPException(status_code=404, detail="Source file not found")
        
        async with httpx.AsyncClient() as client:
            response = await send_file_in_chunks(client, f'http://{receiver_ip}:8000/receive_file', source_path)
        
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
        raise HTTPException(status_code=501, detail=f"An unexpected error occurred: {str(e)}")


# In-memory store to track upload start times
upload_tracking: Dict[str, float] = {}
tracking_lock = Lock()

@app.post("/receive_file")
async def receive_file(request: Request):
    content_range = request.headers.get('Content-Range')
    content_disposition = request.headers.get('Content-Disposition')

    if not content_range:
        raise HTTPException(status_code=400, detail="Content-Range header is missing")
    
    if not content_disposition:
        raise HTTPException(status_code=400, detail="Content-Disposition header is missing")
    
    try:
        file_name = content_disposition.split('filename=')[1].strip('"')
    except IndexError:
        raise HTTPException(status_code=400, detail="Invalid Content-Disposition header format")
    
    try:
        range_part = content_range.replace('bytes ', '').replace('/', '-')
        start_str, end_str, total_str = range_part.split('-')
        start, end, total = int(start_str), int(end_str), int(total_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Content-Range header format")
    
    file_path = os.path.join(UPLOAD_DIR, file_name)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Read the chunk
    chunk = await request.body()
    
    # Record start time for the first chunk
    with tracking_lock:
        if file_name not in upload_tracking:
            upload_tracking[file_name] = time.time()
            print(f"Upload started for file: {file_name} at {upload_tracking[file_name]}")
    
    # Write the chunk to the file
    async with aiofiles.open(file_path, 'ab') as out_file:
        await out_file.seek(start)
        await out_file.write(chunk)
    
    # Get current file size
    try:
        file_size = os.path.getsize(file_path)
    except OSError:
        file_size = 0  # If file doesn't exist or is inaccessible
    
    # If this is the last chunk, calculate total time
    if end + 1 >= total:
        with tracking_lock:
            start_time = upload_tracking.pop(file_name, time.time())
        end_time = time.time()
        total_time = end_time - start_time
        print(f"Total time taken to receive the file '{file_name}': {total_time:.2f} seconds")
        print(f"Final file size for '{file_name}': {file_size} bytes")
        return JSONResponse(
            content={
                "message": "File upload complete",
                "file_path": file_path,
                "total_time_seconds": total_time,
                "file_size_bytes": file_size
            },
            status_code=200
        )
    else:
        print(f"Chunk received for '{file_name}'. Current file size: {file_size} bytes")
        return JSONResponse(content={"message": "Chunk received", "file_size_bytes": file_size}, status_code=206)


async def send_data_periodically():
    async with httpx.AsyncClient() as client:
        while True:
            try:
#                dummy_data = generate_dummy_data()
                #response = await client.post("http://52.172.0.204:8080/file-metadata", json=dummy_data)
                response = await client.get("http://127.0.0.1:8000/healthcheck")
                print(f"Sent data to API. Status code: {response.status_code}")
            except Exception as e:
                print(f"Error sending data: {str(e)}")
            await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(send_data_periodically())


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)