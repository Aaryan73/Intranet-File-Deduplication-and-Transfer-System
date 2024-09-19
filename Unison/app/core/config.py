import secrets
from typing import Any, List, Union
from pydantic import AnyHttpUrl, EmailStr, HttpUrl, field_validator
from pydantic_core.core_schema import ValidationInfo
from pydantic_settings import BaseSettings

def parse_cors(value: Any) -> Union[List[str], str]:
    """
    Parses CORS origins from a string or list.
    
    Args:
        value (Any): The CORS origins input.
        
    Returns:
        Union[List[str], str]: A list of CORS origins or the original string.
    """
    if isinstance(value, str) and not value.startswith("["):
        return [i.strip() for i in value.split(",")]
    elif isinstance(value, (list, str)):
        return value
    raise ValueError(f"Invalid CORS value: {value}")

class Settings(BaseSettings):
    """
    Settings for the Unison.
    """
    # Timezone settings
    TIMEZONE: str

    # API Settings
    API_STR: str = "/api"

    # Security Settings
    SECRET_KEY: str = secrets.token_urlsafe(32)
    TOTP_SECRET_KEY: str = secrets.token_urlsafe(32)
    TOTP_VALID_WINDOW: int = 60 # 60 seconds
    
    # Token expiration settings
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 60 * 30  # 30 minutes
    REFRESH_TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24 * 30  # 30 days
    JWT_ALGO: str
    TOTP_ALGO: str
    
    SERVER_NAME: str
    SERVER_HOST: AnyHttpUrl
    SERVER_BOT: str = "Symona"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: Union[List[AnyHttpUrl], str] = []
    
    PROJECT_NAME: str
    SENTRY_DSN: Union[HttpUrl, None] = None
    
    @field_validator("SENTRY_DSN", mode="before")
    def sentry_dsn_can_be_blank(cls, value: str) -> Union[str, None]:
        """
        Allows SENTRY_DSN to be blank.
        
        Args:
            value (str): The SENTRY_DSN value.
            
        Returns:
            Union[str, None]: The validated SENTRY_DSN value or None.
        """
        if isinstance(value, str) and len(value) == 0:
            return None
        return value
    
    # General settings
    MULTI_MAX: int = 20
    
    # Database settings
    MONGO_DATABASE: str
    MONGO_DATABASE_URI: str

    # Email domain settings
    ALLOWED_EMAIL_DOMAIN: str
    
    # Email settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: Union[str, None] = None
    SMTP_USER: Union[str, None] = None
    SMTP_PASSWORD: Union[str, None] = None
    EMAILS_FROM_EMAIL: Union[EmailStr, None] = None
    EMAILS_FROM_NAME: Union[str, None] = None
    EMAILS_TO_EMAIL: Union[EmailStr, None] = None
    
    @field_validator("EMAILS_FROM_NAME")
    def get_project_name(cls, value: Union[str, None], info: ValidationInfo) -> str:
        """
        Sets the default email sender name to the project name if not provided.
        
        Args:
            value (Union[str, None]): The email sender name.
            info (ValidationInfo): Additional validation information.
            
        Returns:
            str: The email sender name.
        """
        if not value:
            return info.data["PROJECT_NAME"]
        return value
    
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False
    
    @field_validator("EMAILS_ENABLED", mode="before")
    def get_emails_enabled(cls, value: bool, info: ValidationInfo) -> bool:
        """
        Enables emails if SMTP settings are configured.
        
        Args:
            value (bool): The EMAILS_ENABLED value.
            info (ValidationInfo): Additional validation information.
            
        Returns:
            bool: Whether emails are enabled.
        """
        return bool(info.data.get("SMTP_HOST") and info.data.get("SMTP_PORT") and info.data.get("EMAILS_FROM_EMAIL"))
    
    EMAIL_TEST_USER: EmailStr = "test@example.com"
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    USERS_OPEN_REGISTRATION: bool = True

    # Partial checksum calculation settings 
    CHUNK_SIZE: int = 1024 * 1024  # 1MB
    DOWNLOAD_LIMIT: int = 8 * 1024 * 1024  # Exactly 8MB
    MAX_DOWNLOAD_TIME:int = 60  # 1 minute, adjust as needed
    
    class Config:
        """
        Configuration for the Unison settings.
        """
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()