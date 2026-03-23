import { EmptyState } from "@/components/empty-state";

type ClarificationListProps = {
  needsClarification: boolean;
  questions: string[];
};

export function ClarificationList({
  needsClarification,
  questions
}: ClarificationListProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <details open={needsClarification}>
        <summary className="cursor-pointer text-2xl font-semibold tracking-tight text-ink">
          Puntos sugeridos para revision manual
        </summary>
      <div className="mt-6">
        {!needsClarification ? (
          <EmptyState
            title="Sin aclaraciones pendientes"
            description="No hay preguntas pendientes para este examen."
          />
        ) : (
          <ul className="space-y-3">
            {questions.map((question) => (
              <li key={question} className="rounded-2xl border border-border bg-paper/70 px-5 py-4 text-sm text-slate">
                {question}
              </li>
            ))}
          </ul>
        )}
      </div>
      </details>
    </section>
  );
}
