from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_DATABASE_URI)
database = client[settings.MONGO_DATABASE]
users_collection = database["users"]