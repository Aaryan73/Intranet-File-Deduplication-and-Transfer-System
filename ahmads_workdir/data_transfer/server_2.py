from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os
import aiofiles

app = FastAPI()

@app.get("/send_file")
async def send_file(source_path: str):
    try:
        # Check if the source file exists
        if not os.path.exists(source_path):
            raise HTTPException(status_code=404, detail="Source file not found")
        
        # Get the filename from the path
        file_name = os.path.basename(source_path)
        
        # Read the file content asynchronously
        async with aiofiles.open(source_path, 'rb') as file:
            content = await file.read()
        
        # Send the file to Server 1 using httpx
        async with httpx.AsyncClient() as client:
            files = {'file': (file_name, content)}
            response = await client.post('http://localhost:8000/upload', files=files)
        
        if response.status_code == 200:
            return JSONResponse(
                content={
                    "message": "File sent and uploaded successfully",
                    "server1_response": response.json()
                },
                status_code=200
            )
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Error from Server 1: {response.text}")
    
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
