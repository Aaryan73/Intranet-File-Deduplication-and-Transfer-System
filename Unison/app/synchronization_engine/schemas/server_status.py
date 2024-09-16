from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from bson import ObjectId

class ServerStatusResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    is_online: bool
    last_seen: datetime
    network_url: str
    port: int

    @field_validator('id')
    def convert_objectid(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v