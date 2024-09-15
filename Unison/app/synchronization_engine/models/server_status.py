from pydantic import BaseModel, Field
from datetime import datetime
from .file_metadata import PyObjectId

class ServerStatusBase(BaseModel):
    user_id: str = Field(..., description="ID of the user")
    is_online: bool = Field(..., description="Whether the server is online")
    last_seen: datetime = Field(..., description="Last time the server was seen online")
    network_url: str = Field(..., description="Network URL of the file server")
    port: int = Field(..., description="Port number of the file server")

class ServerStatusCreate(ServerStatusBase):
    pass

class ServerStatusInDB(ServerStatusBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

# app/schemas/file_metadata.py
from pydantic import BaseModel, Field
from typing import Optional

class FileMetadataResponse(BaseModel):
    id: str = Field(..., alias="_id")
    file_size: int
    partial_checksum: str
    download_url: str
    file_location: str
    owner_id: str
    network_url: str
    port: int

class FileMetadataMatchResponse(BaseModel):
    message: str
    existing_file: FileMetadataResponse
    network_url: str
    port: int

class FileMetadataCreateResponse(BaseModel):
    message: str
    file_id: str