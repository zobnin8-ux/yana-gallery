import type { Artwork, ArtworkRow } from "@/types/artwork";

export function mapArtworkRowToModel(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    collection: row.collection,
    year: row.year,
    medium: row.medium,
    width: row.width,
    height: row.height,
    price: row.price,
    currency: row.currency,
    status: row.status,
    description: row.description,
    images: row.images,
    featured: row.featured
  };
}

export function mapArtworkToRow(artwork: Artwork): ArtworkRow {
  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    collection: artwork.collection ?? null,
    year: artwork.year ?? null,
    medium: artwork.medium ?? null,
    width: artwork.width ?? null,
    height: artwork.height ?? null,
    price: artwork.price ?? null,
    currency: artwork.currency ?? null,
    status: artwork.status,
    description: artwork.description ?? null,
    images: artwork.images,
    featured: artwork.featured
  };
}
