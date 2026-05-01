import Image from "next/image";

import { ArtworkHeroPrimaryClient } from "@/components/artworks/ArtworkHeroPrimaryClient";
import { ArtworkInterior } from "@/components/artworks/ArtworkInterior";
import type { Artwork } from "@/types/artwork";

type ArtworkHeroProps = {
  artwork: Artwork;
};

export function ArtworkHero({ artwork }: ArtworkHeroProps) {
  const primaryImage = artwork.images[0];
  const interiorUrl = artwork.interiorImageUrl?.trim();

  const detailImages = (() => {
    const rest = artwork.images.slice(1);
    if (!interiorUrl) return rest;
    return rest.filter((image) => image.url !== interiorUrl && (image.thumbnailUrl ?? "") !== interiorUrl);
  })();

  const interiorAlt = `«${artwork.title}» в интерьере`;

  return (
    <div className="artwork-hero">
      <div className="artwork-hero-frame">{primaryImage ? <ArtworkHeroPrimaryClient artwork={artwork} primaryImage={primaryImage} /> : null}</div>
      {interiorUrl ? <ArtworkInterior url={interiorUrl} alt={interiorAlt} /> : null}
      {detailImages.length ? (
        <div className="artwork-detail-strip">
          {detailImages.slice(0, 4).map((image) => (
            <div className="artwork-detail-frame" key={image.id}>
              <Image
                src={image.thumbnailUrl ?? image.url}
                alt={image.alt?.trim() ? image.alt : `Фрагмент «${artwork.title}»`}
                fill
                sizes="200px"
                className="artwork-detail-image"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
