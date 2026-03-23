from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.db.session import init_db

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend para la gestion de revisiones academicas de Exam Review AI.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
