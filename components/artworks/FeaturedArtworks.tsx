import type { Artwork } from "@/types/artwork";

import { ArtworkGrid } from "./ArtworkGrid";

type FeaturedArtworksProps = {
  artworks: Artwork[];
};

export function FeaturedArtworks({ artworks }: FeaturedArtworksProps) {
  return (
    <div className="featured-artworks reveal reveal-delay-2">
      <div className="featured-artworks-heading">
        <p className="eyebrow">Selected works</p>
        <h2 className="section-heading">Работы для внимательного просмотра</h2>
      </div>
      <ArtworkGrid artworks={artworks} variant="home" />
    </div>
  );
}
