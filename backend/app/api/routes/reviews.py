import json
from collections.abc import Sequence

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.review import (
    ReviewBatchCreateResponse,
    ReviewBatchDetailResponse,
    ReviewBatchListResponse,
)
from app.services.review_service import ReviewService
from app.services.llm_service import LLMService
from app.services.exam_result_service import ExamResultService
from app.tools.answer_compare_tool import compare_answer_structures
from app.tools.answer_key_validator_tool import validate_answer_key_text
from app.tools.header_parser_tool import parse_exam_header
from app.tools.question_parser_tool import parse_questions
from app.tools.series_parser_tool import parse_series, parse_series_sections
from app.tools.student_exam_validator_tool import validate_student_exam_text
from app.tools.text_reader_tool import read_text_file

router = APIRouter()
review_service = ReviewService()
llm_service = LLMService()
exam_result_service = ExamResultService()


@router.post(
    "",
    response_model=ReviewBatchCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    answer_key: UploadFile | None = File(default=None),
    student_exams: Sequence[UploadFile] | None = File(default=None),
    db: Session = Depends(get_db),
) -> ReviewBatchCreateResponse:
    """Create a review batch after validating text-based uploads."""
    if answer_key is None or not answer_key.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes cargar un answer key antes de procesar la revision.",
        )

    valid_student_exams = [
        student_exam
        for student_exam in (student_exams or [])
        if student_exam.filename
    ]
    if not valid_student_exams:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes cargar al menos un examen de estudiante.",
        )

    answer_key_bytes = answer_key.file.read()
    answer_key_read_result = read_text_file(answer_key_bytes, answer_key.filename)
    if answer_key_read_result.text is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=answer_key_read_result.error or "La answer key no se pudo leer.",
        )

    answer_key_validation = validate_answer_key_text(answer_key_read_result.text)
    if not answer_key_validation.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=answer_key_validation.message,
        )

    answer_key_series_sections = parse_series_sections(answer_key_read_result.text)
    answer_key_structure = {
        "series": parse_series(answer_key_read_result.text),
        "questions": parse_questions(
            answer_key_read_result.text,
            is_answer_key=True,
            series_sections=answer_key_series_sections,
        ),
    }

    processed_exams_data: list[dict[str, str | None]] = []
    rejected_exams = 0
    requires_review_exams = 0

    for student_exam in valid_student_exams:
        student_exam_bytes = student_exam.file.read()
        text_read_result = read_text_file(student_exam_bytes, student_exam.filename)

        if text_read_result.text is None:
            result_json = exam_result_service.build_error_contract(
                exam_filename=student_exam.filename,
                answer_key_filename=answer_key.filename,
                message=text_read_result.error or "No se pudo leer el examen.",
                exam_mime_type=student_exam.content_type,
            )
            processed_exams_data.append(
                {
                    "student_exam_filename": student_exam.filename,
                    "student_name": None,
                    "student_id": None,
                    "status": "rechazado",
                    "result_json": result_json,
                }
            )
            rejected_exams += 1
            continue

        header_result = parse_exam_header(text_read_result.text)
        exam_validation = validate_student_exam_text(
            text=text_read_result.text,
            filename=student_exam.filename,
        )
        exam_series_sections = parse_series_sections(text_read_result.text)
        parsed_exam_structure = {
            "series": parse_series(text_read_result.text),
            "questions": parse_questions(
                text_read_result.text,
                is_answer_key=False,
                series_sections=exam_series_sections,
            ),
        }

        parsed_question_count = len(parsed_exam_structure["questions"])
        parsed_series_count = len(parsed_exam_structure["series"])
        comparison_result = None
        warnings: list[str] = []
        tool_trace = [
            {
                "tool": "extract_text_tool",
                "reason": "Se extrajo texto simple del archivo del estudiante.",
                "success": True,
            },
            {
                "tool": "header_parser_tool",
                "reason": "Se intento detectar nombre y carne en el encabezado.",
                "success": True,
            },
            {
                "tool": "series_parser_tool",
                "reason": "Se detectaron series e instrucciones de puntaje.",
                "success": parsed_series_count > 0,
            },
            {
                "tool": "question_parser_tool",
                "reason": "Se detectaron preguntas numeradas y respuestas del estudiante.",
                "success": parsed_question_count > 0,
            },
        ]

        exam_status = exam_validation.status
        if exam_status == "valido" and parsed_question_count > 0:
            exam_status = "parseado"
        elif exam_status == "valido" and parsed_question_count == 0:
            exam_status = "requiere_revision"
            warnings.append("No se pudo parsear el examen con suficiente claridad.")

        if exam_status == "parseado":
            comparison_result = compare_answer_structures(
                answer_key_structure=answer_key_structure,
                exam_structure=parsed_exam_structure,
                semantic_evaluator=llm_service,
            )
            exam_status = str(comparison_result["comparison_status"])
            question_results = comparison_result.get("comparison_summary", {}).get("question_results", [])
            used_semantic = any(
                question.get("grading_mode") == "semantic_short" for question in question_results
            )
            tool_trace.append(
                {
                    "tool": "answer_compare_tool",
                    "reason": "Se compararon respuestas del estudiante con la answer key.",
                    "success": True,
                }
            )
            if used_semantic:
                tool_trace.append(
                    {
                        "tool": "semantic_short_evaluator",
                        "reason": "Se evaluaron respuestas cortas con apoyo semantico controlado.",
                        "success": llm_service.is_available,
                    }
                )

        if exam_status == "rechazado":
            rejected_exams += 1
        elif exam_status == "requiere_revision":
            requires_review_exams += 1

        result_json = exam_result_service.build_contract(
            exam_filename=student_exam.filename,
            answer_key_filename=answer_key.filename,
            student_name=header_result.student_name,
            student_id=header_result.student_id,
            exam_status=exam_status,
            exam_mime_type=student_exam.content_type,
            parsed_exam_structure=parsed_exam_structure,
            comparison_result=comparison_result,
            warnings=warnings,
            tool_trace=tool_trace,
        )

        processed_exams_data.append(
            {
                "student_exam_filename": student_exam.filename,
                "student_name": header_result.student_name,
                "student_id": header_result.student_id,
                "status": exam_status,
                "result_json": result_json,
            }
        )

    if rejected_exams == len(processed_exams_data):
        review_status = "rechazada"
    elif rejected_exams == 0 and requires_review_exams == 0:
        review_status = "validada"
    else:
        review_status = "requiere_revision"

    review_batch = review_service.create_review_batch(
        db=db,
        answer_key_filename=answer_key.filename,
        answer_key_structure=answer_key_structure,
        processed_exams_data=processed_exams_data,
        review_status=review_status,
    )

    if review_status == "validada":
        message = "La revision fue creada correctamente y todos los examenes fueron validados."
    elif review_status == "rechazada":
        message = (
            "La revision fue creada, pero todos los examenes quedaron rechazados y requieren "
            "correccion antes de continuar."
        )
    else:
        message = (
            "La revision fue creada, pero algunos examenes quedaron marcados para revision o rechazo."
        )

    return ReviewBatchCreateResponse(
        mensaje=message,
        review=review_batch,
    )


@router.get("", response_model=ReviewBatchListResponse)
def list_reviews(db: Session = Depends(get_db)) -> ReviewBatchListResponse:
    """Return review batches stored in SQLite."""
    return ReviewBatchListResponse(
        revisiones=review_service.list_review_batches(db=db),
    )


@router.get("/{review_id}", response_model=ReviewBatchDetailResponse)
def get_review_detail(review_id: int, db: Session = Depends(get_db)) -> ReviewBatchDetailResponse:
    """Return a single review batch with its associated uploaded exams."""
    review_batch = review_service.get_review_batch_by_id(db=db, review_id=review_id)
    if review_batch is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La revision solicitada no existe.",
        )

    return ReviewBatchDetailResponse(revision=review_batch)
