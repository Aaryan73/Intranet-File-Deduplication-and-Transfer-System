from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.synchronization_engine.api.endpoints import server_status
from app.user_management import endpoints as user_management_endpoints
from app.synchronization_engine.api.endpoints import file_metadata
from app.dashboard import endpoints as dashboard_endpoints
from app.core.events import lifespan
from app.core.config import settings

@asynccontextmanager
async def app_init(app: FastAPI):
    # Include  routers 

    app.include_router(user_management_endpoints.router, prefix=settings.API_STR+"/user", tags=["User Management"])
    app.include_router(file_metadata.router, prefix=settings.API_STR+"/file-metadata", tags=["File Metadata"])
    app.include_router(server_status.router, prefix=settings.API_STR+"/server-status", tags=["File Server Status"])
    app.include_router(dashboard_endpoints.router, prefix=settings.API_STR+"/dashboard", tags=["Dasboard"])

    # Start the upload lifespan events
    async with lifespan(app):
        yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_STR}/openapi.json",
    lifespan=app_init
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS], # noqa
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
