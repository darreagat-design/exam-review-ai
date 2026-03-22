import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exam Review AI",
  description: "Sprint 1 scaffold for academic exam review workflows."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
