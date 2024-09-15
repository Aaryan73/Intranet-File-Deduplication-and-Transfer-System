from fastapi import APIRouter, Depends, HTTPException, status
from app.models.file_metadata import FileMetadataCreate
from app.schemas.file_metadata import FileMetadataMatchResponse, FileMetadataCreateResponse
from app.api.dependencies import get_file_metadata_service
from app.services.file_metadata import FileMetadataService

router = APIRouter()

@router.post("/", response_model=FileMetadataCreateResponse, responses={409: {"model": FileMetadataMatchResponse}})
async def create_file_metadata(
    file_metadata: FileMetadataCreate,
    service: FileMetadataService = Depends(get_file_metadata_service)
):
    return await service.create_file_metadata(file_metadata)

@router.get("/", response_model=FileMetadataMatchResponse)
async def get_file_metadata(
    file_size: int,
    partial_checksum: str,
    service: FileMetadataService = Depends(get_file_metadata_service)
):
    return await service.get_file_metadata(file_size, partial_checksum)