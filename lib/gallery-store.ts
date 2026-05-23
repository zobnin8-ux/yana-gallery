import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";

import galleryData from "@/data/gallery.json";
import { slugify } from "@/lib/slugify";
import { uploadBlobToR2 } from "@/lib/storage";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Artwork, ArtworkCollection, ArtworkCollectionWithArtworks, ArtworkImage } from "@/types/artwork";
import type { Inquiry } from "@/types/inquiry";

type GalleryData = {
  collections: ArtworkCollection[];
  artworks: Artwork[];
  inquiries: Inquiry[];
};

type CollectionRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_artwork_id: string | null;
  sort_order: number;
  featured: boolean;
};

type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  collection_id: string | null;
  year: number | null;
  medium: string | null;
  size_label?: string | null;
  width: number | null;
  height: number | null;
  price: number | null;
  price_range?: string | null;
  currency: Artwork["currency"];
  status: Artwork["status"];
  description: string | null;
  shipping_note?: string | null;
  interior_image_url?: string | null;
  featured: boolean;
  hero: boolean;
  sort_order: number;
  show_price: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

type ArtworkImageRow = {
  id: string;
  artwork_id: string;
  url: string;
  thumbnail_url: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_primary: boolean;
};

type InquiryRow = {
  id: string;
  artwork_id: string | null;
  artwork_title: string | null;
  name: string;
  email: string;
  message: string;
  status: Inquiry["status"];
  created_at: string;
};

export type ArtworkPayload = Omit<Artwork, "id" | "images"> & {
  id?: string;
  images?: ArtworkImage[];
};

const fallbackData = galleryData as GalleryData;

export { extensionForArtworkUpload } from "@/lib/image-upload";

function collectionFromRow(row: CollectionRow): ArtworkCollection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    coverArtworkId: row.cover_artwork_id,
    sortOrder: row.sort_order,
    featured: row.featured
  };
}

function imageFromRow(row: ArtworkImageRow): ArtworkImage {
  return {
    id: row.id,
    url: row.url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    alt: row.alt,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary
  };
}

function artworkFromRow(row: ArtworkRow, collections: ArtworkCollection[], images: ArtworkImage[]): Artwork {
  const collection = row.collection_id ? collections.find((item) => item.id === row.collection_id) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    collectionId: row.collection_id,
    collection: collection?.name ?? null,
    year: row.year,
    medium: row.medium,
    sizeLabel: row.size_label ?? null,
    width: row.width,
    height: row.height,
    price: row.price,
    priceRange: row.price_range ?? null,
    currency: row.currency,
    status: row.status,
    description: row.description,
    shippingNote: row.shipping_note ?? null,
    interiorImageUrl: row.interior_image_url ?? null,
    images: images.sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)),
    featured: row.featured,
    hero: row.hero,
    sortOrder: row.sort_order,
    showPrice: row.show_price,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description
  };
}

function inquiryFromRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    artworkId: row.artwork_id,
    artworkTitle: row.artwork_title,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

function fallbackCollections(): ArtworkCollectionWithArtworks[] {
  const collections = [...fallbackData.collections].sort((left, right) => left.sortOrder - right.sortOrder);
  const artworks = [...fallbackData.artworks].sort((left, right) => left.sortOrder - right.sortOrder);
  const assignedArtworkIds = new Set<string>();
  const withArtworks = collections.map((collection) => {
    const collectionArtworks = artworks.filter((artwork) => artwork.collectionId === collection.id);
    collectionArtworks.forEach((artwork) => assignedArtworkIds.add(artwork.id));
    return { ...collection, artworks: collectionArtworks };
  });
  const uncategorized = artworks.filter((artwork) => !assignedArtworkIds.has(artwork.id));

  return uncategorized.length
    ? [
        ...withArtworks,
        {
          id: "collection-uncategorized",
          slug: "uncategorized",
          name: "Отдельные работы",
          description: null,
          coverArtworkId: uncategorized[0]?.id ?? null,
          sortOrder: 10000,
          featured: false,
          artworks: uncategorized
        }
      ]
    : withArtworks;
}

