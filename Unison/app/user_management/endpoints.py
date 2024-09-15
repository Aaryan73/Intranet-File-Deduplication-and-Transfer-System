"""
API endpoints for user management in the Unison.

This module defines FastAPI route handlers for user-related operations such as
user creation, authentication, profile management, OTP verification, and admin functions.
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.user_management.repositories import user_repository as user
from app.user_management.schemas import UserCreate, User, Token, UserUpdate, OTPRequest, OTPVerify, PasswordReset
from app.utils.security_utils import verify_otp
from app.core.security import (
    get_current_active_user,
    get_current_active_superuser,
    create_access_token,
    create_refresh_token,
    authenticate_user,
    verify_refresh_token,
    generate_otp
)

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user_in: UserCreate) -> Any:
    """
    Register a new user.
    """
    existing_user = await user.find_by_email(email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    new_user = await user.create(user_in)
    # TODO: Set up a verification link that will be sent to the registered email
    # For now, a superuser will verify the registred accounts.
    return new_user.model_dump()

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    authenticated_user = await authenticate_user(form_data.username, form_data.password)
    if not authenticated_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    if not authenticated_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    
    if False:
        # TODO: Need to setup otp based login
        return {"access_token": "otp_required", "refresh_token": "otp_required", "token_type": "bearer"}
    
    access_token = create_access_token(
        data={"sub":authenticated_user.id})
    refresh_token = create_refresh_token(
        data={"sub":authenticated_user.id})
    await user.update_last_login(str(authenticated_user.id))
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh_token", response_model=Token)
async def refresh_token(refresh_token: str):
    authenticated_user = await verify_refresh_token(refresh_token=refresh_token)
    new_access_token = create_access_token(
        data={"sub":authenticated_user.id})
    # TODO: Rotating refresh token with each new request with same absolute
    # expiration time
    new_refresh_token = refresh_token
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.post("/login/otp", response_model=Token)
async def verify_login_otp(otp: OTPVerify, current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Verify OTP for login when OTP is enabled.
    """
    if verify_otp(current_user.otp_secret, otp.otp_code):
        access_token = create_access_token(subject=current_user.id)
        access_token = create_access_token(
            data={"sub":current_user.id})
        refresh_token = create_refresh_token(
            data={"sub":current_user.id})
        await user.update_last_login(current_user.id)
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

@router.post("/verify_otp")
async def verify_user(
    otp_verify: OTPVerify,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Verify user's email using OTP.
    """
    if current_user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already verified")
    if verify_otp(current_user.otp_secret, otp_verify.otp_code):
        if await user.verify_user(current_user.id):
            return {"message": "OTP verified successfully"}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

@router.post("/reset_password")
async def reset_password(otp_request: OTPRequest):
    existing_user = await user.find_by_email(otp_request.email)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    otp = generate_otp(existing_user)

    # TODO: Send OTP to user's email
    # For now, we'll just return the OTP (this should be removed in production)
    return {"message": "OTP sent to email", "otp": otp}

@router.post("/reset_password_confirm")
async def reset_password_confirm(data: PasswordReset
)-> Any:
    current_user = await user.find_by_email(data.email)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if verify_otp(current_user.otp_secret, data.otp):
        if await user.update_password(current_user.id, data.new_password):
            return {"message": "Password reset successfully"}
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    current_user.id = str(current_user.id)
    return User(**current_user.model_dump())

@router.put("/me", response_model=User)
async def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    updated_user = await user.update(current_user.id, user_in)
    if not updated_user:
        raise HTTPException(status_code=400, detail="Could not update data")
    await user.update_last_login(updated_user.id)
    updated_user.id = str(updated_user.id)
    return User(**updated_user.model_dump())

@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Get a specific user by id.
    """
    user_data = await user.find_by_id(user_id=user_id)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user_data.id = str(user_data.id)
    return user_data

@router.get("/", response_model=List[User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = await user.get_multi(skip=skip, limit=limit)
    for user_data in users:
        user_data.id = str(user_data.id)
    return users

@router.post("/{user_id}/activate", response_model=User)
async def activate_user(
    user_id: str,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Activate a user.
    """
    user_data = await user.find_by_id(user_id=user_id)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user_data.is_active = True
    updated_user = await user.update(user_id, user_data)
    updated_user.id = str(updated_user.id)
    return updated_user

@router.post("/{user_id}/deactivate", response_model=User)
async def deactivate_user(
    user_id: str,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Deactivate a user.
    """
    user_data = await user.find_by_id(user_id=user_id)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user_data.is_active = False
    updated_user = await user.update(user_id, user_data)
    updated_user.id = str(updated_user.id)
    return updated_user

@router.delete("/{user_id}", response_model=User)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Delete a user.
    """
    user_data = await user.get(id=user_id)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    deleted = await user.delete(user_id=user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user",
        )
    return user_data