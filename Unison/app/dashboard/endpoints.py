from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.user_management.schemas import User
from app.dashboard.schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from app.dashboard.services import TransactionService
from app.dashboard.dependencies import get_transaction_service
from app.core.security import get_current_active_user, get_current_active_superuser


router = APIRouter()

@router.post("/transactions/", response_model=str)
async def create_transaction(
    transaction: TransactionCreate,
    service: TransactionService = Depends(get_transaction_service),
    current_user: User = Depends(get_current_active_user)
):
    transaction_id = await service.create_transaction(transaction)
    return transaction_id

@router.put("/transactions/{transaction_id}", response_model=bool)
async def update_transaction(
    transaction_id: str,
    transaction_update: TransactionUpdate,
    service: TransactionService = Depends(get_transaction_service),
    current_user: User = Depends(get_current_active_user)
):
    updated = await service.update_transaction(transaction_id, transaction_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated

@router.get("/transactions/", response_model=List[TransactionResponse])
async def get_all_transactions(
    service: TransactionService = Depends(get_transaction_service),
    current_superuser: User = Depends(get_current_active_superuser)

):
    return await service.get_all_transactions()