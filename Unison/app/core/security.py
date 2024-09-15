"""
Security utilities for the Unison.

This module provides functions and utilities for handling authentication and
authorization within the Unison application. It includes password hashing,
JWT token creation and validation, user authentication middlewares, and OTP functionality.
"""

import pyotp

from datetime import timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from bson import ObjectId

from app.core.config import settings
from app.user_management.models import UserInDB
from app.user_management.schemas import User

from app.user_management.repositories import user_repository
from app.utils.security_utils import verify_password
from app.utils.datetime_utils import datetime_now


# Initialize OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_STR}/user/token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token.

    Args:
        data (dict): The subject of the token, typically a user ID.
        expires_delta (Optional[timedelta]): Token expiration time. If not provided,
                                             default expiration from settings is used.

    Returns:
        str: Encoded JWT token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime_now() + expires_delta
    else:
        expire = datetime_now() + timedelta(seconds=settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    
    to_encode.update({"exp": expire, "refresh": False})
    for key, value in to_encode.items():
        if isinstance(value, ObjectId):
            to_encode[key] = str(value)
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGO)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token.

    Args:
        data (dict): The subject of the token, typically a user ID.
        expires_delta (Optional[timedelta]): Token expiration time. If not provided,
                                             default expiration from settings is used.

    Returns:
        str: Encoded JWT token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime_now() + expires_delta
    else:
        expire = datetime_now() + timedelta(seconds=settings.REFRESH_TOKEN_EXPIRE_SECONDS)

    to_encode.update({"exp": expire, "refresh": True})
    for key, value in to_encode.items():
        if isinstance(value, ObjectId):
            to_encode[key] = str(value)
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGO)
    return encoded_jwt

def generate_otp(data: UserInDB, expires_delta: Optional[timedelta] = None) -> str:
    if not expires_delta:
        expires_delta = settings.TOTP_VALID_WINDOW
    totp = pyotp.TOTP(data.otp_secret, interval=expires_delta)
    otp = totp.now()
    return otp

async def authenticate_user(email: str, password: str) -> Optional[User]:
    """
    Authenticate a user using email and password.

    Args:
        email (str): The user's email.
        password (str): The user's password.

    Returns:
        Optional[User]: The authenticated user if successful, None otherwise.
    """
    user = await user_repository.find_by_email(email=email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


async def verify_refresh_token(refresh_token: str) -> Optional[User]:
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGO])
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=400, detail="Invalid refresh token")
        if not payload.get("refresh"):
            raise HTTPException(status_code=400, detail="Not a refresh token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid refresh token")
    
    user = await user_repository.find_by_id(user_id=user_id)
    if user is None:
        raise HTTPException(status_code=400, detail="User not found")
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Get the current user based on the provided JWT token.

    This function validates the token and retrieves the corresponding user.

    Args:
        token (str): The JWT token provided in the request.

    Returns:
        User: The current authenticated user.

    Raises:
        HTTPException: If the token is invalid or the user is not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGO])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        if payload.get("refresh"):
            raise HTTPException(status_code=403, detail="Not an access token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token has expired")
    except JWTError:
        raise credentials_exception
    
    user = await user_repository.find_by_id(user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the current active user.

    This function checks if the authenticated user is active.

    Args:
        current_user (User): The current authenticated user.

    Returns:
        User: The current active user.

    Raises:
        HTTPException: If the user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_active_superuser(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the current active superuser.

    This function checks if the authenticated user is both active and a superuser.

    Args:
        current_user (User): The current authenticated user.

    Returns:
        User: The current active superuser.

    Raises:
        HTTPException: If the user is not a superuser.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user