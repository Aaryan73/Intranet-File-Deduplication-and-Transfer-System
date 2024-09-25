
from bson import ObjectId
from typing import List
from app.dashboard.models import TransactionModel
from app.core.mongodb import transactions_collection
from datetime import datetime

class TransactionRepository:
    def __init__(self):
        self.collection = transactions_collection

    async def create_transaction(self, transaction: TransactionModel) -> str:
        result = await self.collection.insert_one(transaction.model_dump(by_alias=True))
        return str(result.inserted_id)

    async def update_transaction(self, transaction_id: str, end_time: datetime, receiver_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(transaction_id)},
            {"$set": {"end_time": end_time, "completed": True, "receiver_id": receiver_id}}
        )
        return result.modified_count > 0

    async def get_all_transactions(self) -> List[TransactionModel]:
        transactions = await self.collection.find().to_list(length=None)
        return [TransactionModel(**transaction) for transaction in transactions]