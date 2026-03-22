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
    student_identifier: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source_filename: Mapped[str] = mapped_column(String(255))
    processing_status: Mapped[str] = mapped_column(String(50), default="uploaded")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    review_batch: Mapped[ReviewBatch] = relationship(back_populates="processed_exams")
