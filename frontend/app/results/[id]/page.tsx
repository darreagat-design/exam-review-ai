import type { Metadata } from "next";

import { ExamResultView } from "@/components/exam-result-view";

type ExamResultPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Resultado procesado | Exam Review AI",
  description: "Vista detallada de un examen procesado en Exam Review AI."
};

export default function ExamResultPage({ params }: ExamResultPageProps) {
  const resultId = Number(params.id);

  if (!Number.isInteger(resultId) || resultId <= 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
        <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Resultado no valido</h1>
          <p className="mt-3 text-sm leading-6 text-slate sm:text-base">
            El identificador del resultado no tiene un formato valido.
          </p>
        </div>
      </main>
    );
  }

  return <ExamResultView resultId={resultId} />;
}
