import { ReviewSummary } from "@/components/types";

type ReviewBatchCardProps = {
  review: ReviewSummary;
};

export function ReviewBatchCard({ review }: ReviewBatchCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{review.title}</h3>
          <p className="mt-1 text-sm text-slate">
            Answer key: {review.answer_key_filename ?? "Sin archivo registrado"}
          </p>
        </div>
        <span className="inline-flex rounded-full border border-border bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
          {review.status}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 text-sm text-slate sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
            Examenes
          </dt>
          <dd className="mt-1 text-base font-medium text-ink">{review.total_student_exams}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Fecha</dt>
          <dd className="mt-1 text-base font-medium text-ink">
            {new Intl.DateTimeFormat("es-ES", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(new Date(review.created_at))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Estado</dt>
          <dd className="mt-1 text-base font-medium text-ink">{review.status}</dd>
        </div>
      </dl>
    </article>
  );
}
