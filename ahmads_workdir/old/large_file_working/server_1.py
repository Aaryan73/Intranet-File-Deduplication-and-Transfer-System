from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
import os
import aiofiles
import asyncio

app = FastAPI()

UPLOAD_DIR = "D:/SIH/data"
pending_uploads = {}

@app.post("/upload")
async def upload_file(request: Request):
    content_range = request.headers.get('Content-Range')
    file_name = request.headers.get('Content-Disposition').split('filename=')[1].strip('"')
    
    if not content_range:
        raise HTTPException(status_code=400, detail="Content-Range header is missing")
    
    start, end, total = map(int, content_range.replace('bytes ', '').replace('/', '-').split('-'))
    
    file_path = os.path.join(UPLOAD_DIR, file_name)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    chunk = await request.body()
    
    async with aiofiles.open(file_path, 'ab') as out_file:
        await out_file.seek(start)
        await out_file.write(chunk)
    
    if end + 1 >= total:
        # File upload is complete
        pending_uploads[file_name] = file_path
    
    return JSONResponse(content={"message": "Chunk received"}, status_code=206)

@app.get("/pending_uploads")
async def get_pending_uploads():
    return JSONResponse(content={"pending_uploads": list(pending_uploads.keys())})

@app.post("/confirm_upload")
async def confirm_upload(file_name: str):
    if file_name in pending_uploads:
        confirmed_path = pending_uploads.pop(file_name)
        return JSONResponse(content={"message": f"File {file_name} confirmed and saved at {confirmed_path}"})
    else:
        raise HTTPException(status_code=404, detail="File not found in pending uploads")

@app.post("/reject_upload")
async def reject_upload(file_name: str):
    if file_name in pending_uploads:
        file_path = pending_uploads.pop(file_name)
        os.remove(file_path)
        return JSONResponse(content={"message": f"File {file_name} rejected and deleted"})
    else:
        raise HTTPException(status_code=404, detail="File not found in pending uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)