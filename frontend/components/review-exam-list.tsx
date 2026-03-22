import { EmptyState } from "@/components/empty-state";
import { ReviewExamRow } from "@/components/review-exam-row";
import { ReviewExam } from "@/components/types";

type ReviewExamListProps = {
  exams: ReviewExam[];
};

export function ReviewExamList({ exams }: ReviewExamListProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Examenes asociados
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Lista de examenes
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate sm:text-base">
          Aqui se mostraran los examenes que forman parte de la revision seleccionada.
        </p>
      </div>

      <div className="mt-8">
        {exams.length === 0 ? (
          <EmptyState
            title="Esta revision no tiene examenes asociados"
            description="Todavia no se registraron examenes para esta revision."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-paper/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Archivo del examen
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Estudiante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Carne
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Parsing
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Comparacion
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Puntaje sugerido
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <ReviewExamRow key={exam.id} exam={exam} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
