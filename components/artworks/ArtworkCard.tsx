import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  variant?: "default" | "gallery" | "home";
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

  return (
    <article className={`artwork-card artwork-card-${variant}`}>
      <Link className="artwork-card-link" href={`/artworks/${artwork.slug}`}>
        <div className={`artwork-card-image artwork-card-image-${orientation}`}>
          {primaryImage ? (
            <Image
              src={previewImageUrl}
              alt={primaryImage.alt}
              fill
              loading="lazy"
              sizes="(max-width: 760px) 78vw, (max-width: 1200px) 260px, 260px"
              className="artwork-card-img"
            />
          ) : null}
          <div className="artwork-card-overlay" />
        </div>
        <div className="artwork-card-body">
          <p className="artwork-card-kicker">{artwork.collection ?? "Original work"}</p>
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
