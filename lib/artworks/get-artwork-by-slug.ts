import { artworksRepository } from "@/lib/repositories/artworks-repository";

export function getArtworkBySlug(slug: string) {
  let decodedSlug = slug;

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  return artworksRepository.findBySlug(decodedSlug);
}
