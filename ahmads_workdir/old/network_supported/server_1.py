import os
import aiofiles
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

UPLOAD_DIR = "D:/SIH/data"

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
        print(f"File upload complete: {file_name}")
        return JSONResponse(content={"message": "File upload complete", "file_path": file_path}, status_code=200)
    else:
        return JSONResponse(content={"message": "Chunk received"}, status_code=206)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)