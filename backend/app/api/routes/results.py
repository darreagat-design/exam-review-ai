import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.result import ExamResultDetailResponse
from app.services.review_service import ReviewService

router = APIRouter()
review_service = ReviewService()


@router.get("/{result_id}", response_model=ExamResultDetailResponse)
def get_processed_exam_result(
    result_id: int,
    db: Session = Depends(get_db),
) -> ExamResultDetailResponse:
    """Return the full stored result for a processed exam."""
    processed_exam = review_service.get_processed_exam_by_id(db=db, processed_exam_id=result_id)
    if processed_exam is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El resultado solicitado no existe.",
        )

    parsed_result = json.loads(processed_exam.result_json or "{}")
    return ExamResultDetailResponse(
        id=processed_exam.id,
        review_id=processed_exam.review_batch_id,
        review_title=processed_exam.review_batch.title,
        answer_key_filename=processed_exam.review_batch.answer_key_filename,
        student_exam_filename=processed_exam.source_filename,
        student_name=processed_exam.student_name,
        student_id=processed_exam.student_identifier,
        status=processed_exam.processing_status,
        summary=parsed_result.get("summary", "Sin resumen disponible."),
        score_suggested=parsed_result.get("extracted_data", {}).get("score_suggested"),
        result_json=parsed_result,
        created_at=processed_exam.created_at,
    )
