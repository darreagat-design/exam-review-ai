type SectionCardProps = {
  title: string;
  description: string;
};

export function SectionCard({ title, description }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-white/90 p-6 shadow-soft">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{description}</p>
    </section>
  );
}
