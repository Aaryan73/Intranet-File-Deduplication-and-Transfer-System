from fastapi import APIRouter, Depends
from app.models.server_status import ServerStatusCreate
from app.schemas.server_status import ServerStatusResponse
from app.api.dependencies import get_server_status_service
from app.services.server_status import ServerStatusService
from typing import List

router = APIRouter()

@router.put("/", response_model=dict)
async def update_server_status(
    server_status: ServerStatusCreate,
    service: ServerStatusService = Depends(get_server_status_service)
):
    return await service.update_server_status(server_status)

@router.get("/online", response_model=List[ServerStatusResponse])
async def get_online_servers(
    service: ServerStatusService = Depends(get_server_status_service)
):
    return await service.get_online_servers()