from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import aiofiles

app = FastAPI()

UPLOAD_DIR = "D:/SIH/data"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Ensure the upload directory exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Generate a unique filename
        file_name = file.filename
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        # Stream the file content and save it
        async with aiofiles.open(file_path, 'wb') as out_file:
            while content := await file.read(1024 * 1024):  # Read in 1MB chunks
                await out_file.write(content)
        
        return JSONResponse(content={"message": "File uploaded successfully", "saved_path": file_path}, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)