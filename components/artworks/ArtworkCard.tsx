import Image from "next/image";
import Link from "next/link";

import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  variant?: "default" | "gallery" | "home" | "feed";
};

export function ArtworkCard({ artwork, variant = "default" }: ArtworkCardProps) {
  const primaryImage = artwork.images[0];
  const previewImageUrl = primaryImage?.thumbnailUrl ?? primaryImage?.url;
  const width = artwork.width ?? primaryImage?.width ?? null;
  const height = artwork.height ?? primaryImage?.height ?? null;
  const orientation =
    width && height ? (width > height ? "landscape" : width < height ? "portrait" : "square") : "portrait";
  const statusLabel =
    artwork.status === "available" ? "Доступна" : artwork.status === "reserved" ? "В резерве" : "Продана";

  const isSold = artwork.status === "sold";

  return (
    <article className={`artwork-card artwork-card-${variant}${isSold ? " artwork-card-is-sold" : ""}`}>
      <Link className="artwork-card-link" href={`/artworks/${artwork.slug}`}>
        <div className={`artwork-card-image artwork-card-image-${orientation}`}>
          {primaryImage ? (
            <Image
              src={previewImageUrl}
              alt={primaryImage ? primaryArtworkImageAlt(artwork) : ""}
              fill
              loading="lazy"
              sizes={
                variant === "feed"
                  ? "(max-width: 760px) 100vw, min(1100px, 92vw)"
                  : "(max-width: 760px) 78vw, (max-width: 1200px) 260px, 260px"
              }
              className="artwork-card-img"
            />
          ) : null}
          <div className="artwork-card-overlay" />
          {isSold ? (
            <>
              <div aria-hidden="true" className="artwork-card-sold-dim" />
              <span className="artwork-card-sold-ribbon">Продана</span>
            </>
          ) : null}
        </div>
        <div className="artwork-card-body">
          {artwork.collection ? (
            <p className="artwork-card-kicker">{artwork.collection}</p>
          ) : null}
          <h3 className="artwork-card-title">{artwork.title}</h3>
          <p className="artwork-card-meta">
            {[artwork.year, artwork.width && artwork.height ? `${artwork.width} × ${artwork.height} cm` : null]
              .filter(Boolean)
              .join(", ")}
          </p>
          <span className={`artwork-card-status artwork-card-status-${artwork.status}`}>{statusLabel}</span>
        </div>
      </Link>
    </article>
  );
}
