import { ReviewsDashboard } from "@/components/reviews-dashboard";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
      <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Plataforma academica de apoyo
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Exam Review AI
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate sm:text-lg">
          Organiza answer keys y examenes de estudiantes en una interfaz clara
        </p>
      </div>
      <ReviewsDashboard />
    </main>
  );
}
