from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_reviews_placeholder() -> dict[str, str]:
    """Placeholder endpoint for future review batch queries."""
    return {"message": "Review endpoints will be added in a later sprint."}
