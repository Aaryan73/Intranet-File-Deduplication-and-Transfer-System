import os
import shutil
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.config import settings
from app.utils.datetime_utils import datetime_now


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup events
    print("Booting up!")
    yield
    # Shutdown events
    print("Peace out!")