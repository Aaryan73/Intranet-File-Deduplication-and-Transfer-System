from app.core.mongodb import file_metadata_collection

from app.synchronization_engine.models.file_metadata import FileMetadataCreate, FileMetadataInDB
from bson import ObjectId
from typing import Optional

class FileMetadataRepository():
    def __init__(self):
        super().__init__()
        self.collection = file_metadata_collection

    async def create(self, file_metadata: FileMetadataCreate) -> str:
        file_metadata_dict = file_metadata.model_dump()
        result = await self.collection.insert_one(file_metadata_dict)
        return str(result.inserted_id)

    async def find_by_size_and_checksum(self, file_size: int, partial_checksum: str) -> Optional[FileMetadataInDB]:
        result = await self.collection.find_one({"file_size": file_size, "partial_checksum": partial_checksum})
        if result:
            return FileMetadataInDB(**result)
        return None

    async def update(self, id: str, file_metadata: FileMetadataCreate):
        await self.collection.update_one({"_id": ObjectId(id)}, {"$set": file_metadata.dict()})

    async def delete(self, id: str):
        await self.collection.delete_one({"_id": ObjectId(id)})