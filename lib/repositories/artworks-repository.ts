import { mapArtworkRowToModel } from "@/lib/artworks/artwork-mappers";
import { mockArtworkRows } from "@/lib/artworks/mock-artwork-rows";

export const artworksRepository = {
  list() {
    return mockArtworkRows.map(mapArtworkRowToModel);
  },

  listFeatured() {
    return mockArtworkRows.filter((row) => row.featured).map(mapArtworkRowToModel);
  },

  findById(id: string) {
    const row = mockArtworkRows.find((item) => item.id === id);
    return row ? mapArtworkRowToModel(row) : undefined;
  },

  findBySlug(slug: string) {
    const row = mockArtworkRows.find((item) => item.slug === slug);
    return row ? mapArtworkRowToModel(row) : undefined;
  },

  listCollections() {
    const artworks = mockArtworkRows.map(mapArtworkRowToModel);
    const grouped = artworks.reduce<Map<string, typeof artworks>>((accumulator, artwork) => {
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
};
