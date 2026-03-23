import re
from dataclasses import dataclass


@dataclass
class AnswerKeyValidationResult:
    is_valid: bool
    message: str


def validate_answer_key_text(text: str) -> AnswerKeyValidationResult:
    """Apply lightweight heuristics to detect an answer key or guide-like document."""
    normalized_text = text.strip()
    numbered_questions = re.findall(r"(?m)^\s*(\d+[\.\)])\s+", normalized_text)
    answer_markers = re.findall(
        r"(?im)(respuesta\s+correcta|respuesta|solucion|clave|correcta)\s*[:\-]",
        normalized_text,
    )
    line_count = len([line for line in normalized_text.splitlines() if line.strip()])

    has_reasonable_structure = bool(numbered_questions) and bool(answer_markers)
    has_enough_content = len(normalized_text) >= 60 and line_count >= 3

    if has_reasonable_structure and has_enough_content:
        return AnswerKeyValidationResult(
            is_valid=True,
            message="La answer key tiene una estructura valida.",
        )

    return AnswerKeyValidationResult(
        is_valid=False,
        message=(
            "La answer key no parece valida. Debe incluir texto legible y una estructura "
            "basica con preguntas numeradas o respuestas correctas."
        ),
    )
