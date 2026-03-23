import { EmptyState } from "@/components/empty-state";
import { ToolTraceItem } from "@/components/types";

type ToolTracePanelProps = {
  items: ToolTraceItem[];
};

export function ToolTracePanel({ items }: ToolTracePanelProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Herramientas utilizadas</h2>
      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Sin rastro de herramientas"
            description="No se registraron herramientas para este examen."
          />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={`${item.tool}-${item.reason}`} className="rounded-2xl border border-border bg-white px-5 py-4">
                <p className="text-sm font-medium text-ink">{item.tool}</p>
                <p className="mt-2 text-sm text-slate">{item.reason}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate">
                  {item.success ? "Exitoso" : "Fallido"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
