import re
from dataclasses import dataclass


@dataclass
class ParsedSeries:
    title: str
    instructions: str | None
    total_points: float | None
    points_per_item: float | None
    start_index: int | None = None
    end_index: int | None = None


def parse_series(text: str) -> list[dict[str, str | float | None]]:
    """Parse simple series headings and scoring hints from plain-text exam content."""
    parsed_sections = parse_series_sections(text)
    return [
        {
            "title": section.title,
            "instructions": section.instructions,
            "total_points": section.total_points,
            "points_per_item": section.points_per_item,
        }
        for section in parsed_sections
    ]


def parse_series_sections(text: str) -> list[ParsedSeries]:
    """Parse series headings and keep text spans so questions can be linked to each series."""
    normalized_text = text.strip()
    matches = list(
        re.finditer(
            r"(?im)^\s*((?:serie)\s+(?:[ivxlcdm]+|\d+|[a-z])(?:\s*[-–:]\s*.+)?)\s*$",
            normalized_text,
        )
    )

    if not matches:
        single_series = _build_series("Serie unica", normalized_text)
        if _series_has_signal(single_series):
            single_series.start_index = 0
            single_series.end_index = len(normalized_text)
            return [single_series]
        return []

    parsed_series: list[ParsedSeries] = []
    for index, match in enumerate(matches):
        start_index = match.start()
        end_index = matches[index + 1].start() if index + 1 < len(matches) else len(normalized_text)
        section_text = normalized_text[start_index:end_index].strip()
        parsed_series.append(_build_series(_normalize_title(match.group(1)), section_text))
        parsed_series[-1].start_index = start_index
        parsed_series[-1].end_index = end_index

    return parsed_series


def _build_series(title: str, section_text: str) -> ParsedSeries:
    instructions = _extract_instructions(section_text)
    total_points = _extract_total_points(section_text)
    points_per_item = _extract_points_per_item(section_text)
    return ParsedSeries(
        title=title,
        instructions=instructions,
        total_points=total_points,
        points_per_item=points_per_item,
    )


def _extract_instructions(section_text: str) -> str | None:
    lines = [line.strip() for line in section_text.splitlines() if line.strip()]
    filtered_lines = [line for line in lines if not re.match(r"(?im)^serie\s+", line)]
    if not filtered_lines:
        return None

    instruction_candidates = []
    for line in filtered_lines[:3]:
        if re.search(r"(?i)(vale|punto|instruccion|responda|complete|seleccione)", line):
            instruction_candidates.append(line)

    return " ".join(instruction_candidates) if instruction_candidates else None


def _extract_total_points(section_text: str) -> float | None:
    total_match = re.search(r"(?i)vale\s+(\d+(?:[\.,]\d+)?)\s+puntos?", section_text)
    if total_match:
        return float(total_match.group(1).replace(",", "."))
    return None


def _extract_points_per_item(section_text: str) -> float | None:
    direct_match = re.search(r"(?i)cada\s+pregunta\s+vale\s+(\d+(?:[\.,]\d+)?)\s+puntos?", section_text)
    if direct_match:
        return float(direct_match.group(1).replace(",", "."))

    cu_match = re.search(r"(?i)(\d+(?:[\.,]\d+)?)\s+puntos?\s+c/u", section_text)
    if cu_match:
        return float(cu_match.group(1).replace(",", "."))

    per_question_match = re.search(
        r"(?i)(\d+(?:[\.,]\d+)?)\s+punto[s]?\s+por\s+pregunta",
        section_text,
    )
    if per_question_match:
        return float(per_question_match.group(1).replace(",", "."))

    return None


def _series_has_signal(parsed_series: ParsedSeries) -> bool:
    return any(
        [
            parsed_series.instructions,
            parsed_series.total_points is not None,
            parsed_series.points_per_item is not None,
        ]
    )


def _normalize_title(raw_title: str) -> str:
    title = raw_title.strip()
    title = re.sub(r"\s+", " ", title)
    return title
