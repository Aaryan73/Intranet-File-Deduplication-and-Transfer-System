from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
from bson import ObjectId

class TransactionCreate(BaseModel):
    sender_id: str
    start_time: datetime
    file_size: int
    completed: bool

class TransactionUpdate(BaseModel):
    end_time: datetime
    receiver_id: str


class TransactionResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: Optional[str]
    start_time: datetime
    end_time: Optional[datetime]
    file_size: int
    completed: bool

    @field_validator('id', 'sender_id', 'receiver_id', mode='before')
    def convert_objectid(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
    class Config:
        from_attributes = True