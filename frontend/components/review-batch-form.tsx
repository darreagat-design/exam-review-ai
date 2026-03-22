"use client";

import { useMemo, useState } from "react";

import { AnswerKeyUpload } from "@/components/answer-key-upload";
import { createReviewBatch } from "@/components/reviews-api";
import { StudentExamUpload } from "@/components/student-exam-upload";

type ReviewBatchFormProps = {
  onReviewCreated: () => Promise<void> | void;
};

export function ReviewBatchForm({ onReviewCreated }: ReviewBatchFormProps) {
  const [answerKey, setAnswerKey] = useState<File | null>(null);
  const [studentExams, setStudentExams] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const missingMessages = useMemo(() => {
    const messages: string[] = [];

    if (!answerKey) {
      messages.push("Falta cargar un answer key.");
    }

    if (studentExams.length === 0) {
      messages.push("Falta cargar al menos un examen de estudiante.");
    }

    return messages;
  }, [answerKey, studentExams]);

  const canProcess = missingMessages.length === 0;

  const handleAnswerKeyChange = (file: File | null) => {
    setAnswerKey(file);
  };

  const handleStudentExamAdd = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setStudentExams((currentFiles) => {
      const nextFiles = [...currentFiles];

      files.forEach((file) => {
        const alreadyExists = nextFiles.some(
          (current) =>
            current.name === file.name && current.lastModified === file.lastModified
        );

        if (!alreadyExists) {
          nextFiles.push(file);
        }
      });

      return nextFiles;
    });
  };

  const handleStudentExamRemove = (fileKey: string) => {
    setStudentExams((currentFiles) =>
      currentFiles.filter((file) => `${file.name}-${file.lastModified}` !== fileKey)
    );
  };

  const handleProcess = async () => {
    if (!canProcess || !answerKey) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);
    setFeedbackType(null);

    try {
      const response = await createReviewBatch(answerKey, studentExams);
      setAnswerKey(null);
      setStudentExams([]);
      setResetKey((currentValue) => currentValue + 1);
      setFeedbackType("success");
      setFeedbackMessage(response.mensaje);
      await onReviewCreated();
    } catch (error) {
      setFeedbackType("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "No fue posible procesar la revision."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
            Flujo inicial de revision
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Iniciar una revision
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate sm:text-base">
            Prepara una nueva revision cargando una answer key y los examenes de estudiantes. En
            este sprint el formulario ya valida archivos de texto simples, extrae encabezados
            basicos y registra la revision en SQLite.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <AnswerKeyUpload
            selectedFile={answerKey}
            onFileChange={handleAnswerKeyChange}
            disabled={isSubmitting}
            resetKey={resetKey}
          />
          <StudentExamUpload
            selectedFiles={studentExams}
            onFilesAdd={handleStudentExamAdd}
            onFileRemove={handleStudentExamRemove}
            disabled={isSubmitting}
            resetKey={resetKey}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-paper/80 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">Estado del formulario</h3>
              {feedbackMessage ? (
                <div
                  className={`mt-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    feedbackType === "error"
                      ? "border-[#d8b3aa] bg-[#fff5f2] text-[#8a3b2f]"
                      : "border-border bg-white text-slate"
                  }`}
                >
                  {feedbackMessage}
                </div>
              ) : null}
              {!feedbackMessage && canProcess ? (
                <p className="mt-2 text-sm text-slate">
                  Todo listo para enviar los archivos y crear una revision.
                </p>
              ) : null}
              {!feedbackMessage && !canProcess ? (
                <ul className="mt-2 space-y-1 text-sm text-slate">
                  {missingMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleProcess}
              disabled={!canProcess || isSubmitting}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border disabled:border-border disabled:bg-white disabled:text-slate enabled:bg-ink enabled:text-white enabled:hover:bg-[#1b3147]"
            >
              {isSubmitting ? "Procesando revision..." : "Procesar revision"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
