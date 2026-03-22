import {
  CreateReviewResponse,
  ReviewDetailResponse,
  ReviewsListResponse
} from "@/components/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type ApiErrorResponse = {
  detail?: string;
};

export async function fetchReviews(): Promise<ReviewsListResponse> {
  const response = await fetch(`${apiBaseUrl}/api/reviews`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("No fue posible cargar las revisiones.");
  }

  return (await response.json()) as ReviewsListResponse;
}

export async function createReviewBatch(
  answerKey: File,
  studentExams: File[]
): Promise<CreateReviewResponse> {
  const formData = new FormData();
  formData.append("answer_key", answerKey);

  studentExams.forEach((studentExam) => {
    formData.append("student_exams", studentExam);
  });

  const response = await fetch(`${apiBaseUrl}/api/reviews`, {
    method: "POST",
    body: formData
  });

  const payload = (await response.json()) as CreateReviewResponse | ApiErrorResponse;
  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;
    throw new Error(errorPayload.detail ?? "No fue posible crear la revision.");
  }

  return payload as CreateReviewResponse;
}

export async function fetchReviewById(reviewId: number): Promise<ReviewDetailResponse> {
  const response = await fetch(`${apiBaseUrl}/api/reviews/${reviewId}`, {
    cache: "no-store"
  });

  const payload = (await response.json()) as ReviewDetailResponse | ApiErrorResponse;
  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;
    throw new Error(errorPayload.detail ?? "No fue posible cargar la revision.");
  }

  return payload as ReviewDetailResponse;
}
