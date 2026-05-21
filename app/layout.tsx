import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fontSans, fontSerif } from "@/app/fonts";
import "@/app/globals.css";
import { getSiteUrlOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Галерея Яны Зубаревой",
  description: "Тихая онлайн-галерея работ художницы Яны Зубаревой.",
  metadataBase: getSiteUrlOrigin(),
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
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
