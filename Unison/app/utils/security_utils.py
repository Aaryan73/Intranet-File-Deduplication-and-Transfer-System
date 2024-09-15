import pyotp
from typing import Optional
from datetime import timedelta
from passlib.context import CryptContext
from app.core.config import settings

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a hashed password.

    Args:
        plain_password (str): The plain-text password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the password is correct, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generate a hash for a given password.

    Args:
        password (str): The plain-text password to hash.

    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def generate_otp_secret() -> str:
    """
    Generate a new OTP secret.

    Returns:
        str: A new OTP secret.
    """
    return pyotp.random_base32()

def verify_otp(otp_secret: str, otp_code: str, expires_delta: Optional[timedelta] = None) -> bool:
    """
    Verify an OTP code against a secret.

    Args:
        otp_secret (str): The OTP secret.
        otp_code (str): The OTP code to verify.

    Returns:
        bool: True if the OTP is valid, False otherwise.
    """
    if not expires_delta:
        expires_delta = settings.TOTP_VALID_WINDOW
    totp = pyotp.TOTP(otp_secret, interval=expires_delta)
    return totp.verify(otp_code)

def get_otp_uri(otp_secret: str, email: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Get the OTP URI for QR code generation.

    Args:
        otp_secret (str): The OTP secret.
        email (str): The user's email address.

    Returns:
        str: The OTP URI.
    """
    if not expires_delta:
        expires_delta = settings.OTP_VALID_WINDOW
    totp = pyotp.TOTP(otp_secret, interval=expires_delta)
    return totp.provisioning_uri(name=email, issuer_name=settings.PROJECT_NAME)