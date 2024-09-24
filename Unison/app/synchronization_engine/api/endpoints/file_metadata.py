from fastapi import APIRouter, Depends, Query
from app.user_management.schemas import User
from app.synchronization_engine.models.file_metadata import FileMetadata, FileMetadataCreate
from app.synchronization_engine.schemas.file_metadata import FileMetadataMatchResponse, FileMetadataCreateResponse
from app.synchronization_engine.api.dependencies import get_file_metadata_service
from app.synchronization_engine.services.file_metadata import FileMetadataService
from app.core.security import get_current_active_user
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=FileMetadataCreateResponse, responses={409: {"model": FileMetadataMatchResponse}})
async def create_file_metadata(
    file_metadata: FileMetadata,
    service: FileMetadataService = Depends(get_file_metadata_service),
    current_user: User = Depends(get_current_active_user),
):
    # Add owner_id to file_metadata
    file_metadata = file_metadata.model_dump()
    current_user = current_user.model_dump()
    file_metadata["owner_id"] = ObjectId(current_user["id"])
    file_metadata = FileMetadataCreate(**file_metadata)

    return await service.create_file_metadata(file_metadata)

@router.get("/", response_model=FileMetadataMatchResponse)
async def get_file_metadata(
    file_size: int,
    partial_checksum: str,
    service: FileMetadataService = Depends(get_file_metadata_service),
    current_user: User = Depends(get_current_active_user)
):

    return await service.get_file_metadata(file_size, partial_checksum, current_user)

@router.get("/calculate-partial-checksum", response_model=dict)
async def calculate_checksum(
    download_url: str = Query(..., description="URL of the file to download"),
    service: FileMetadataService = Depends(get_file_metadata_service),
    current_user: User = Depends(get_current_active_user),
):
    return await service.download_and_calculate_partial_checksum(download_url)