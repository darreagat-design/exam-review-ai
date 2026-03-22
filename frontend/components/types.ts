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

export type ReviewExam = {
  id: number;
  student_exam_filename: string;
  student_name: string | null;
  student_id: string | null;
  status: string;
  created_at: string;
};

export type ReviewDetail = ReviewSummary & {
  processed_exams: ReviewExam[];
};

export type ReviewDetailResponse = {
  revision: ReviewDetail;
};
