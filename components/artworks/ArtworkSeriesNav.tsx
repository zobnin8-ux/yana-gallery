import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkSeriesNavProps = {
  prev: Artwork | null;
  next: Artwork | null;
};

export function ArtworkSeriesNav({ prev, next }: ArtworkSeriesNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="artwork-series-nav" aria-label="Соседние работы в серии">
      <div className="artwork-series-nav-inner">
        {prev ? (
          <Link className="artwork-series-link artwork-series-prev" href={`/artworks/${prev.slug}`}>
            <span className="artwork-series-dir">←</span>
            <span className="artwork-series-title">{prev.title}</span>
          </Link>
        ) : (
          <span className="artwork-series-placeholder" />
        )}
        {next ? (
          <Link className="artwork-series-link artwork-series-next" href={`/artworks/${next.slug}`}>
            <span className="artwork-series-title">{next.title}</span>
            <span className="artwork-series-dir">→</span>
          </Link>
        ) : (
          <span className="artwork-series-placeholder" />
        )}
      </div>
    </nav>
  );
}
