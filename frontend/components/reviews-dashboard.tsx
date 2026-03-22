"use client";

import { useEffect, useState } from "react";

import { ProcessedReviewsList } from "@/components/processed-reviews-list";
import { ReviewBatchForm } from "@/components/review-batch-form";
import { fetchReviews } from "@/components/reviews-api";
import { ReviewSummary } from "@/components/types";

export function ReviewsDashboard() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReviews = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchReviews();
      setReviews(response.revisiones);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No fue posible cargar las revisiones."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  return (
    <>
      <div className="mt-10">
        <ReviewBatchForm onReviewCreated={loadReviews} />
      </div>

      <div className="mt-10">
        <ProcessedReviewsList
          reviews={reviews}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </>
  );
}
