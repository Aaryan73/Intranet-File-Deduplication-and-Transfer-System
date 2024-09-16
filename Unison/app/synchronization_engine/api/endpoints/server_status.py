from fastapi import APIRouter, Depends
from app.user_management.schemas import User
from app.synchronization_engine.models.server_status import ServerStatusCreate, ServerStatus
from app.synchronization_engine.schemas.server_status import ServerStatusResponse
from app.synchronization_engine.api.dependencies import get_server_status_service
from app.synchronization_engine.services.server_status import ServerStatusService
from app.core.security import get_current_active_user, get_current_active_superuser
from typing import List
from bson import ObjectId

router = APIRouter()


@router.put("/", response_model=dict)
async def update_server_status(
    server_status: ServerStatus,
    service: ServerStatusService = Depends(get_server_status_service),
    current_user: User = Depends(get_current_active_user)
):
    server_status = server_status.model_dump()
    current_user = current_user.model_dump()
    server_status["user_id"] = ObjectId(current_user["id"])
    server_status = ServerStatusCreate(**server_status)

    return await service.update_server_status(server_status)

@router.get("/online", response_model=List[ServerStatusResponse])
async def get_online_servers(
    service: ServerStatusService = Depends(get_server_status_service),
    current_superuser: User = Depends(get_current_active_superuser)
):
    return await service.get_online_servers()