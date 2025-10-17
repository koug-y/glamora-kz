import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "glamora_kz — Алматы",
  description:
    "Казахстанский мини-магазин корейской уходовой косметики glamora_kz в Алматы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans bg-surface text-ink`}>
        {children}
      </body>
    </html>
  );
}
