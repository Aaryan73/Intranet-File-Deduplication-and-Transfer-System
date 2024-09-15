from app.repositories.file_metadata import FileMetadataRepository
from app.repositories.server_status import ServerStatusRepository
from app.models.file_metadata import FileMetadataCreate, FileMetadataInDB
from app.schemas.file_metadata import FileMetadataMatchResponse, FileMetadataCreateResponse
from fastapi import HTTPException, status

class FileMetadataService:
    def __init__(self, file_metadata_repo: FileMetadataRepository, server_status_repo: ServerStatusRepository):
        self.file_metadata_repo = file_metadata_repo
        self.server_status_repo = server_status_repo

    async def create_file_metadata(self, file_metadata: FileMetadataCreate) -> FileMetadataCreateResponse:
        existing_file = await self.file_metadata_repo.find_by_size_and_checksum(
            file_metadata.file_size, file_metadata.partial_checksum
        )
        if existing_file:
            server_status = await self.server_status_repo.get_server_status(existing_file.owner_id)
            if server_status and server_status.is_online:
                return FileMetadataMatchResponse(
                    message="File already exists",
                    existing_file=existing_file,
                    network_url=server_status.network_url,
                    port=server_status.port
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="File exists but the owner's server is offline"
                )
        
        file_id = await self.file_metadata_repo.create(file_metadata)
        return FileMetadataCreateResponse(message="File metadata created", file_id=file_id)

    async def get_file_metadata(self, file_size: int, partial_checksum: str) -> FileMetadataMatchResponse:
        file_metadata = await self.file_metadata_repo.find_by_size_and_checksum(file_size, partial_checksum)
        if file_metadata:
            server_status = await self.server_status_repo.get_server_status(file_metadata.owner_id)
            if server_status and server_status.is_online:
                return FileMetadataMatchResponse(
                    message="File metadata found",
                    existing_file=file_metadata,
                    network_url=server_status.network_url,
                    port=server_status.port
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="File exists but the owner's server is offline"
                )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File metadata not found"
        )