from typing import Literal

from pydantic import BaseModel

from app.core.config import settings

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - depends on installed package
    OpenAI = None  # type: ignore[assignment]


class SemanticEvaluationResult(BaseModel):
    verdict: Literal["correct", "incorrect", "review"]
    reason: str


class LLMService:
    """Thin wrapper around OpenAI for conservative short-answer semantic checks."""

    def __init__(self) -> None:
        self._is_available = bool(settings.openai_api_key and OpenAI is not None)
        self._client = OpenAI(api_key=settings.openai_api_key) if self._is_available else None

    @property
    def is_available(self) -> bool:
        return self._is_available

    def evaluate_short_answer(
        self,
        *,
        question_text: str,
        expected_answer: str,
        student_answer: str,
    ) -> SemanticEvaluationResult:
        if not self._client:
            return SemanticEvaluationResult(
                verdict="review",
                reason="No se evaluo semantic_short porque OPENAI_API_KEY no esta configurada.",
            )

        prompt = (
            "Evalua respuestas cortas de examentes academicos.\n"
            "Debes ser conservador.\n"
            "Solo acepta equivalencia semantica clara para respuestas breves y concretas.\n"
            "Si hay duda, ambiguedad, respuesta larga, explicacion extensa o contexto insuficiente, devuelve review.\n"
            "Nunca inventes informacion ni sobreinterpretes.\n"
            "Responde solo con el esquema solicitado."
        )

        response = self._client.responses.parse(
            model=settings.openai_model,
            input=[
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": (
                        f"Pregunta: {question_text}\n"
                        f"Respuesta esperada: {expected_answer}\n"
                        f"Respuesta del estudiante: {student_answer}\n"
                        "Clasifica como correct, incorrect o review. "
                        "Usa review si no hay equivalencia corta y clara."
                    ),
                },
            ],
            text_format=SemanticEvaluationResult,
        )

        return response.output_parsed
