import type { Artwork, ArtworkRow } from "@/types/artwork";

export function mapArtworkRowToModel(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    collectionId: row.collectionId,
    collection: row.collection,
    year: row.year,
    medium: row.medium,
    sizeLabel: row.sizeLabel ?? null,
    width: row.width,
    height: row.height,
    price: row.price,
    priceRange: row.priceRange ?? null,
    currency: row.currency,
    status: row.status,
    description: row.description,
    interiorImageUrl: row.interiorImageUrl ?? null,
    shippingNote: row.shippingNote ?? null,
    images: row.images,
    featured: row.featured,
    hero: row.hero,
    sortOrder: row.sortOrder,
    showPrice: row.showPrice,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription
  };
}

export function mapArtworkToRow(artwork: Artwork): ArtworkRow {
  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    collectionId: artwork.collectionId ?? null,
    collection: artwork.collection ?? null,
    year: artwork.year ?? null,
    medium: artwork.medium ?? null,
    sizeLabel: artwork.sizeLabel ?? null,
    width: artwork.width ?? null,
    height: artwork.height ?? null,
    price: artwork.price ?? null,
    priceRange: artwork.priceRange ?? null,
    currency: artwork.currency ?? null,
    status: artwork.status,
    description: artwork.description ?? null,
    interiorImageUrl: artwork.interiorImageUrl ?? null,
    shippingNote: artwork.shippingNote ?? null,
    images: artwork.images,
    featured: artwork.featured,
    hero: artwork.hero,
    sortOrder: artwork.sortOrder,
    showPrice: artwork.showPrice,
    seoTitle: artwork.seoTitle ?? null,
    seoDescription: artwork.seoDescription ?? null
  };
}
