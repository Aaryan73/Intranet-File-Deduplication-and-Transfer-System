import os
import asyncio
import aiofiles
import httpx
import argparse
import uvicorn
import socket
import platform
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from typing import Dict
from datetime import datetime, timezone
from pydantic import BaseModel
from contextlib import asynccontextmanager
from pathlib import Path

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup events
    print("Booting up!")
    global access_token
    parser = argparse.ArgumentParser(description="User File Server")
    parser.add_argument("--username", required=True, help="Username for authentication")
    parser.add_argument("--password", required=True, help="Password for authentication")
    args = parser.parse_args()

    access_token = await authenticate(args.username, args.password)
    asyncio.create_task(update_server_status(startup=True))
    yield
    # Shutdown events
    await update_server_status(startup=False)
    print("Peace out!")

@asynccontextmanager
async def app_init(app: FastAPI):
    # Start the upload lifespan events
    async with lifespan(app):
        yield

app = FastAPI(lifespan=app_init)

def get_upload_dir() -> str:
    """
    Get the appropriate upload directory path based on the operating system.
    
    Returns:
        str: The path to the upload directory.
    """
    system = platform.system()
    
    if system == "Windows":
        # On Windows, use the Downloads folder in the user's profile
        return str(Path.home() / "Downloads")
    elif system in ["Linux", "Darwin"]:  # Darwin is macOS
        # On Linux and macOS, use ~/Downloads
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:
        # For other operating systems, use a fallback directory
        return os.path.join(os.path.expanduser("~"), "uploads")

# Constants
UPLOAD_DIR = get_upload_dir()
CENTRAL_SERVER_URL = "http://52.172.0.204:8080/api"
# CENTRAL_SERVER_URL = "http://localhost:8000/api"
SERVER_STATUS_ENDPOINT = f"{CENTRAL_SERVER_URL}/server-status"

# Uvicorn configs
HOST = "0.0.0.0"
PORT = 8000

# File transfer configs
CHUNK_SIZE = 10 * 1024 * 1024   # 10MB

# Global variables
access_token = None
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class ServerStatus(BaseModel):
    is_online: bool
    last_seen: str
    network_url: str
    port: int

class FilePathRequest(BaseModel):
    file_path: str

# Utility functions
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    finally:
        s.close()

async def file_exists(file_path: str) -> bool:
    """
    Check if a file exists asynchronously.

    Args:
        file_path (str): The path to the file to check.

    Returns:
        bool: True if the file exists, False otherwise.
    """
    try:
        # Use os.path for existence check, as aiofiles doesn't provide an async version
        if not os.path.exists(file_path):
            return False
        
        # If the file exists, try to open it asynchronously to confirm access
        async with aiofiles.open(file_path, mode='r') as _:
            return True
    except FileNotFoundError:
        return False
    except PermissionError:
        return False
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

# Authentication
async def authenticate(username: str, password: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CENTRAL_SERVER_URL}/user/token",
            data={
                "username": username,
                "password": password
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        )

        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            raise HTTPException(status_code=401, detail=response.json()["detail"])

# Middleware
@app.middleware("http")
async def add_auth_header(request: Request, call_next):
    global access_token
    if access_token:
        request.headers.__dict__["_list"].append(
            (b'authorization', f'Bearer {access_token}'.encode())
        )
    response = await call_next(request)
    return response

# Dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Here you would typically validate the token
    # For now, we'll just return the token itself
    return token

# Routes
@app.get("/healthcheck")
async def healthcheck(current_user: str = Depends(get_current_user)):
    return {"status": "Server is up and running!", "user": current_user}

@app.post("/check-file-existence")
async def check_file_existence(request: FilePathRequest) -> Dict[str, bool]:
    """
    FastAPI endpoint to check if a file exists.

    Args:
        request (FilePathRequest): The request body containing the file path.

    Returns:
        Dict[str, bool]: A dictionary with the key "exists" and a boolean value.
    """
    try:
        exists = await file_exists(request.file_path)
        return JSONResponse(content={"exists": exists})
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/receive_file")
async def receive_file(request: Request):
    content_range = request.headers.get('Content-Range')
    content_disposition = request.headers.get('Content-Disposition')

    if not content_range or not content_disposition:
        raise HTTPException(status_code=400, detail="Missing required headers")

    try:
        file_name = content_disposition.split('filename=')[1].strip('"')
        range_part = content_range.replace('bytes ', '').replace('/', '-')
        start, end, total = map(int, range_part.split('-'))
    except (IndexError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid header format")

    file_path = os.path.join(UPLOAD_DIR, file_name)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    chunk = await request.body()

    async with aiofiles.open(file_path, 'ab') as out_file:
        await out_file.seek(start)
        await out_file.write(chunk)

    file_size = os.path.getsize(file_path)

    if end + 1 >= total:
        return JSONResponse(
            content={
                "message": "File upload complete",
                "file_path": file_path,
                "file_size_bytes": file_size
            },
            status_code=200
        )
    else:
        return JSONResponse(
            content={"message": "Chunk received", "file_size_bytes": file_size},
            status_code=206
        )

@app.get("/send_file")
async def send_file(source_path: str, receiver_ip: str):
    if not os.path.exists(source_path):
        raise HTTPException(status_code=404, detail="Source file not found")

    try:
        async with httpx.AsyncClient() as client:
            async def send_file_in_chunks(url, file_path, chunk_size=CHUNK_SIZE):
                file_name = os.path.basename(file_path)
                file_size = os.path.getsize(file_path)
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
                        response.raise_for_status()

                        bytes_sent += len(chunk)

                return response

            response = await send_file_in_chunks(f'http://{receiver_ip}:8000/receive_file', source_path)

        return JSONResponse(
            content={
                "message": "File sent and uploaded successfully",
                "server_response": response.json()
            },
            status_code=200
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# Background task
async def update_server_status(startup: bool):
    global access_token
    while True:
        try:
            status = ServerStatus(
                is_online=startup,
                last_seen=datetime.now(timezone.utc).isoformat(),
                network_url=f"http://{get_local_ip()}",
                port=PORT
            )
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.put(
                    SERVER_STATUS_ENDPOINT,
                    json=status.model_dump(),
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                )
                
                if response.status_code == 200:
                    print(f"Server status updated successfully\nDetails: {dict(status)}")
                elif response.status_code == 307:
                    print(f"Received redirect to: {response.headers.get('Location')}")
                    # You might want to update SERVER_STATUS_ENDPOINT here if it's a permanent change
                else:
                    print(f"Failed to update server status: {response.text}")

            if not startup:
                break
        except Exception as e:
            print(f"Error updating server status: {str(e)}")
        await asyncio.sleep(5)  # Every 5 seconds


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)