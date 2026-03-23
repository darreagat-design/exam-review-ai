import re
import unicodedata
from collections import defaultdict
from typing import Any, Protocol


class SemanticEvaluator(Protocol):
    @property
    def is_available(self) -> bool: ...

    def evaluate_short_answer(
        self,
        *,
        question_text: str,
        expected_answer: str,
        student_answer: str,
    ) -> Any: ...


def compare_answer_structures(
    answer_key_structure: dict[str, Any],
    exam_structure: dict[str, Any],
    semantic_evaluator: SemanticEvaluator | None = None,
) -> dict[str, Any]:
    """Compare parsed answer key and parsed exam structures deterministically."""
    answer_questions = answer_key_structure.get("questions", [])
    exam_questions = exam_structure.get("questions", [])
    answer_series = answer_key_structure.get("series", [])

    answer_lookup: dict[tuple[str | None, int], dict[str, Any]] = {}
    fallback_lookup: dict[int, list[dict[str, Any]]] = defaultdict(list)

    for question in answer_questions:
        series_key = _normalize_series_title(question.get("series_title"))
        question_number = int(question.get("question_number"))
        answer_lookup[(series_key, question_number)] = question
        fallback_lookup[question_number].append(question)

    comparison_details: list[dict[str, Any]] = []
    series_results: dict[str, dict[str, Any]] = {}

    for question in exam_questions:
        series_title = question.get("series_title")
        series_key = _normalize_series_title(series_title)
        question_number = int(question.get("question_number"))

        matched_answer = answer_lookup.get((series_key, question_number))
        used_fallback_match = False
        review_reason = None

        if matched_answer is None:
            fallback_matches = fallback_lookup.get(question_number, [])
            if len(fallback_matches) == 1:
                matched_answer = fallback_matches[0]
                used_fallback_match = True
                if series_key is not None:
                    review_reason = "Serie ambigua, se uso coincidencia por numero."
            elif len(fallback_matches) > 1:
                review_reason = "No se pudo determinar la serie correcta para comparar."

        student_answer = question.get("student_answer")
        expected_answer = matched_answer.get("expected_answer") if matched_answer else None
        grading_mode = "review"

        if matched_answer is None:
            result = "review"
            review_reason = review_reason or "No se encontro una respuesta esperada para la pregunta."
        elif used_fallback_match and series_key is not None:
            result = "review"
            review_reason = review_reason or "La serie del examen no coincide claramente con la answer key."
        elif not student_answer or not expected_answer:
            result = "review"
            review_reason = review_reason or "Falta respuesta del estudiante o respuesta esperada."
        else:
            if _normalize_answer(student_answer) == _normalize_answer(expected_answer):
                result = "correct"
                grading_mode = "exact"
                review_reason = "Coincidencia exacta o normalizada."
            elif _is_semantic_short_candidate(
                question_text=str(question.get("question_text") or matched_answer.get("question_text") or ""),
                expected_answer=str(expected_answer),
                student_answer=str(student_answer),
            ):
                if semantic_evaluator is None:
                    result = "review"
                    grading_mode = "review"
                    review_reason = "La respuesta requiere semantic_short y no hay evaluador disponible."
                else:
                    semantic_result = semantic_evaluator.evaluate_short_answer(
                        question_text=str(
                            question.get("question_text") or matched_answer.get("question_text") or ""
                        ),
                        expected_answer=str(expected_answer),
                        student_answer=str(student_answer),
                    )
                    result = str(semantic_result.verdict)
                    grading_mode = "semantic_short" if semantic_evaluator.is_available else "review"
                    review_reason = semantic_result.reason
            else:
                result = "incorrect"
                grading_mode = "exact"
                review_reason = "La respuesta no coincide con la answer key."

        effective_series_title = series_title or matched_answer.get("series_title") or "Sin serie"
        series_entry = series_results.setdefault(
            effective_series_title,
            {
                "series_title": effective_series_title,
                "question_count": 0,
                "points_per_item": _resolve_points_per_item(
                    answer_series,
                    answer_questions,
                    effective_series_title,
                ),
                "correct_count": 0,
                "incorrect_count": 0,
                "review_count": 0,
                "subtotal_awarded": 0.0,
            },
        )

        series_entry["question_count"] += 1
        if result == "correct":
            series_entry["correct_count"] += 1
            awarded_points = float(series_entry["points_per_item"]) if series_entry["points_per_item"] is not None else None
            if series_entry["points_per_item"] is not None:
                series_entry["subtotal_awarded"] += float(series_entry["points_per_item"])
        elif result == "incorrect":
            series_entry["incorrect_count"] += 1
            awarded_points = 0.0 if series_entry["points_per_item"] is not None else None
        else:
            series_entry["review_count"] += 1
            awarded_points = None

        comparison_details.append(
            {
                "question_number": question_number,
                "series_title": effective_series_title,
                "question_text": question.get("question_text") or matched_answer.get("question_text"),
                "student_answer": student_answer,
                "expected_answer": expected_answer,
                "grading_mode": grading_mode,
                "comparison_result": result,
                "reason": review_reason,
                "result": result,
                "review_reason": review_reason,
                "awarded_points": awarded_points,
            }
        )

    total_score = 0.0
    score_complete = True
    ordered_series_breakdown = []
    for series_entry in series_results.values():
        if series_entry["points_per_item"] is None:
            series_entry["subtotal_awarded"] = None
            score_complete = False
        else:
            series_entry["subtotal_awarded"] = round(float(series_entry["subtotal_awarded"]), 2)
            total_score += float(series_entry["subtotal_awarded"])
        ordered_series_breakdown.append(series_entry)

    correct_answers = sum(1 for item in comparison_details if item["result"] == "correct")
    incorrect_answers = sum(1 for item in comparison_details if item["result"] == "incorrect")
    review_answers = sum(1 for item in comparison_details if item["result"] == "review")
    compared_questions = correct_answers + incorrect_answers

    comparison_summary = {
        "total_questions": len(exam_questions),
        "compared_questions": compared_questions,
        "correct_answers": correct_answers,
        "incorrect_answers": incorrect_answers,
        "review_answers": review_answers,
        "score_suggested": round(total_score, 2) if score_complete else None,
        "series_breakdown": ordered_series_breakdown,
        "question_results": comparison_details,
    }

    comparison_status = "requiere_revision" if review_answers > 0 else "evaluado"
    return {
        "comparison_summary": comparison_summary,
        "comparison_status": comparison_status,
    }


