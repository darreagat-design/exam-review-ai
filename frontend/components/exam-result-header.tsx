import { StatusBadge, getResultTone, toSpanishLabel } from "@/components/ui-badges";
import { ExamResultDetail } from "@/components/types";

type ExamResultHeaderProps = {
  result: ExamResultDetail;
};

export function ExamResultHeader({ result }: ExamResultHeaderProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
        Resultado procesado
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {result.student_exam_filename}
      </h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge
          label={toSpanishLabel(result.result_json.status)}
          tone={getResultTone(result.result_json.status)}
        />
      </div>
      <div className="mt-6 grid gap-4 text-sm text-slate sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Estudiante</p>
          <p className="mt-2 text-base font-medium text-ink">{result.student_name ?? "Pendiente"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Carne</p>
          <p className="mt-2 text-base font-medium text-ink">{result.student_id ?? "Pendiente"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Estado final</p>
          <p className="mt-2 text-base font-medium text-ink">
            {toSpanishLabel(result.result_json.status)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Puntaje sugerido</p>
          <p className="mt-2 text-base font-medium text-ink">
            {result.score_suggested ?? "Pendiente de revision"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Revision</p>
          <p className="mt-2 text-base font-medium text-ink">{result.review_title}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Answer key</p>
          <p className="mt-2 text-base font-medium text-ink">
            {result.answer_key_filename ?? "Sin answer key"}
          </p>
        </div>
      </div>
    </section>
  );
}
