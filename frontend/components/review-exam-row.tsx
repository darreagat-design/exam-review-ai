import { ReviewExam } from "@/components/types";

type ReviewExamRowProps = {
  exam: ReviewExam;
};

export function ReviewExamRow({ exam }: ReviewExamRowProps) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-4 text-sm font-medium text-ink">{exam.student_exam_filename}</td>
      <td className="px-4 py-4 text-sm text-slate">{exam.student_name ?? "Pendiente"}</td>
      <td className="px-4 py-4 text-sm text-slate">{exam.student_id ?? "Pendiente"}</td>
      <td className="px-4 py-4 text-sm text-slate">{exam.status}</td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.questions_detected} preguntas, {exam.series_detected} series
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.correct_answers} correctas, {exam.incorrect_answers} incorrectas, {exam.review_answers} revision
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.score_suggested !== null ? exam.score_suggested : "Requiere revision"}
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {new Intl.DateTimeFormat("es-ES", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date(exam.created_at))}
      </td>
    </tr>
  );
}
