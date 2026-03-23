from typing import Any, Literal

from pydantic import BaseModel


class ToolTraceItem(BaseModel):
    tool: str
    reason: str
    success: bool


class ProcessedExamContract(BaseModel):
    """Final structured response contract required for each processed exam."""

    status: Literal["success", "needs_review", "error"]
    document_type: Literal["academic_document"]
    summary: str
    extracted_data: dict[str, Any]
    warnings: list[str]
    needs_clarification: bool
    clarifying_questions: list[str]
    tool_trace: list[ToolTraceItem]
