"use client";

import { useMemo, useState } from "react";

import { AnswerKeyUpload } from "@/components/answer-key-upload";
import { StudentExamUpload } from "@/components/student-exam-upload";

export function ReviewBatchForm() {
  const [answerKey, setAnswerKey] = useState<File | null>(null);
  const [studentExams, setStudentExams] = useState<File[]>([]);

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

  const handleProcess = () => {
    if (!canProcess) {
      return;
    }

    // Sprint 2: dejamos la interaccion en estado local mientras se prepara la conexion con FastAPI.
    window.alert("La interfaz ya esta lista. El procesamiento real se conectara en el siguiente sprint.");
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
            este sprint la experiencia es visual y usa estado local para dejar lista la integracion
            futura con FastAPI.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <AnswerKeyUpload selectedFile={answerKey} onFileChange={handleAnswerKeyChange} />
          <StudentExamUpload
            selectedFiles={studentExams}
            onFilesAdd={handleStudentExamAdd}
            onFileRemove={handleStudentExamRemove}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-paper/80 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">Estado del formulario</h3>
              {canProcess ? (
                <p className="mt-2 text-sm text-slate">
                  Todo listo para conectar este flujo con el backend en el siguiente sprint.
                </p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-slate">
                  {missingMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={handleProcess}
              disabled={!canProcess}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border disabled:border-border disabled:bg-white disabled:text-slate enabled:bg-ink enabled:text-white enabled:hover:bg-[#1b3147]"
            >
              Procesar revision
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
