import re

from app.tools.series_parser_tool import ParsedSeries


def parse_questions(
    text: str,
    *,
    is_answer_key: bool,
    series_sections: list[ParsedSeries] | None = None,
) -> list[dict[str, str | int | None]]:
    """Parse numbered questions from simple plain-text answer keys and student exams."""
    normalized_text = text.strip()
    matches = list(re.finditer(r"(?m)^\s*(\d+)[\.\)]\s*(.+)$", normalized_text))
    if not matches:
        return []

    parsed_questions: list[dict[str, str | int | None]] = []
    for index, match in enumerate(matches):
        start_index = match.start()
        end_index = matches[index + 1].start() if index + 1 < len(matches) else len(normalized_text)
        block_text = normalized_text[start_index:end_index].strip()
        question_text = _extract_question_text(block_text)
        answer_text = _extract_answer_text(block_text)
        series_title = _find_series_for_question(match.start(), series_sections or [])

        parsed_questions.append(
            {
                "question_number": int(match.group(1)),
                "question_text": question_text,
                "series_title": series_title,
                "expected_answer": answer_text if is_answer_key else None,
                "student_answer": None if is_answer_key else answer_text,
            }
        )

    return parsed_questions


def _extract_question_text(block_text: str) -> str:
    lines = [line.strip() for line in block_text.splitlines() if line.strip()]
    if not lines:
        return ""

    first_line = re.sub(r"^\s*\d+[\.\)]\s*", "", lines[0]).strip()
    question_lines = [first_line]
    for line in lines[1:]:
        if re.search(r"(?i)(respuesta|respuesta correcta|solucion|clave)\s*[:\-]", line):
            break
        question_lines.append(line)

    return " ".join(question_lines).strip()


def _extract_answer_text(block_text: str) -> str | None:
    answer_match = re.search(
        r"(?im)(?:respuesta\s+correcta|respuesta|solucion|clave)\s*[:\-]\s*(.+)$",
        block_text,
    )
    if answer_match:
        return answer_match.group(1).strip()

    inline_match = re.search(r"(?i)\b([A-D])\b$", block_text.splitlines()[-1].strip())
    if inline_match:
        return inline_match.group(1)

    return None


def _find_series_for_question(question_index: int, series_sections: list[ParsedSeries]) -> str | None:
    for section in series_sections:
        if section.start_index is None or section.end_index is None:
            continue
        if section.start_index <= question_index < section.end_index:
            return section.title
    return None
