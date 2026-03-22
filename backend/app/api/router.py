from fastapi import APIRouter

from app.api.routes.reviews import router as reviews_router

api_router = APIRouter()
api_router.include_router(reviews_router, prefix="/reviews", tags=["reviews"])
