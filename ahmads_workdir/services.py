import os
import time
import httpx
import asyncio
import aiofiles
import platform

from fastapi import HTTPException

import schemas

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
        raise HTTPException(status_code=400, detail="unsupported operating system")
    

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


# generate file transfer data
def generate_transfer_data(file_size: str, file_location: str, download_url: str, start_time, end_time, total_bytes):
    return schemas.FileTransferDetails(
        file_size = file_size,
        partial_checksum= "temp",
        file_location= file_location,
        download_url= download_url,
        final_download_url= "temp",
        download_id= 0,
        filename= "temp",
        mime= "temp",
        bytes_received= total_bytes,
        final_url= "temp",
        state= "temp",
        start_time= start_time,
        end_time= end_time,
        total_bytes= total_bytes,
        paused= False,
        referrer= "temp",
        danger= "No",
        exists= True,
        incognito= True
    )


# hit endpoint every 5 seconds
async def send_data_periodically():
    async with httpx.AsyncClient() as client:
        while True:
            try:
#                dummy_data = generate_dummy_data()
                #response = await client.post("http://52.172.0.204:8080/file-metadata", json=dummy_data)
                response = await client.get("http://127.0.0.1:8001/healthcheck")
                print(f"Sent data to API. Status code: {response.status_code}")
            except Exception as e:
                print(f"Error sending data: {str(e)}")
            await asyncio.sleep(5)