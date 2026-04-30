import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";

import type { Artwork, ArtworkCollection, ArtworkCollectionWithArtworks, ArtworkImage } from "@/types/artwork";
import type { Inquiry } from "@/types/inquiry";

type GalleryData = {
  collections: ArtworkCollection[];
  artworks: Artwork[];
  inquiries: Inquiry[];
};

export type ArtworkPayload = Omit<Artwork, "id" | "images"> & {
  id?: string;
  images?: ArtworkImage[];
};

const dataDirectory = path.join(process.cwd(), "data");
const galleryDataPath = path.join(dataDirectory, "gallery.json");

function ensureDataFile() {
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  if (!existsSync(galleryDataPath)) {
    writeFileSync(
      galleryDataPath,
      JSON.stringify({ collections: [], artworks: [], inquiries: [] }, null, 2),
      "utf8"
    );
  }
}

function normalizeArtwork(artwork: Artwork): Artwork {
  const images = [...artwork.images].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
  const collection = artwork.collection?.trim() || null;

  return {
    ...artwork,
    collection,
    collectionId: artwork.collectionId ?? null,
    year: artwork.year ?? null,
    medium: artwork.medium?.trim() || null,
    width: artwork.width ?? null,
    height: artwork.height ?? null,
    price: artwork.price ?? null,
    currency: artwork.currency ?? null,
    description: artwork.description?.trim() || null,
    images,
    sortOrder: artwork.sortOrder ?? 100,
    showPrice: artwork.showPrice ?? false,
    hero: artwork.hero ?? false,
    seoTitle: artwork.seoTitle?.trim() || null,
    seoDescription: artwork.seoDescription?.trim() || null
  };
}

function normalizeData(data: GalleryData): GalleryData {
  const collections = [...data.collections].sort((left, right) => left.sortOrder - right.sortOrder);
  const artworks = [...data.artworks].map(normalizeArtwork).sort((left, right) => left.sortOrder - right.sortOrder);
  const inquiries = [...data.inquiries].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return { collections, artworks, inquiries };
}

function readGalleryData(): GalleryData {
  noStore();
  ensureDataFile();

  const rawData = readFileSync(galleryDataPath, "utf8");
  return normalizeData(JSON.parse(rawData) as GalleryData);
}

function writeGalleryData(data: GalleryData) {
  ensureDataFile();
  writeFileSync(galleryDataPath, `${JSON.stringify(normalizeData(data), null, 2)}\n`, "utf8");
}

export function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `artwork-${Date.now()}`;
}

function ensureUniqueSlug(baseSlug: string, artworks: Artwork[], currentId?: string) {
  let nextSlug = baseSlug;
  let index = 2;

  while (artworks.some((artwork) => artwork.slug === nextSlug && artwork.id !== currentId)) {
    nextSlug = `${baseSlug}-${index}`;
    index += 1;
  }

  return nextSlug;
}

function buildCollectionMap(collections: ArtworkCollection[]) {
  return new Map(collections.map((collection) => [collection.id, collection]));
}

function withCollectionNames(data: GalleryData): GalleryData {
  const collectionMap = buildCollectionMap(data.collections);

  return {
    ...data,
    artworks: data.artworks.map((artwork) => ({
      ...artwork,
      collection: artwork.collectionId ? collectionMap.get(artwork.collectionId)?.name ?? artwork.collection : artwork.collection
    }))
  };
}

export const galleryStore = {
  listArtworks() {
    return withCollectionNames(readGalleryData()).artworks;
  },

  listFeaturedArtworks() {
    return galleryStore.listArtworks().filter((artwork) => artwork.featured);
  },

  listHeroArtworks() {
    return galleryStore.listArtworks().filter((artwork) => artwork.hero);
  },

  findArtworkById(id: string) {
    return galleryStore.listArtworks().find((artwork) => artwork.id === id);
  },

  findArtworkBySlug(slug: string) {
    return galleryStore.listArtworks().find((artwork) => artwork.slug === slug);
  },

  listCollections(): ArtworkCollectionWithArtworks[] {
    const data = withCollectionNames(readGalleryData());
    const assignedArtworkIds = new Set<string>();

    const collections = data.collections.map((collection) => {
      const artworks = data.artworks.filter((artwork) => artwork.collectionId === collection.id);
      artworks.forEach((artwork) => assignedArtworkIds.add(artwork.id));

      return { ...collection, artworks };
    });

    const uncategorized = data.artworks.filter((artwork) => !assignedArtworkIds.has(artwork.id));

    return uncategorized.length
      ? [
          ...collections,
          {
            id: "collection-uncategorized",
            slug: "uncategorized",
            name: "Без коллекции",
            description: null,
            coverArtworkId: uncategorized[0]?.id ?? null,
            sortOrder: 10000,
            featured: false,
            artworks: uncategorized
          }
        ]
      : collections;
  },

  upsertArtwork(payload: ArtworkPayload) {
    const data = readGalleryData();
    const existingArtwork = payload.id ? data.artworks.find((artwork) => artwork.id === payload.id) : undefined;
    const id = existingArtwork?.id ?? randomUUID();
    const slug = ensureUniqueSlug(payload.slug || slugify(payload.title), data.artworks, id);
    const images = payload.images?.length ? payload.images : existingArtwork?.images ?? [];

    const artwork = normalizeArtwork({
      ...payload,
      id,
      slug,
      images
    });

    const nextArtworks = existingArtwork
      ? data.artworks.map((item) => (item.id === id ? artwork : item))
      : [...data.artworks, artwork];

    writeGalleryData({ ...data, artworks: nextArtworks });
    return artwork;
  },

  deleteArtwork(id: string) {
    const data = readGalleryData();
    writeGalleryData({ ...data, artworks: data.artworks.filter((artwork) => artwork.id !== id) });
  },

  upsertCollection(collection: ArtworkCollection) {
    const data = readGalleryData();
    const existingCollection = data.collections.find((item) => item.id === collection.id);
    const nextCollection = {
      ...collection,
      slug: collection.slug || slugify(collection.name),
      description: collection.description?.trim() || null
    };
    const collections = existingCollection
      ? data.collections.map((item) => (item.id === collection.id ? nextCollection : item))
      : [...data.collections, nextCollection];

    writeGalleryData({ ...data, collections });
    return nextCollection;
  },

  deleteCollection(id: string) {
    const data = readGalleryData();
    writeGalleryData({
      ...data,
      collections: data.collections.filter((collection) => collection.id !== id),
      artworks: data.artworks.map((artwork) =>
        artwork.collectionId === id ? { ...artwork, collectionId: null, collection: null } : artwork
      )
    });
  },

  createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) {
    const data = readGalleryData();
    const nextInquiry: Inquiry = {
      ...inquiry,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new"
    };

    writeGalleryData({ ...data, inquiries: [nextInquiry, ...data.inquiries] });
    return nextInquiry;
  },

  listInquiries() {
    return readGalleryData().inquiries;
  }
};
