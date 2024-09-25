from typing import List
from app.dashboard.repositories import TransactionRepository
from app.dashboard.models import TransactionModel
from app.dashboard.schemas import TransactionCreate, TransactionUpdate, TransactionResponse

class TransactionService:
    def __init__(self, repository: TransactionRepository):
        self.repository = repository

    async def create_transaction(self, transaction: TransactionCreate) -> str:
        transaction_model = TransactionModel(**transaction.model_dump())
        return await self.repository.create_transaction(transaction_model)

    async def update_transaction(self, transaction_id: str, transaction_update: TransactionUpdate) -> bool:
        return await self.repository.update_transaction(transaction_id, transaction_update.end_time, transaction_update.receiver_id)

    async def get_all_transactions(self) -> List[TransactionResponse]:
        transactions = await self.repository.get_all_transactions()
        return [TransactionResponse.model_validate(transaction) for transaction in transactions]