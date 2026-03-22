import { ProcessedReview, ReviewBatchCard } from "@/components/review-batch-card";

type ProcessedReviewsListProps = {
  reviews: ProcessedReview[];
};

export function ProcessedReviewsList({ reviews }: ProcessedReviewsListProps) {
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
          Esta vista usa datos mock para anticipar como se mostrara el historial cuando el backend
          empiece a devolver revisiones reales.
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        {reviews.map((review) => (
          <ReviewBatchCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
