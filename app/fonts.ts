import { Cormorant_Garamond, Inter } from "next/font/google";

/** Заголовки и акцентный текст (кириллица + латиница, swap — меньше FOUT) */
export const fontSerif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: true
});

/** Основной интерфейсный текст */
export const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true
});
