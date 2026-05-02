import type { Artwork, ArtworkCollectionWithArtworks } from "@/types/artwork";

export type SeriesNavigation = {
  prev: Artwork | null;
  next: Artwork | null;
  /** 1-based index and count within the same collection, or null if not in a series bucket */
  position: { index: number; total: number } | null;
};

export function getSeriesPrevNext(artwork: Artwork, collections: ArtworkCollectionWithArtworks[]): SeriesNavigation {
  const bucket = collections.find((collection) =>
    artwork.collectionId ? collection.id === artwork.collectionId : collection.id === "collection-uncategorized"
  );

  if (!bucket?.artworks.length) {
    return { prev: null, next: null, position: null };
  }

  const sorted = [...bucket.artworks].sort((a, b) => {
    const byOrder = a.sortOrder - b.sortOrder;
    if (byOrder !== 0) return byOrder;
    return a.title.localeCompare(b.title, "ru");
  });

  const index = sorted.findIndex((item) => item.id === artwork.id);
  if (index < 0) {
    return { prev: null, next: null, position: null };
  }

  return {
    prev: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
    position: { index: index + 1, total: sorted.length }
  };
}
