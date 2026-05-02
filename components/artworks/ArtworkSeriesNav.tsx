import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkSeriesNavProps = {
  prev: Artwork | null;
  next: Artwork | null;
  position: { index: number; total: number } | null;
};

export function ArtworkSeriesNav({ prev, next, position }: ArtworkSeriesNavProps) {
  if (!prev && !next) {
    return null;
  }

  const progressPercent =
    position && position.total > 0 ? Math.round((position.index / position.total) * 100) : null;

  return (
    <nav className="artwork-series-nav" aria-label="Соседние работы в серии">
      {position && position.total > 1 ? (
        <div className="artwork-series-progress">
          <p className="artwork-series-progress-label">
            В серии: <strong>{position.index}</strong> из <strong>{position.total}</strong>
          </p>
          <div className="artwork-series-progress-track" role="presentation">
            <div
              aria-hidden="true"
              className="artwork-series-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : null}
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
