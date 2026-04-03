import type { Artwork } from "@/types/artwork";

export const collectionOverridesStorageKey = "yana-gallery-collection-overrides-v1";

export type CollectionOverrides = Record<string, string | null>;

export function applyCollectionOverrides(artworks: Artwork[], overrides: CollectionOverrides) {
  return artworks.map((artwork) => ({
    ...artwork,
    collection:
      Object.prototype.hasOwnProperty.call(overrides, artwork.id)
        ? overrides[artwork.id]
        : artwork.collection ?? null
  }));
}

export function groupArtworksByCollection(artworks: Artwork[]) {
  const grouped = artworks.reduce<Map<string, Artwork[]>>((accumulator, artwork) => {
    const key = artwork.collection?.trim() || "Без коллекции";
    const existing = accumulator.get(key) ?? [];

    existing.push(artwork);
    accumulator.set(key, existing);

    return accumulator;
  }, new Map());

  return Array.from(grouped.entries()).map(([name, collectionArtworks]) => ({
    name,
    artworks: collectionArtworks
  }));
}
