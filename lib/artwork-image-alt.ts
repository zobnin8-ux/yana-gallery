import type { Artwork } from "@/types/artwork";

/** Формат для SEO/доступности без выдуманных деталей: название + то, что есть в данных. */
export function primaryArtworkImageAlt(artwork: Artwork): string {
  const bits: string[] = [`Картина «${artwork.title}»`];
  if (artwork.medium?.trim()) {
    bits.push(artwork.medium.trim());
  }
  if (artwork.year != null) {
    bits.push(String(artwork.year));
  }
  return `${bits.join(", ")}.`;
}
