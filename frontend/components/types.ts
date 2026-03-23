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
  final_status: string;
  warnings_count: number;
  needs_clarification: boolean;
  created_at: string;
};

export type ReviewDetail = ReviewSummary & {
  answer_key_structure_json: string | null;
  processed_exams: ReviewExam[];
};

export type ReviewDetailResponse = {
  revision: ReviewDetail;
};

export type ToolTraceItem = {
  tool: string;
  reason: string;
  success: boolean;
};

export type SeriesBreakdownItem = {
  series_title: string;
  question_count: number;
  points_per_item: number | null;
  correct_count: number;
  incorrect_count: number;
  review_count: number;
  subtotal_awarded: number | null;
};

export type QuestionResultItem = {
  question_number: number;
  series_title: string;
  question_text?: string | null;
  student_answer: string | null;
  expected_answer: string | null;
  grading_mode: string;
  comparison_result: string;
  reason?: string | null;
  review_reason?: string | null;
  awarded_points?: number | null;
};

export type ProcessedExamContract = {
  status: string;
  document_type: string;
  summary: string;
  extracted_data: {
    student_name: string | null;
    student_id: string | null;
    student_exam_filename: string;
    answer_key_filename: string | null;
    document_subtype?: string;
    file_metadata?: {
      filename: string;
      extension: string;
      mime_type: string | null;
    };
    total_questions: number;
    compared_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    review_answers: number;
    score_suggested: number | null;
    series_detected: number;
    series_breakdown: SeriesBreakdownItem[];
    questions: QuestionResultItem[];
    parsing_summary: {
      series_detected: number;
      questions_detected: number;
    };
    parsing_status: string;
    comparison_summary: {
      total_questions: number;
      compared_questions: number;
      correct_answers: number;
      incorrect_answers: number;
      review_answers: number;
      score_suggested: number | null;
      series_breakdown: SeriesBreakdownItem[];
      question_results: QuestionResultItem[];
    };
    semantic_matches: number;
  };
  warnings: string[];
  needs_clarification: boolean;
  clarifying_questions: string[];
  tool_trace: ToolTraceItem[];
};

export type ExamResultDetail = {
  id: number;
  review_id: number;
  review_title: string;
  answer_key_filename: string | null;
  student_exam_filename: string;
  student_name: string | null;
  student_id: string | null;
  status: string;
  summary: string;
  score_suggested: number | null;
  result_json: ProcessedExamContract;
  created_at: string;
};

export type ExamResultDetailResponse = ExamResultDetail;
