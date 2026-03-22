import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-slate transition hover:border-accent hover:text-ink"
    >
      {label}
    </Link>
  );
}
