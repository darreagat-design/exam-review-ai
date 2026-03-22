import { ReviewDetail } from "@/components/types";

type ReviewDetailHeaderProps = {
  review: ReviewDetail;
};

export function ReviewDetailHeader({ review }: ReviewDetailHeaderProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
        Detalle de revision
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {review.title}
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate sm:text-base">
        Revisa el archivo answer key cargado y el conjunto de examenes asociados a esta revision.
      </p>

      <dl className="mt-8 grid gap-5 text-sm text-slate sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
            Answer key
          </dt>
          <dd className="mt-2 text-base font-medium text-ink">
            {review.answer_key_filename ?? "Sin archivo registrado"}
          </dd>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Fecha</dt>
          <dd className="mt-2 text-base font-medium text-ink">
            {new Intl.DateTimeFormat("es-ES", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(new Date(review.created_at))}
          </dd>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">Estado</dt>
          <dd className="mt-2 text-base font-medium text-ink">{review.status}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-white px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">
            Total de examenes
          </dt>
          <dd className="mt-2 text-base font-medium text-ink">{review.total_student_exams}</dd>
        </div>
      </dl>
    </section>
  );
}
