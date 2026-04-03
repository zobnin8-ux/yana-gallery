import type { Artwork } from "@/types/artwork";

import { ArtworkCard } from "./ArtworkCard";

type ArtworkGridProps = {
  artworks: Artwork[];
  variant?: "default" | "gallery" | "home";
};

export function ArtworkGrid({
  artworks,
  variant = "default"
}: ArtworkGridProps) {
  return (
    <div className={`artwork-grid artwork-grid-${variant}`}>
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} variant={variant} />
      ))}
    </div>
  );
}
