from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ExamResultDetailResponse(BaseModel):
    id: int
    review_id: int
    review_title: str
    answer_key_filename: str | None
    student_exam_filename: str
    student_name: str | None
    student_id: str | None
    status: str
    summary: str
    score_suggested: float | None
    result_json: dict[str, Any]
    created_at: datetime
