import os
import time
import asyncio
import aiofiles
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict
from threading import Lock

import services
import schemas

app = FastAPI()

#UPLOAD_DIR = "D:/SIH/data"
UPLOAD_DIR = services.get_download_folder()


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
            response = await services.send_file_in_chunks(client, f'http://{receiver_ip}:8000/receive_file', source_path)
        
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

# Receive file
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


# Hit the endpoint every 5 seconds to mark active state
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(services.send_data_periodically())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)