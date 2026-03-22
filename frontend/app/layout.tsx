import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exam Review AI",
  description: "Interfaz base en espanol para iniciar revisiones academicas de examenes."
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
