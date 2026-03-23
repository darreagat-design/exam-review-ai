import json
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ReviewBatch(Base):
    """Represents a future grading batch created by a user upload."""

    __tablename__ = "review_batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), default="Untitled Review Batch")
    status: Mapped[str] = mapped_column(String(50), default="pending")
    answer_key_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    answer_key_structure_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_student_exams: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    processed_exams: Mapped[list["ProcessedExam"]] = relationship(
        back_populates="review_batch",
        cascade="all, delete-orphan",
    )


class ProcessedExam(Base):
    """Stores metadata for an exam file linked to a review batch."""

    __tablename__ = "processed_exams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    review_batch_id: Mapped[int] = mapped_column(ForeignKey("review_batches.id"), index=True)
    student_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    student_identifier: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source_filename: Mapped[str] = mapped_column(String(255))
    processing_status: Mapped[str] = mapped_column(String(50), default="uploaded")
    result_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    review_batch: Mapped[ReviewBatch] = relationship(back_populates="processed_exams")

    @property
    def student_exam_filename(self) -> str:
        return self.source_filename

    @property
    def student_id(self) -> str | None:
        return self.student_identifier

    @property
    def status(self) -> str:
        return self.processing_status

    @property
    def series_detected(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("parsing_summary", {}).get("series_detected", 0))

    @property
    def questions_detected(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("parsing_summary", {}).get("questions_detected", 0))

    @property
    def parsing_status(self) -> str:
        parsed_result = _load_json(self.result_json)
        if not parsed_result:
            return "sin_parsing"
        return str(parsed_result.get("extracted_data", {}).get("parsing_status", "sin_parsing"))

    @property
    def correct_answers(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("correct_answers", 0))

    @property
    def incorrect_answers(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("incorrect_answers", 0))

    @property
    def review_answers(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("review_answers", 0))

    @property
    def score_suggested(self) -> float | None:
        parsed_result = _load_json(self.result_json)
        score = parsed_result.get("extracted_data", {}).get("score_suggested")
        return float(score) if score is not None else None

    @property
    def semantic_matches(self) -> int:
        parsed_result = _load_json(self.result_json)
        return int(parsed_result.get("extracted_data", {}).get("semantic_matches", 0))

    @property
    def final_status(self) -> str:
        parsed_result = _load_json(self.result_json)
        return str(parsed_result.get("status", "error"))

    @property
    def warnings_count(self) -> int:
        parsed_result = _load_json(self.result_json)
        return len(parsed_result.get("warnings", []))

    @property
    def needs_clarification(self) -> bool:
        parsed_result = _load_json(self.result_json)
        return bool(parsed_result.get("needs_clarification", False))


def _load_json(raw_value: str | None) -> dict:
    if not raw_value:
        return {}

    try:
        parsed_value = json.loads(raw_value)
    except json.JSONDecodeError:
        return {}

    return parsed_value if isinstance(parsed_value, dict) else {}
