import { EmptyState } from "@/components/empty-state";

type WarningListProps = {
  warnings: string[];
};

export function WarningList({ warnings }: WarningListProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Advertencias</h2>
      <div className="mt-6">
        {warnings.length === 0 ? (
          <EmptyState
            title="Sin advertencias"
            description="Este examen no genero advertencias relevantes."
          />
        ) : (
          <ul className="space-y-3">
            {warnings.map((warning) => (
              <li key={warning} className="rounded-2xl border border-border bg-paper/70 px-5 py-4 text-sm text-slate">
                {warning}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
