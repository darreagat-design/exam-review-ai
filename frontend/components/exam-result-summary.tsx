import { StatusBadge, getResultTone, toSpanishLabel } from "@/components/ui-badges";
import { ExamResultDetail } from "@/components/types";

type ExamResultSummaryProps = {
  result: ExamResultDetail;
};

export function ExamResultSummary({ result }: ExamResultSummaryProps) {
  const extracted = result.result_json.extracted_data;

  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Resumen general</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge
          label={toSpanishLabel(result.result_json.status)}
          tone={getResultTone(result.result_json.status)}
        />
      </div>
      <dl className="mt-6 grid gap-4 text-sm text-slate sm:grid-cols-2 xl:grid-cols-4">
        <SummaryItem label="Estado final" value={toSpanishLabel(result.result_json.status)} />
        <SummaryItem label="Tipo de documento" value={toSpanishLabel(result.result_json.document_type)} />
        <SummaryItem label="Total de preguntas" value={String(extracted.total_questions)} />
        <SummaryItem label="Comparadas" value={String(extracted.compared_questions)} />
        <SummaryItem label="Correctas" value={String(extracted.correct_answers)} />
        <SummaryItem label="Incorrectas" value={String(extracted.incorrect_answers)} />
        <SummaryItem label="Revision" value={String(extracted.review_answers)} />
        <SummaryItem
          label="Subtipo"
          value={String(extracted.document_subtype ?? "exam_review")}
        />
        <SummaryItem
          label="Requiere aclaracion"
          value={result.result_json.needs_clarification ? "Si" : "No"}
        />
      </dl>
      <p className="mt-6 text-sm leading-6 text-slate">{result.result_json.summary}</p>
      <div className="mt-6 rounded-2xl border border-border bg-paper/70 px-5 py-4 text-sm text-slate">
        <p>
          Archivo: {extracted.file_metadata?.filename ?? "Pendiente"} | Extension:{" "}
          {extracted.file_metadata?.extension ?? "Pendiente"} | MIME:{" "}
          {extracted.file_metadata?.mime_type ?? "Pendiente"}
        </p>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-4">
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">{label}</dt>
      <dd className="mt-2 text-base font-medium text-ink">{value}</dd>
    </div>
  );
}
