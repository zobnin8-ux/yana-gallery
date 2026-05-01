import type { Artwork, ArtworkCollectionWithArtworks } from "@/types/artwork";

export function getSeriesPrevNext(
  artwork: Artwork,
  collections: ArtworkCollectionWithArtworks[]
): { prev: Artwork | null; next: Artwork | null } {
  const bucket = collections.find((collection) =>
    artwork.collectionId ? collection.id === artwork.collectionId : collection.id === "collection-uncategorized"
  );

  if (!bucket?.artworks.length) {
    return { prev: null, next: null };
  }

  const sorted = [...bucket.artworks].sort((a, b) => {
    const byOrder = a.sortOrder - b.sortOrder;
    if (byOrder !== 0) return byOrder;
    return a.title.localeCompare(b.title, "ru");
  });

  const index = sorted.findIndex((item) => item.id === artwork.id);
  if (index < 0) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null
  };
}