async function getSupabaseData() {
  const supabase = getSupabaseAdminClient();
  const [collectionsResult, artworksResult, imagesResult] = await Promise.all([
    supabase.from("collections").select("*").order("sort_order", { ascending: true }),
    supabase.from("artworks").select("*").order("sort_order", { ascending: true }),
    supabase.from("artwork_images").select("*").order("sort_order", { ascending: true })
  ]);

  if (collectionsResult.error) {
    throw collectionsResult.error;
  }

  if (artworksResult.error) {
    throw artworksResult.error;
  }

  if (imagesResult.error) {
    throw imagesResult.error;
  }

  const collections = (collectionsResult.data as CollectionRow[]).map(collectionFromRow);
  const imageRows = imagesResult.data as ArtworkImageRow[];
  const artworks = (artworksResult.data as ArtworkRow[]).map((row) =>
    artworkFromRow(
      row,
      collections,
      imageRows.filter((image) => image.artwork_id === row.id).map(imageFromRow)
    )
  );

  return { collections, artworks };
}

/** When Supabase URL/key are wrong or host is unreachable, public pages must not crash. */
async function tryGetSupabaseData() {
  try {
    return await getSupabaseData();
  } catch {
    return null;
  }
}

function errorMessageFromUnknown(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "";
}

function isMissingInteriorImageUrlColumnError(error: unknown): boolean {
  return errorMessageFromUnknown(error).includes("interior_image_url");
}

function artworkToRow(artwork: ArtworkPayload) {
  return {
    slug: artwork.slug,
    title: artwork.title,
    collection_id: artwork.collectionId ?? null,
    year: artwork.year ?? null,
    medium: artwork.medium ?? null,
    size_label: artwork.sizeLabel ?? null,
    width: artwork.width ?? null,
    height: artwork.height ?? null,
    price: artwork.price ?? null,
    price_range: artwork.priceRange ?? null,
    currency: artwork.currency ?? "EUR",
    status: artwork.status,
    description: artwork.description ?? null,
    shipping_note: artwork.shippingNote ?? null,
    interior_image_url: artwork.interiorImageUrl ?? null,
    featured: artwork.featured,
    hero: artwork.hero,
    sort_order: artwork.sortOrder,
    show_price: artwork.showPrice,
    seo_title: artwork.seoTitle ?? null,
    seo_description: artwork.seoDescription ?? null
  };
}

