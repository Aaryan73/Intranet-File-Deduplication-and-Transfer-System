from pydantic import BaseModel, Field
from datetime import datetime

class ServerStatusResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    is_online: bool
    last_seen: datetime
    network_url: str
    port: int