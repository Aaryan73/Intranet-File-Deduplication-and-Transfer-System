from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class FileMetadataBase(BaseModel):
    file_size: int = Field(..., description="Size of the file in bytes")
    partial_checksum: str = Field(..., description="Partial checksum of the first 8MB of the file")
    download_url: str = Field(..., description="Original download URL of the file")
    file_location: str = Field(..., description="Location of the file on the user's PC")
    owner_id: str = Field(..., description="ID of the user who owns the file")
    network_url: str = Field(..., description="Network URL of the file server")
    port: int = Field(..., description="Port number of the file server")

class FileMetadataCreate(FileMetadataBase):
    pass

class FileMetadataInDB(FileMetadataBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}