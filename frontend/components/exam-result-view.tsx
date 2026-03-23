"use client";

import { useEffect, useState } from "react";

import { BackLink } from "@/components/back-link";
import { ClarificationList } from "@/components/clarification-list";
import { EmptyState } from "@/components/empty-state";
import { ExamResultHeader } from "@/components/exam-result-header";
import { ExamResultSummary } from "@/components/exam-result-summary";
import { fetchResultById } from "@/components/reviews-api";
import { QuestionResultCard } from "@/components/question-result-card";
import { SeriesBreakdown } from "@/components/series-breakdown";
import { ToolTracePanel } from "@/components/tool-trace-panel";
import { WarningList } from "@/components/warning-list";
import { ExamResultDetail } from "@/components/types";

type ExamResultViewProps = {
  resultId: number;
};

export function ExamResultView({ resultId }: ExamResultViewProps) {
  const [result, setResult] = useState<ExamResultDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchResultById(resultId);
        setResult(response);
      } catch (error) {
        setResult(null);
        setErrorMessage(
          error instanceof Error ? error.message : "No fue posible cargar el resultado."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadResult();
  }, [resultId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
      <BackLink href={result ? `/reviews/${result.review_id}` : "/"} label="Volver a la revision" />

      <div className="mt-8">
        {isLoading ? (
          <EmptyState
            title="Cargando resultado"
            description="Estamos consultando el desglose completo del examen procesado."
          />
        ) : null}

        {!isLoading && errorMessage ? (
          <EmptyState
            title={
              errorMessage === "El resultado solicitado no existe."
                ? "Resultado no encontrado"
                : "No fue posible abrir el resultado"
            }
            description={errorMessage}
          />
        ) : null}

        {!isLoading && !errorMessage && result ? (
          <div className="space-y-10">
            <ExamResultHeader result={result} />
            <ExamResultSummary result={result} />
            <WarningList warnings={result.result_json.warnings} />
            <ClarificationList
              needsClarification={result.result_json.needs_clarification}
              questions={result.result_json.clarifying_questions}
            />
            <SeriesBreakdown series={result.result_json.extracted_data.series_breakdown} />
            <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Detalle por preguntas</h2>
              <div className="mt-6 grid gap-4">
                {result.result_json.extracted_data.questions.length > 0 ? (
                  result.result_json.extracted_data.questions.map((question) => (
                    <QuestionResultCard
                      key={`${question.series_title}-${question.question_number}`}
                      question={question}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="Sin preguntas disponibles"
                    description="No se registraron preguntas dentro del resultado procesado."
                  />
                )}
              </div>
            </section>
            <ToolTracePanel items={result.result_json.tool_trace} />
            <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
              <details>
                <summary className="cursor-pointer text-lg font-semibold text-ink">Ver JSON</summary>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-paper/70 p-4 text-xs text-slate">
                  {JSON.stringify(result.result_json, null, 2)}
                </pre>
              </details>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
