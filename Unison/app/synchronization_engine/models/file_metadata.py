from pydantic import BaseModel, Field
from bson import ObjectId
from pydantic_core import core_schema
from typing import Optional
from datetime import datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            v = ObjectId(v)
        return v

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.is_instance_schema(ObjectId),
            serialization=core_schema.to_string_ser_schema(),
        )

class FileMetadataBase(BaseModel):
    # Existing fields
    file_size: int = Field(..., description="Size of the file in bytes")
    partial_checksum: str = Field(..., description="Partial checksum of the first 8MB of the file")
    file_location: str = Field(..., description="Location of the file on the user's PC")
    download_url: str = Field(..., description="Original download URL of the file")
    final_download_url: str = Field(..., description="Original URL of the download")
    download_id: int = Field(..., description="Unique identifier for the download item")
    filename: str = Field(..., description="Name of the file")
    mime: str = Field(..., description="MIME type of the file")
    bytes_received: int = Field(..., description="Number of bytes received")
    final_url: str = Field(..., description="Final URL of the download")
    state: str = Field(..., description="Current state of the download")
    start_time: datetime = Field(..., description="Start time of the download")
    end_time: Optional[datetime] = Field(None, description="End time of the download")
    total_bytes: int = Field(..., description="Total number of bytes to be downloaded")
    paused: bool = Field(..., description="Whether the download is paused")
    referrer: str = Field(..., description="Referrer URL for the download")
    danger: str = Field(..., description="Danger type of the file")
    exists: bool = Field(..., description="Whether the file already exists")
    incognito: bool = Field(..., description="Whether the download is in incognito mode")

    class Config:
        populate_by_name = True

class FileMetadata(FileMetadataBase):
    pass

class FileMetadataCreate(FileMetadataBase):
    owner_id: PyObjectId = Field(..., description="ID of the user who owns the file")

class FileMetadataInDB(FileMetadataCreate):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}