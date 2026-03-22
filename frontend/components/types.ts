export type ReviewSummary = {
  id: number;
  title: string;
  answer_key_filename: string | null;
  total_student_exams: number;
  status: string;
  created_at: string;
};

export type CreateReviewResponse = {
  mensaje: string;
  review: ReviewSummary;
};

export type ReviewsListResponse = {
  revisiones: ReviewSummary[];
};
