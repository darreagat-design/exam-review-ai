import json
from pathlib import Path
from typing import Any

from app.schemas.exam_contract import ProcessedExamContract, ToolTraceItem


class ExamResultService:
    """Builds the final structured exam contract stored in result_json."""

    def build_contract(
        self,
        *,
        exam_filename: str,
        answer_key_filename: str,
        student_name: str | None,
        student_id: str | None,
        exam_status: str,
        exam_mime_type: str | None,
        parsed_exam_structure: dict[str, Any],
        comparison_result: dict[str, Any] | None,
        warnings: list[str],
        tool_trace: list[dict[str, Any]],
    ) -> str:
        comparison_summary = (comparison_result or {}).get("comparison_summary", {})
        total_questions = len(parsed_exam_structure.get("questions", []))
        compared_questions = int(comparison_summary.get("compared_questions", 0))
        correct_answers = int(comparison_summary.get("correct_answers", 0))
        incorrect_answers = int(comparison_summary.get("incorrect_answers", 0))
        review_answers = int(comparison_summary.get("review_answers", 0))
        score_suggested = comparison_summary.get("score_suggested")
        series_breakdown = comparison_summary.get("series_breakdown", [])
        question_results = comparison_summary.get("question_results", [])

        top_level_status = self._map_top_level_status(exam_status)
        semantic_matches = len(
            [
                question
                for question in question_results
                if question.get("grading_mode") == "semantic_short"
            ]
        )

        if semantic_matches > 0:
            warnings.append("Se utilizo evaluacion semantica controlada en respuestas cortas.")
        if not student_name:
            warnings.append("No se detecto el nombre del estudiante.")
        if not student_id:
            warnings.append("No se detecto el carne del estudiante.")
        if review_answers > 0:
            warnings.append("Hay respuestas marcadas para revision manual.")
        if any(item.get("subtotal_awarded") is None for item in series_breakdown):
            warnings.append("Hay series con puntaje sugerido no totalmente determinado.")

        needs_clarification = top_level_status != "success" or review_answers > 0
        clarifying_questions = (
            [
                "¿Desea revisar manualmente las respuestas marcadas como review?",
                "¿Desea aceptar equivalencias semanticas parciales como correctas?",
            ]
            if needs_clarification
            else []
        )

        summary = (
            f"Se detectaron {total_questions} preguntas; "
            f"{correct_answers} correctas, {incorrect_answers} incorrectas y "
            f"{review_answers} en revision. "
            f"Puntaje sugerido: {score_suggested if score_suggested is not None else 'pendiente de revision'}."
        )

        contract = ProcessedExamContract(
            status=top_level_status,
            document_type="academic_document",
            summary=summary,
            extracted_data={
                "student_name": student_name,
                "student_id": student_id,
                "student_exam_filename": exam_filename,
                "answer_key_filename": answer_key_filename,
                "document_subtype": "exam_review",
                "file_metadata": {
                    "filename": exam_filename,
                    "extension": Path(exam_filename).suffix.lower(),
                    "mime_type": exam_mime_type,
                },
                "total_questions": total_questions,
                "compared_questions": compared_questions,
                "correct_answers": correct_answers,
                "incorrect_answers": incorrect_answers,
                "review_answers": review_answers,
                "score_suggested": score_suggested,
                "series_detected": len(parsed_exam_structure.get("series", [])),
                "series_breakdown": series_breakdown,
                "questions": question_results,
                "parsing_summary": {
                    "series_detected": len(parsed_exam_structure.get("series", [])),
                    "questions_detected": total_questions,
                },
                "parsing_status": "parseado" if total_questions > 0 else "requiere_revision",
                "comparison_summary": comparison_summary,
                "semantic_matches": semantic_matches,
            },
            warnings=warnings,
            needs_clarification=needs_clarification,
            clarifying_questions=clarifying_questions,
            tool_trace=[ToolTraceItem(**trace_item) for trace_item in tool_trace],
        )

        return contract.model_dump_json(ensure_ascii=False)

    def build_error_contract(
        self,
        *,
        exam_filename: str,
        answer_key_filename: str,
        message: str,
        exam_mime_type: str | None = None,
    ) -> str:
        contract = ProcessedExamContract(
            status="error",
            document_type="academic_document",
            summary=f"No fue posible procesar el examen {exam_filename}.",
            extracted_data={
                "student_name": None,
                "student_id": None,
                "student_exam_filename": exam_filename,
                "answer_key_filename": answer_key_filename,
                "document_subtype": "exam_review",
                "file_metadata": {
                    "filename": exam_filename,
                    "extension": Path(exam_filename).suffix.lower(),
                    "mime_type": exam_mime_type,
                },
                "total_questions": 0,
                "compared_questions": 0,
                "correct_answers": 0,
                "incorrect_answers": 0,
                "review_answers": 0,
                "score_suggested": None,
                "series_breakdown": [],
                "questions": [],
                "parsing_summary": {
                    "series_detected": 0,
                    "questions_detected": 0,
                },
                "parsing_status": "sin_parsing",
                "comparison_summary": {},
                "semantic_matches": 0,
            },
            warnings=[message],
            needs_clarification=True,
            clarifying_questions=[
                "¿Desea revisar manualmente el archivo rechazado?",
                "¿Desea volver a cargar este examen con un formato de texto mas claro?",
            ],
            tool_trace=[
                ToolTraceItem(
                    tool="extract_text_tool",
                    reason="Intento inicial de lectura del archivo.",
                    success=False,
                )
            ],
        )
        return contract.model_dump_json(ensure_ascii=False)

    def _map_top_level_status(self, exam_status: str) -> str:
        if exam_status in {"rechazado"}:
            return "error"
        if exam_status in {"requiere_revision"}:
            return "needs_review"
        return "success"
