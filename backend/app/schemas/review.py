from pydantic import BaseModel


class ReviewPlaceholderResponse(BaseModel):
    """Simple response schema used by placeholder review endpoints."""

    message: str
