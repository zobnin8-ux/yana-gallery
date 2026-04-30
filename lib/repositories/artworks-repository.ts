import { galleryStore } from "@/lib/gallery-store";

export const artworksRepository = {
  list() {
    return galleryStore.listArtworks();
  },

  listFeatured() {
    return galleryStore.listFeaturedArtworks();
  },

  listHero() {
    return galleryStore.listHeroArtworks();
  },

  findById(id: string) {
    return galleryStore.findArtworkById(id);
  },

  findBySlug(slug: string) {
    return galleryStore.findArtworkBySlug(slug);
  },

  listCollections() {
    return galleryStore.listCollections();
  }
};
