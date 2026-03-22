import { ProcessedReview } from "@/components/review-batch-card";

export const processedReviewsMock: ProcessedReview[] = [
  {
    id: "review-1",
    reviewName: "Parcial de Biologia - Seccion A",
    answerKeyName: "biologia_answer_key.pdf",
    examCount: 28,
    date: "20 de marzo de 2026",
    status: "Completada"
  },
  {
    id: "review-2",
    reviewName: "Diagnostico de Matematica",
    answerKeyName: "matematica_clave.docx",
    examCount: 16,
    date: "18 de marzo de 2026",
    status: "En revision"
  },
  {
    id: "review-3",
    reviewName: "Lectura critica - Grupo 11B",
    answerKeyName: "lectura_key.png",
    examCount: 31,
    date: "14 de marzo de 2026",
    status: "Pendiente de validacion"
  }
];
