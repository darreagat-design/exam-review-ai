import re
from dataclasses import dataclass


@dataclass
class HeaderParseResult:
    student_name: str | None
    student_id: str | None


def parse_exam_header(text: str) -> HeaderParseResult:
    """Extract basic header fields from plain-text student exams."""
    student_name_match = re.search(r"(?im)^\s*nombre\s*:\s*(.+)$", text)
    student_id_match = re.search(r"(?im)^\s*carn[eé]\s*:\s*(.+)$", text)

    student_name = _clean_header_value(student_name_match.group(1)) if student_name_match else None
    student_id = _clean_header_value(student_id_match.group(1)) if student_id_match else None

    return HeaderParseResult(student_name=student_name, student_id=student_id)


def _clean_header_value(value: str) -> str | None:
    cleaned_value = value.strip(" \t:-")
    return cleaned_value or None
