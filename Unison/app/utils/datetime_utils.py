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
