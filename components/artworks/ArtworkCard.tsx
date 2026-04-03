import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  variant?: "default" | "gallery" | "home";
};

export function ArtworkCard({ artwork, variant = "default" }: ArtworkCardProps) {
  const primaryImage = artwork.images[0];
  const width = artwork.width ?? primaryImage?.width ?? null;
  const height = artwork.height ?? primaryImage?.height ?? null;
  const orientation =
    width && height ? (width > height ? "landscape" : width < height ? "portrait" : "square") : "portrait";

  return (
    <article className={`artwork-card artwork-card-${variant}`}>
      <Link className="artwork-card-link" href={`/artworks/${artwork.slug}`}>
        <div className={`artwork-card-image artwork-card-image-${orientation}`}>
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="artwork-card-img"
            />
          ) : null}
          <div className="artwork-card-overlay" />
        </div>
        <div className="artwork-card-body">
          <h3 className="artwork-card-title">{artwork.title}</h3>
          {artwork.year ? <p className="artwork-card-meta">{artwork.year}</p> : null}
        </div>
      </Link>
    </article>
  );
}
