from app.synchronization_engine.repositories.server_status import ServerStatusRepository
from app.synchronization_engine.models.server_status import ServerStatusCreate
from app.synchronization_engine.schemas.server_status import ServerStatusResponse
from typing import List

class ServerStatusService:
    def __init__(self, server_status_repo: ServerStatusRepository):
        self.server_status_repo = server_status_repo

    async def update_server_status(self, server_status: ServerStatusCreate) -> dict:
        await self.server_status_repo.update_status(server_status)
        return {"message": "Server status updated"}

    async def get_online_servers(self) -> List[ServerStatusResponse]:
        online_servers = await self.server_status_repo.get_online_servers()
        online_servers = [server.model_dump(by_alias=True) for server in online_servers]
        online_servers = [
            {**server, '_id': str(server['_id']), 'user_id': str(server['user_id'])} for server in online_servers
        ]
        return online_servers