from app.core.mongodb import server_status_collection
from app.synchronization_engine.models.server_status import ServerStatusCreate, ServerStatusInDB
from typing import List, Optional

class ServerStatusRepository():
    def __init__(self):
        super().__init__()
        self.collection = server_status_collection

    async def update_status(self, server_status: ServerStatusCreate):
        server_status_dict = server_status.model_dump()
        await self.collection.update_one(
            {"user_id": server_status.user_id},
            {"$set": server_status_dict},
            upsert=True
        )

    async def get_online_servers(self) -> List[ServerStatusInDB]:
        cursor = self.collection.find({"is_online": True})
        return [ServerStatusInDB(**doc) async for doc in cursor]

    async def get_server_status(self, user_id: str) -> Optional[ServerStatusInDB]:
        result = await self.collection.find_one({"user_id": user_id})
        if result:
            return ServerStatusInDB(**result)
        return None