import type { Artwork } from "@/types/artwork";

type ArtworkDescriptionProps = {
  artwork: Artwork;
};

export function ArtworkDescription({ artwork }: ArtworkDescriptionProps) {
  const text = artwork.description?.trim();
  if (!text) {
    return null;
  }

  return (
    <div className="artwork-description artwork-description-prose">
      <p>{text}</p>
    </div>
  );
}
