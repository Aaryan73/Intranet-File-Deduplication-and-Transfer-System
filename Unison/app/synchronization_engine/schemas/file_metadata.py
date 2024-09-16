from pydantic import BaseModel, Field

class FileMetadataResponse(BaseModel):
    id: str = Field(..., alias="_id")
    file_size: int
    partial_checksum: str
    final_download_url: str
    file_location: str
    owner_id: str

class FileMetadataMatchResponse(BaseModel):
    message: str
    existing_file: FileMetadataResponse
    network_url: str
    port: int

class FileMetadataCreateResponse(BaseModel):
    message: str
    file_id: str