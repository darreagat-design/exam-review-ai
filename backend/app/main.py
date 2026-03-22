from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.db.session import init_db

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Sprint 1 backend scaffold for Exam Review AI.",
)


@app.on_event("startup")
def on_startup() -> None:
    """Create local tables for the MVP scaffold."""
    init_db()


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Simple health endpoint for local verification."""
    return {"status": "ok", "app": settings.app_name}


app.include_router(api_router, prefix="/api")
