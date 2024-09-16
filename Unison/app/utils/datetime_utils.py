from datetime import datetime
import pytz
from app.core.config import settings

def datetime_now():
    """
    Get the current time based on the timezone specified in settings.

    Returns:
        datetime: Current time in the specified timezone.
    """
    try:
        timezone = pytz.timezone(settings.TIMEZONE)
    except pytz.UnknownTimeZoneError:
        raise ValueError(f"Unknown timezone specified: {settings.TIMEZONE}")
    
    return datetime.now(timezone)

def convert_to_timezone(date: datetime, target_timezone: str) -> datetime:
    """
    Convert a datetime object to the specified timezone.
    
    Args:
    date (datetime): The datetime object to convert
    target_timezone (str): The name of the target timezone (e.g., 'America/New_York')
    
    Returns:
    datetime: The converted datetime object
    """
    if date.tzinfo is None:
        # Assume UTC if the datetime is naive
        date = date.replace(tzinfo=pytz.UTC)
    
    target_tz = pytz.timezone(target_timezone)
    return date.astimezone(target_tz)

