import { artworksRepository } from "@/lib/repositories/artworks-repository";

export function getArtworkById(id: string) {
  return artworksRepository.findById(id);
}
