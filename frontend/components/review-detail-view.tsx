"use client";

import { useEffect, useState } from "react";

import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";
import { fetchReviewById } from "@/components/reviews-api";
import { ReviewDetailHeader } from "@/components/review-detail-header";
import { ReviewExamList } from "@/components/review-exam-list";
import { ReviewDetail } from "@/components/types";

type ReviewDetailViewProps = {
  reviewId: number;
};

export function ReviewDetailView({ reviewId }: ReviewDetailViewProps) {
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadReview = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchReviewById(reviewId);
        setReview(response.revision);
      } catch (error) {
        setReview(null);
        setErrorMessage(
          error instanceof Error ? error.message : "No fue posible cargar la revision."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadReview();
  }, [reviewId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
      <BackLink href="/" label="Volver a revisiones" />

      <div className="mt-8">
        {isLoading ? (
          <EmptyState
            title="Cargando revision"
            description="Estamos consultando el detalle de la revision seleccionada."
          />
        ) : null}

        {!isLoading && errorMessage ? (
          <EmptyState
            title={
              errorMessage === "La revision solicitada no existe."
                ? "Revision no encontrada"
                : "No fue posible abrir la revision"
            }
            description={errorMessage}
          />
        ) : null}

        {!isLoading && !errorMessage && review ? (
          <div className="space-y-10">
            <ReviewDetailHeader review={review} />
            <ReviewExamList exams={review.processed_exams} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
