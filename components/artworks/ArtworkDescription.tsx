import type { Artwork } from "@/types/artwork";

type ArtworkDescriptionProps = {
  artwork: Artwork;
};

export function ArtworkDescription({ artwork }: ArtworkDescriptionProps) {
  const text = artwork.description?.trim();
  if (!text) {
    return null;
  }

  const paragraphs = text
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return (
    <div className="artwork-description artwork-description-prose">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
