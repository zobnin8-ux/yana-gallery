import { artworksRepository } from "@/lib/repositories/artworks-repository";

export function getArtworkBySlug(slug: string) {
  return artworksRepository.findBySlug(slug);
}
