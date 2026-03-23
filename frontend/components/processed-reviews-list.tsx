import { ReviewBatchCard } from "@/components/review-batch-card";
import { ReviewSummary } from "@/components/types";

type ProcessedReviewsListProps = {
  reviews: ReviewSummary[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function ProcessedReviewsList({
  reviews,
  isLoading,
  errorMessage
}: ProcessedReviewsListProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Historial academico
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Revisiones procesadas
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate sm:text-base">
          Aqui apareceran automaticamente las revisiones guardadas.
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-paper/70 px-5 py-6 text-sm text-slate">
            Cargando revisiones guardadas...
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-2xl border border-border bg-paper/70 px-5 py-6 text-sm text-slate">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && reviews.length === 0 ? (
          <div className="rounded-2xl border border-border bg-paper/70 px-5 py-6 text-sm text-slate">
            Aun no hay revisiones procesadas o cargadas en el sistema.
          </div>
        ) : null}

        {!isLoading && !errorMessage && reviews.length > 0 ? (
          <div className="grid gap-5">
            {reviews.map((review) => (
              <ReviewBatchCard key={review.id} review={review} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
