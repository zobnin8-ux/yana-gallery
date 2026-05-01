import { ArtworkCard } from "@/components/artworks/ArtworkCard";
import type { Artwork } from "@/types/artwork";

type HomeWorkFeedProps = {
  artworks: Artwork[];
};

export function HomeWorkFeed({ artworks }: HomeWorkFeedProps) {
  if (!artworks.length) {
    return null;
  }

  return (
    <div className="artwork-grid artwork-grid-home">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} variant="home" />
      ))}
    </div>
  );
}
