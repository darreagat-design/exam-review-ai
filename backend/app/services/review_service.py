import json

from sqlalchemy.orm import Session, selectinload

from app.db.models import ProcessedExam, ReviewBatch


class ReviewService:
    """Service layer for creating and listing review batches."""

    def create_review_batch(
        self,
        db: Session,
        answer_key_filename: str,
        answer_key_structure: dict[str, object],
        processed_exams_data: list[dict[str, str | None]],
        review_status: str,
    ) -> ReviewBatch:
        review_batch = ReviewBatch(
            title="Revision en espera",
            answer_key_filename=answer_key_filename,
            answer_key_structure_json=json.dumps(answer_key_structure, ensure_ascii=False),
            status=review_status,
            total_student_exams=len(processed_exams_data),
        )
        db.add(review_batch)
        db.flush()

        review_batch.title = f"Revision {review_batch.id}"

        for exam_data in processed_exams_data:
            db.add(
                ProcessedExam(
                    review_batch_id=review_batch.id,
                    student_name=exam_data.get("student_name"),
                    student_identifier=exam_data.get("student_id"),
                    source_filename=str(exam_data["student_exam_filename"]),
                    processing_status=str(exam_data["status"]),
                    result_json=exam_data.get("result_json"),
                )
            )

        db.commit()
        db.refresh(review_batch)
        return review_batch

    def list_review_batches(self, db: Session) -> list[ReviewBatch]:
        return (
            db.query(ReviewBatch)
            .order_by(ReviewBatch.created_at.desc(), ReviewBatch.id.desc())
            .all()
        )

    def get_review_batch_by_id(self, db: Session, review_id: int) -> ReviewBatch | None:
        return (
            db.query(ReviewBatch)
            .options(selectinload(ReviewBatch.processed_exams))
            .filter(ReviewBatch.id == review_id)
            .first()
        )

    def get_processed_exam_by_id(self, db: Session, processed_exam_id: int) -> ProcessedExam | None:
        return (
            db.query(ProcessedExam)
            .options(selectinload(ProcessedExam.review_batch))
            .filter(ProcessedExam.id == processed_exam_id)
            .first()
        )
