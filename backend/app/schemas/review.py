from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReviewBatchBase(BaseModel):
    """Shared response data for review batches."""

    id: int
    title: str
    answer_key_filename: str | None
    total_student_exams: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewBatchCreateResponse(BaseModel):
    """Response returned after creating a review batch."""

    mensaje: str
    review: ReviewBatchBase


class ReviewBatchListResponse(BaseModel):
    """Response returned when listing stored review batches."""

    revisiones: list[ReviewBatchBase]


class ProcessedExamDetail(BaseModel):
    """Processed exam metadata included in the review detail view."""

    id: int
    student_exam_filename: str
    student_name: str | None
    student_id: str | None
    status: str
    parsing_status: str
    series_detected: int
    questions_detected: int
    correct_answers: int
    incorrect_answers: int
    review_answers: int
    score_suggested: float | None
    semantic_matches: int
    final_status: str
    warnings_count: int
    needs_clarification: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewBatchDetail(ReviewBatchBase):
    """Detailed review batch response including related exam uploads."""

    answer_key_structure_json: str | None
    processed_exams: list[ProcessedExamDetail]


class ReviewBatchDetailResponse(BaseModel):
    """Response returned when requesting a single review batch."""

    revision: ReviewBatchDetail
