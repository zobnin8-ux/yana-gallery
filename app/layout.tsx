import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fontSans, fontSerif } from "@/app/fonts";
import "@/app/globals.css";
import { getSiteUrlOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Галерея Яны Зубаревой",
  description: "Тихая онлайн-галерея работ художницы Яны Зубаревой.",
  metadataBase: getSiteUrlOrigin(),
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon"
  },
  openGraph: {
    title: "Галерея Яны Зубаревой",
    description: "Частный просмотр отобранных работ художницы Яны Зубаревой.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Галерея Яны Зубаревой",
    description: "Частный просмотр отобранных работ художницы Яны Зубаревой."
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${fontSans.variable} ${fontSerif.variable}`} lang="ru">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon" sizes="180x180" />
        <link rel="shortcut icon" href="/icon" />
      </head>
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
