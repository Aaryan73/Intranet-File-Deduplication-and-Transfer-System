from app.synchronization_engine.repositories.file_metadata import FileMetadataRepository
from app.synchronization_engine.repositories.server_status import ServerStatusRepository
from app.synchronization_engine.services.file_metadata import FileMetadataService
from app.synchronization_engine.services.server_status import ServerStatusService

def get_file_metadata_service():
    file_metadata_repo = FileMetadataRepository()
    server_status_repo = ServerStatusRepository()
    return FileMetadataService(file_metadata_repo, server_status_repo)

def get_server_status_service():
    server_status_repo = ServerStatusRepository()
    return ServerStatusService(server_status_repo)