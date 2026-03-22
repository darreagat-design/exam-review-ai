import type { Metadata } from "next";

import { ReviewDetailView } from "@/components/review-detail-view";

type ReviewDetailPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Detalle de revision | Exam Review AI",
  description: "Vista de detalle para una revision almacenada en Exam Review AI."
};

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const reviewId = Number(params.id);

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10">
        <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Revision no valida</h1>
          <p className="mt-3 text-sm leading-6 text-slate sm:text-base">
            El identificador de la revision no tiene un formato valido.
          </p>
        </div>
      </main>
    );
  }

  return <ReviewDetailView reviewId={reviewId} />;
}
