from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db import models  # noqa: F401


# SQLite needs this flag for local development when using FastAPI.
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Yield a database session for request handlers."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create tables for local development and early prototyping."""
    Base.metadata.create_all(bind=engine)
    _ensure_review_batch_columns()
    _ensure_processed_exam_columns()


def _ensure_review_batch_columns() -> None:
    """Add lightweight SQLite columns needed by newer sprints if they do not exist yet."""
    if not settings.database_url.startswith("sqlite"):
        return

    inspector = inspect(engine)
    if "review_batches" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("review_batches")}

    with engine.begin() as connection:
        if "total_student_exams" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE review_batches "
                    "ADD COLUMN total_student_exams INTEGER NOT NULL DEFAULT 0"
                )
            )
        if "answer_key_structure_json" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE review_batches "
                    "ADD COLUMN answer_key_structure_json TEXT"
                )
            )


def _ensure_processed_exam_columns() -> None:
    """Add lightweight SQLite columns needed by later sprints if they do not exist yet."""
    if not settings.database_url.startswith("sqlite"):
        return

    inspector = inspect(engine)
    if "processed_exams" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("processed_exams")}

    with engine.begin() as connection:
        if "student_name" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE processed_exams "
                    "ADD COLUMN student_name VARCHAR(255)"
                )
            )
        if "result_json" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE processed_exams "
                    "ADD COLUMN result_json TEXT"
                )
            )