def _is_semantic_short_candidate(
    *,
    question_text: str,
    expected_answer: str,
    student_answer: str,
) -> bool:
    normalized_question = _normalize_answer(question_text)
    disallowed_signals = ("explique", "justifique", "analice", "desarrolle", "argumente")
    if any(signal in normalized_question for signal in disallowed_signals):
        return False

    positive_signals = ("quees", "quehace", "defina", "mencione")
    if not any(signal in normalized_question for signal in positive_signals):
        return False

    expected_words = _word_count(expected_answer)
    student_words = _word_count(student_answer)
    if expected_words == 0 or student_words == 0:
        return False

    if expected_words > 18 or student_words > 22:
        return False

    if len(student_answer.strip()) > 140 or len(expected_answer.strip()) > 100:
        return False

    if len(_normalize_answer(expected_answer)) <= 1:
        return False

    return True


def _word_count(value: str) -> int:
    return len([word for word in re.split(r"\s+", value.strip()) if word])


def _normalize_answer(value: str) -> str:
    normalized_value = unicodedata.normalize("NFD", value.strip().lower())
    without_accents = "".join(
        character for character in normalized_value if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[\W_]+", "", without_accents)


def _normalize_series_title(value: str | None) -> str | None:
    if value is None:
        return None
    return re.sub(r"\s+", " ", value.strip().lower())


def _resolve_points_per_item(
    answer_series: list[dict[str, Any]],
    answer_questions: list[dict[str, Any]],
    series_title: str,
) -> float | None:
    normalized_target = _normalize_series_title(series_title)
    for series in answer_series:
        if _normalize_series_title(series.get("title")) != normalized_target:
            continue

        points_per_item = series.get("points_per_item")
        if points_per_item is not None:
            return float(points_per_item)

        total_points = series.get("total_points")
        if total_points is None:
            return None

        question_count = len(
            [
                question
                for question in answer_questions
                if _normalize_series_title(question.get("series_title")) == normalized_target
            ]
        )
        if question_count > 0:
            return round(float(total_points) / question_count, 2)
        return None

    return None
