import re
from dataclasses import dataclass


@dataclass
class StudentExamValidationResult:
    status: str
    message: str


def validate_student_exam_text(text: str, filename: str) -> StudentExamValidationResult:
    """Classify a student exam upload using simple text heuristics."""
    normalized_text = text.strip()
    line_count = len([line for line in normalized_text.splitlines() if line.strip()])
    has_header = bool(re.search(r"(?im)^\s*(nombre|carne|carn[eé])\s*:", normalized_text))
    has_question_markers = bool(re.search(r"(?m)^\s*(\d+[\.\)])\s+", normalized_text))
    has_answer_like_content = bool(
        re.search(r"(?im)(respuesta|desarrollo|opcion|opcion elegida|seleccion)", normalized_text)
    )

    if len(normalized_text) < 40 or line_count < 2:
        return StudentExamValidationResult(
            status="rechazado",
            message=f"El examen {filename} no tiene contenido suficiente.",
        )

    if has_header and (has_question_markers or has_answer_like_content):
        return StudentExamValidationResult(
            status="valido",
            message=f"El examen {filename} tiene una estructura valida.",
        )

    if has_question_markers or has_answer_like_content:
        return StudentExamValidationResult(
            status="requiere_revision",
            message=f"El examen {filename} requiere revision manual.",
        )

    return StudentExamValidationResult(
        status="rechazado",
        message=f"El examen {filename} no parece un examen o una respuesta de estudiante.",
    )
