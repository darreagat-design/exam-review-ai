import { SectionCard } from "@/components/section-card";

const sections = [
  {
    title: "Start a Review",
    description:
      "Upload one answer key and one or more student exam files to prepare a future review batch."
  },
  {
    title: "Processed Reviews",
    description:
      "Track completed or in-progress review batches once grading and file processing are added."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
      <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Academic Review Workspace
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Exam Review AI
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate sm:text-lg">
          A structured starting point for organizing answer keys, student exams, and future
          automated review workflows.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <SectionCard
            key={section.title}
            title={section.title}
            description={section.description}
          />
        ))}
      </div>
    </main>
  );
}
