"""
Pydantic schemas for User-related operations in the Unison.

This module defines various Pydantic models used for data validation and serialization
in user-related API endpoints.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime

from app.core.config import settings


def validate_password(password: Optional[str]) -> Optional[str]:
    if password is None:
        return None
    if len(password) < 8 or len(password) > 100:
        raise ValueError('Password must be between 8 and 100 characters')
    if not any(char.isdigit() for char in password):
        raise ValueError('Password must contain at least one digit')
    if not any(char.isupper() for char in password):
        raise ValueError('Password must contain at least one uppercase letter')
    if not any(char.islower() for char in password):
        raise ValueError('Password must contain at least one lowercase letter')
    if not any(char in "!@#$%^&*()-+?_=,<>/" for char in password):
        raise ValueError('Password must contain at least one special character')
    return password

def validate_email_domain(email: str) -> str:
    domain = email.split('@')[-1]
    if domain != settings.ALLOWED_EMAIL_DOMAIN:
        raise ValueError(f"Email domain must be {settings.ALLOWED_EMAIL_DOMAIN}")
    return email

class UserBase(BaseModel):
    email: EmailStr
    institution_id: str
    first_name: str
    last_name: str

    @field_validator('email')
    def validate_email_domain(cls, email):
        return validate_email_domain(email)

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    def validate_password(cls, password):
        return validate_password(password)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    institution_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

    @field_validator('password')
    def validate_password(cls, password):
        return validate_password(password)

    @field_validator('email')
    def validate_email_domain(cls, email):
        if email is None:
            return None
        return validate_email_domain(email)

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
    otp_secret: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: str
    otp: str

class PasswordReset(BaseModel):
    email: str
    otp: str
    new_password: str

    @field_validator('new_password')
    def validate_password(cls, password):
        return validate_password(password)