export const galleryStore = {
  async listArtworks() {
    noStore();

    if (!isSupabaseConfigured()) {
      return [...fallbackData.artworks].sort((left, right) => left.sortOrder - right.sortOrder);
    }

    const remote = await tryGetSupabaseData();
    if (!remote) {
      return [...fallbackData.artworks].sort((left, right) => left.sortOrder - right.sortOrder);
    }

    return remote.artworks;
  },

  async listFeaturedArtworks() {
    return (await galleryStore.listArtworks()).filter((artwork) => artwork.featured);
  },

  async listHeroArtworks() {
    return (await galleryStore.listArtworks()).filter((artwork) => artwork.hero);
  },

  async findArtworkById(id: string) {
    return (await galleryStore.listArtworks()).find((artwork) => artwork.id === id);
  },

  async findArtworkBySlug(slug: string) {
    const list = await this.listArtworks();
    const direct = list.find((artwork) => artwork.slug === slug);
    if (direct) {
      return direct;
    }
    const key = slugify(slug);
    return list.find((artwork) => slugify(artwork.slug) === key);
  },

  async updateArtworkStatus(id: string, status: Artwork["status"]) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is required to update artwork status.");
    }

    const { error } = await getSupabaseAdminClient().from("artworks").update({ status }).eq("id", id);

    if (error) {
      throw error;
    }
  },

  async listCollections(): Promise<ArtworkCollectionWithArtworks[]> {
    noStore();

    if (!isSupabaseConfigured()) {
      return fallbackCollections();
    }

    const remote = await tryGetSupabaseData();
    if (!remote) {
      return fallbackCollections();
    }

    const { collections, artworks } = remote;
    const assignedArtworkIds = new Set<string>();
    const withArtworks = collections.map((collection) => {
      const collectionArtworks = artworks.filter((artwork) => artwork.collectionId === collection.id);
      collectionArtworks.forEach((artwork) => assignedArtworkIds.add(artwork.id));
      return { ...collection, artworks: collectionArtworks };
    });
    const uncategorized = artworks.filter((artwork) => !assignedArtworkIds.has(artwork.id));

    return uncategorized.length
      ? [
          ...withArtworks,
          {
            id: "collection-uncategorized",
            slug: "uncategorized",
            name: "Отдельные работы",
            description: null,
            coverArtworkId: uncategorized[0]?.id ?? null,
            sortOrder: 10000,
            featured: false,
            artworks: uncategorized
          }
        ]
      : withArtworks;
  },

  async upsertArtwork(payload: ArtworkPayload) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is required to save artworks.");
    }

    const supabase = getSupabaseAdminClient();
    const id = payload.id || randomUUID();
    const artworkRow = { id, ...artworkToRow({ ...payload, slug: payload.slug || slugify(payload.title) }) };
    let { error } = await supabase.from("artworks").upsert(artworkRow, { onConflict: "id" });

    if (error && isMissingInteriorImageUrlColumnError(error)) {
      const { interior_image_url: _drop, ...rowWithoutInterior } = artworkRow;
      ({ error } = await supabase.from("artworks").upsert(rowWithoutInterior, { onConflict: "id" }));
    }

    if (error) {
      throw error;
    }

    if (payload.images) {
      await supabase.from("artwork_images").delete().eq("artwork_id", id);

      if (payload.images.length) {
        const { error: imagesError } = await supabase.from("artwork_images").insert(
          payload.images.map((image, index) => ({
            id: image.id || randomUUID(),
            artwork_id: id,
            url: image.url,
            thumbnail_url: image.thumbnailUrl ?? image.url,
            alt: image.alt,
            width: image.width ?? null,
            height: image.height ?? null,
            sort_order: image.sortOrder ?? index + 1,
            is_primary: image.isPrimary ?? index === 0
          }))
        );

        if (imagesError) {
          throw imagesError;
        }
      }
    }

    return galleryStore.findArtworkById(id);
  },

  async deleteArtwork(id: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is required to delete artworks.");
    }

    const { error } = await getSupabaseAdminClient().from("artworks").delete().eq("id", id);

    if (error) {
      throw error;
    }
  },

  async upsertCollection(collection: ArtworkCollection) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is required to save collections.");
    }

    const row = {
      id: collection.id || randomUUID(),
      slug: collection.slug || slugify(collection.name),
      name: collection.name,
      description: collection.description ?? null,
      cover_artwork_id: collection.coverArtworkId ?? null,
      sort_order: collection.sortOrder,
      featured: collection.featured
    };
    const { data, error } = await getSupabaseAdminClient()
      .from("collections")
      .upsert(row, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return collectionFromRow(data as CollectionRow);
  },

  async deleteCollection(id: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is required to delete collections.");
    }

    const { error } = await getSupabaseAdminClient().from("collections").delete().eq("id", id);

    if (error) {
      throw error;
    }
  },

  async createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) {
    if (!isSupabaseConfigured()) {
      return {
        ...inquiry,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        status: "new" as const
      };
    }

    const { data, error } = await getSupabaseAdminClient()
      .from("inquiries")
      .insert({
        artwork_id: inquiry.artworkId ?? null,
        artwork_title: inquiry.artworkTitle ?? null,
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        status: "new"
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return inquiryFromRow(data as InquiryRow);
  },

  async listInquiries() {
    noStore();

    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await getSupabaseAdminClient()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data as InquiryRow[]).map(inquiryFromRow);
  },

  async uploadArtworkImage(file: Blob, alt: string, sortOrder: number): Promise<ArtworkImage> {
    const { url } = await uploadBlobToR2(file, "artworks");

    return {
      id: randomUUID(),
      url,
      thumbnailUrl: url,
      alt,
      sortOrder,
      isPrimary: sortOrder === 1
    };
  }
};
