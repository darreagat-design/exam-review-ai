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
  parsing_status: string;
  series_detected: number;
  questions_detected: number;
  correct_answers: number;
  incorrect_answers: number;
  review_answers: number;
  score_suggested: number | null;
  semantic_matches: number;
  created_at: string;
};

export type ReviewDetail = ReviewSummary & {
  answer_key_structure_json: string | null;
  processed_exams: ReviewExam[];
};

export type ReviewDetailResponse = {
  revision: ReviewDetail;
};
