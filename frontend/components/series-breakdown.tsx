import { SeriesBreakdownItem } from "@/components/types";

type SeriesBreakdownProps = {
  series: SeriesBreakdownItem[];
};

export function SeriesBreakdown({ series }: SeriesBreakdownProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Desglose por series</h2>
      <div className="mt-6 grid gap-4">
        {series.map((item) => (
          <article key={item.series_title} className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-lg font-semibold text-ink">{item.series_title}</h3>
            <dl className="mt-4 grid gap-3 text-sm text-slate sm:grid-cols-2 xl:grid-cols-4">
              <SeriesItem label="Preguntas" value={String(item.question_count)} />
              <SeriesItem
                label="Puntos por item"
                value={item.points_per_item !== null ? String(item.points_per_item) : "Pendiente"}
              />
              <SeriesItem label="Correctas" value={String(item.correct_count)} />
              <SeriesItem label="Incorrectas" value={String(item.incorrect_count)} />
              <SeriesItem label="Review" value={String(item.review_count)} />
              <SeriesItem
                label="Subtotal"
                value={item.subtotal_awarded !== null ? String(item.subtotal_awarded) : "Pendiente"}
              />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeriesItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate">{label}</dt>
      <dd className="mt-1 text-base font-medium text-ink">{value}</dd>
    </div>
  );
}
