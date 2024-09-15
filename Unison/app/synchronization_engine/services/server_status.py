from app.repositories.server_status import ServerStatusRepository
from app.models.server_status import ServerStatusCreate, ServerStatusInDB
from typing import List

class ServerStatusService:
    def __init__(self, server_status_repo: ServerStatusRepository):
        self.server_status_repo = server_status_repo

    async def update_server_status(self, server_status: ServerStatusCreate) -> dict:
        await self.server_status_repo.update_status(server_status)
        return {"message": "Server status updated"}

    async def get_online_servers(self) -> List[ServerStatusInDB]:
        return await self.server_status_repo.get_online_servers()