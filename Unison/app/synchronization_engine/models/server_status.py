from pydantic import BaseModel, Field
from datetime import datetime
from .file_metadata import PyObjectId

class ServerStatusBase(BaseModel):
    is_online: bool = Field(..., description="Whether the server is online")
    last_seen: datetime = Field(..., description="Last time the server was seen online")
    network_url: str = Field(..., description="Network URL of the file server")
    port: int = Field(..., description="Port number of the file server")


class ServerStatus(ServerStatusBase):
    pass

class ServerStatusCreate(ServerStatusBase):
    user_id: PyObjectId = Field(..., description="ID of the user")


class ServerStatusInDB(ServerStatusCreate):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}