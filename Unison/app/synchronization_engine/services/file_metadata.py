from app.synchronization_engine.repositories.file_metadata import FileMetadataRepository
from app.synchronization_engine.repositories.server_status import ServerStatusRepository
from app.synchronization_engine.models.file_metadata import FileMetadataCreate
from app.synchronization_engine.schemas.file_metadata import FileMetadataMatchResponse, FileMetadataCreateResponse, FileMetadataResponse
from app.core.config import settings
from app.utils.file_existence_check_utils import FileExistenceCheckerClient
from fastapi import HTTPException, status
import hashlib
import aiohttp
import asyncio


class FileMetadataService:
    def __init__(self, file_metadata_repo: FileMetadataRepository, server_status_repo: ServerStatusRepository):
        self.file_metadata_repo = file_metadata_repo
        self.server_status_repo = server_status_repo
        self.file_checker_client = None

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
            file_metadata = file_metadata.model_dump(include=FileMetadataResponse.model_fields.keys(), by_alias=True)
            server_status = await self.server_status_repo.get_server_status(file_metadata["owner_id"])
            if server_status and server_status.is_online:
                file_metadata["owner_id"] = str(file_metadata["owner_id"])
                file_metadata["_id"] = str(file_metadata["_id"])
                file_metadata = file_metadata
                print(file_metadata)

                try:
                    self.file_checker_client = FileExistenceCheckerClient(f"{server_status.network_url}:{server_status.port}")
                    async with self.file_checker_client as client:
                        file_path = file_metadata.get("file_location", "")  # Ensure you have the correct field name
                        existence_result = await client.check_file_existence(file_path)
                        
                        if not existence_result.get("exists", False):
                            raise HTTPException(
                                status_code=status.HTTP_404_NOT_FOUND,
                                detail="File metadata exists but the actual file is not found on the server"
                            )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Error checking file existence: {str(e)}"
                    )

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
    
    async def download_and_calculate_partial_checksum(self, url: str) -> dict:
        """
        Download exactly the first 8MB of a file and calculate its checksum.

        Args:
            url (str): The URL of the file to download.

        Returns:
            str: The calculated checksum of the first 8MB.

        Raises:
            HTTPException: If there's an error downloading the file or calculating the checksum.
        """
        checksum = hashlib.md5()
        total_bytes = 0

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise HTTPException(status_code=400, detail="Failed to download the file")

                    start_time = asyncio.get_event_loop().time()

                    while total_bytes < settings.DOWNLOAD_LIMIT:
                        remaining = settings.DOWNLOAD_LIMIT - total_bytes
                        chunk = await asyncio.wait_for(
                            response.content.read(min(settings.CHUNK_SIZE, remaining)),
                            timeout=settings.MAX_DOWNLOAD_TIME
                        )
                        if not chunk:
                            break
                        checksum.update(chunk)
                        total_bytes += len(chunk)

                        if asyncio.get_event_loop().time() - start_time > settings.MAX_DOWNLOAD_TIME:
                            raise HTTPException(
                                status_code=408,
                                detail="Download took too long. Please try again later."
                            )

        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=408,
                detail="Download timed out. Please try again later."
            )
        except aiohttp.ClientError as e:
            raise HTTPException(status_code=400, detail=f"Error downloading file: {str(e)}")

        if total_bytes < settings.DOWNLOAD_LIMIT:
            raise HTTPException(status_code=400, detail="File is smaller than 8MB")

        return {
            "download_url": url,
            "checksum": checksum.hexdigest()
            }