type BadgeTone = "success" | "danger" | "warning" | "neutral" | "info";

const badgeToneClasses: Record<BadgeTone, string> = {
  success: "border-[#c8d9c8] bg-[#f3faf3] text-[#2f5a35]",
  danger: "border-[#ddc6c6] bg-[#fff6f5] text-[#8a3b2f]",
  warning: "border-[#dfd5ba] bg-[#fffbf0] text-[#7a6231]",
  neutral: "border-border bg-paper text-slate",
  info: "border-[#c9d5e3] bg-[#f4f8fc] text-[#30506f]"
};

export function StatusBadge({
  label,
  tone
}: {
  label: string;
  tone: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] ${badgeToneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export function getResultTone(value: string): BadgeTone {
  if (value === "correct" || value === "success" || value === "evaluado") {
    return "success";
  }
  if (value === "incorrect" || value === "error" || value === "rechazado") {
    return "danger";
  }
  if (value === "review" || value === "needs_review" || value === "requiere_revision") {
    return "warning";
  }
  return "neutral";
}

export function toSpanishLabel(value: string): string {
  const normalized = value.trim().toLowerCase();
  const labels: Record<string, string> = {
    correct: "Correcta",
    incorrect: "Incorrecta",
    review: "Revision",
    success: "Exitoso",
    needs_review: "Requiere revision",
    error: "Error",
    exact: "Exacta",
    semantic_short: "Semantica corta",
    evaluado: "Evaluado",
    requiere_revision: "Requiere revision",
    rechazado: "Rechazado",
    academic_document: "Documento academico",
    other: "Otro"
  };
  return labels[normalized] ?? value;
}
