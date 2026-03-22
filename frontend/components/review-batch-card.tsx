import Link from "next/link";

import { ReviewSummary } from "@/components/types";

type ReviewBatchCardProps = {
  review: ReviewSummary;
};

export function ReviewBatchCard({ review }: ReviewBatchCardProps) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="block rounded-2xl border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/70"
    >
      <article>
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
      <div className="mt-5 flex justify-end">
        <span className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-slate">
          Ver revision
        </span>
      </div>
      </article>
    </Link>
  );
}
