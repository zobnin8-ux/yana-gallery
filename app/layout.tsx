import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Yana Zubareva Gallery",
  description: "Тихая премиальная онлайн-галерея работ художницы Yana Zubareva.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://yanazubareva.com"),
  openGraph: {
    title: "Yana Zubareva Gallery",
    description: "Private viewing room for selected works by Yana Zubareva.",
    type: "website"
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
