import Image from "next/image";

import type { Artwork } from "@/types/artwork";

type ArtworkHeroProps = {
  artwork: Artwork;
};

export function ArtworkHero({ artwork }: ArtworkHeroProps) {
  const primaryImage = artwork.images[0];

  return (
    <div className="artwork-hero">
      <div className="artwork-hero-frame">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 58vw"
            className="artwork-hero-image"
          />
        ) : null}
      </div>
    </div>
  );
}
