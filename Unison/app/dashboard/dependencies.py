from fastapi import Depends
from app.dashboard.repositories import TransactionRepository
from app.dashboard.services import TransactionService

def get_transaction_repository():
    return TransactionRepository()

def get_transaction_service(repo: TransactionRepository = Depends(get_transaction_repository)):
    return TransactionService(repo)