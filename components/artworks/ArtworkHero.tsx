import Image from "next/image";

import { primaryArtworkImageAlt } from "@/lib/artwork-image-alt";
import type { Artwork } from "@/types/artwork";

type ArtworkHeroProps = {
  artwork: Artwork;
};

export function ArtworkHero({ artwork }: ArtworkHeroProps) {
  const primaryImage = artwork.images[0];
  const detailImages = artwork.images.slice(1, 4);

  return (
    <div className="artwork-hero">
      <div className="artwork-hero-frame">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryArtworkImageAlt(artwork)}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 58vw"
            className="artwork-hero-image"
          />
        ) : null}
      </div>
      {detailImages.length ? (
        <div className="artwork-detail-strip">
          {detailImages.map((image) => (
            <div className="artwork-detail-frame" key={image.id}>
              <Image
                src={image.thumbnailUrl ?? image.url}
                alt={image.alt?.trim() ? image.alt : `Фрагмент «${artwork.title}»`}
                fill
                sizes="160px"
                className="artwork-detail-image"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
