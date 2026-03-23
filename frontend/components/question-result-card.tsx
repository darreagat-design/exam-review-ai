import { StatusBadge, getResultTone, toSpanishLabel } from "@/components/ui-badges";
import { QuestionResultItem } from "@/components/types";

type QuestionResultCardProps = {
  question: QuestionResultItem;
};

export function QuestionResultCard({ question }: QuestionResultCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Pregunta {question.question_number}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{question.question_text ?? "Sin texto"}</h3>
          <p className="mt-2 text-sm text-slate">Serie: {question.series_title}</p>
        </div>
        <StatusBadge
          label={toSpanishLabel(question.comparison_result)}
          tone={getResultTone(question.comparison_result)}
        />
      </div>

      <div className="mt-5 grid gap-4 text-sm text-slate sm:grid-cols-2">
        <ResultItem label="Respuesta esperada" value={question.expected_answer ?? "Pendiente"} />
        <ResultItem label="Respuesta del estudiante" value={question.student_answer ?? "Pendiente"} />
        <ResultItem label="Modo de evaluacion" value={toSpanishLabel(question.grading_mode)} />
        <ResultItem label="Motivo" value={question.reason ?? question.review_reason ?? "Sin observaciones"} />
        <ResultItem
          label="Puntaje otorgado"
          value={question.awarded_points !== null && question.awarded_points !== undefined ? String(question.awarded_points) : "Pendiente"}
        />
      </div>
    </article>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-paper/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">{label}</p>
      <p className="mt-2 text-sm text-ink">{value}</p>
    </div>
  );
}
