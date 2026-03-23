import { StatusBadge, getResultTone, toSpanishLabel } from "@/components/ui-badges";
import Link from "next/link";

import { ReviewExam } from "@/components/types";

type ReviewExamRowProps = {
  exam: ReviewExam;
};

export function ReviewExamRow({ exam }: ReviewExamRowProps) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-4 text-sm text-slate">
        <p className="font-medium text-ink">{exam.student_name ?? "Pendiente"}</p>
        <p className="mt-1 text-xs text-slate">{exam.student_exam_filename}</p>
        <p className="mt-1 text-xs text-slate">Carne: {exam.student_id ?? "Pendiente"}</p>
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={toSpanishLabel(exam.status)} tone={getResultTone(exam.status)} />
          <StatusBadge
            label={toSpanishLabel(exam.final_status)}
            tone={getResultTone(exam.final_status)}
          />
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.questions_detected} preguntas, {exam.series_detected} series
        <div className="mt-1 text-xs text-slate">Parsing: {toSpanishLabel(exam.parsing_status)}</div>
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.correct_answers} correctas, {exam.incorrect_answers} incorrectas, {exam.review_answers} revisión
        {exam.semantic_matches > 0 ? `, ${exam.semantic_matches} semantica` : ""}
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        {exam.score_suggested !== null ? exam.score_suggested : "Pendiente"}
        <div className="mt-1 text-xs text-slate">
          {exam.warnings_count} warnings
          {exam.needs_clarification ? ", requiere aclaración" : ""}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate">
        <Link
          href={`/results/${exam.id}`}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate transition hover:border-accent hover:text-ink"
        >
          Ver resultado
        </Link>
      </td>
    </tr>
  );
}
