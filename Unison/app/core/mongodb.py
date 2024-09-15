from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_DATABASE_URI)
database = client[settings.MONGO_DATABASE]
users_collection = database["users"]
file_metadata_collection = database["file_metadata"]
server_status_collection = database["server_status"]