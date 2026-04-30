import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { galleryStore, slugify } from "@/lib/gallery-store";
import type { ArtworkCurrency, ArtworkImage, ArtworkStatus } from "@/types/artwork";

export const runtime = "nodejs";

function parseNumber(value: FormDataEntryValue | null) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminSessionCookieName)?.value;

  return isAdminSession(session);
}

async function saveUploadedImages(formData: FormData, existingImages: ArtworkImage[]) {
  const files = formData
    .getAll("artworkImages")
    .filter((value): value is File => typeof File !== "undefined" && value instanceof File && value.size > 0);

  if (!files.length) {
    return existingImages;
  }

  const uploadedImages: ArtworkImage[] = [];

  for (const [index, file] of files.entries()) {
    uploadedImages.push(
      await galleryStore.uploadArtworkImage(
        file,
        String(formData.get("artworkTitle") ?? "Artwork"),
        existingImages.length + index + 1
      )
    );
  }

  return [...existingImages, ...uploadedImages].map((image, index) => ({
    ...image,
    sortOrder: index + 1,
    isPrimary: index === 0
  }));
}

function existingImagesFromForm(formData: FormData): ArtworkImage[] {
  return formData.getAll("existingImages").map((url, index) => ({
    id: randomUUID(),
    url: String(url),
    thumbnailUrl: String(url),
    alt: String(formData.get("artworkTitle") ?? "Artwork"),
    sortOrder: index + 1,
    isPrimary: index === 0
  }));
}

async function resolveCollection(formData: FormData) {
  const collectionId = String(formData.get("artworkCollectionId") ?? "").trim();
  const newCollectionName = String(formData.get("newCollectionName") ?? "").trim();
  const collections = (await galleryStore.listCollections()).filter((collection) => collection.id !== "collection-uncategorized");

  if (newCollectionName) {
    const existingCollection = collections.find(
      (collection) => collection.name.toLowerCase() === newCollectionName.toLowerCase()
    );

    if (existingCollection) {
      return existingCollection;
    }

    return galleryStore.upsertCollection({
      id: randomUUID(),
      slug: slugify(newCollectionName),
      name: newCollectionName,
      description: null,
      coverArtworkId: null,
      sortOrder: collections.length * 10 + 10,
      featured: false
    });
  }

  return collections.find((collection) => collection.id === collectionId) ?? null;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Требуется вход в админку." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("artworkTitle") ?? "").trim();

    if (!title) {
      return NextResponse.json({ success: false, message: "Название работы обязательно." }, { status: 422 });
    }

    const collection = await resolveCollection(formData);
    const existingImages = existingImagesFromForm(formData);
    const images = await saveUploadedImages(formData, existingImages);
    const id = String(formData.get("artworkId") ?? "").trim() || undefined;
    const slug = slugify(String(formData.get("artworkSlug") ?? "").trim() || title);

    const artwork = await galleryStore.upsertArtwork({
      id,
      slug,
      title,
      collectionId: collection?.id ?? null,
      collection: collection?.name ?? null,
      year: parseNumber(formData.get("artworkYear")),
      medium: String(formData.get("artworkMedium") ?? "").trim() || null,
      width: parseNumber(formData.get("artworkWidthCm")),
      height: parseNumber(formData.get("artworkHeightCm")),
      sizeLabel: String(formData.get("artworkSizeLabel") ?? "").trim() || null,
      price: parseNumber(formData.get("artworkPrice")),
      priceRange: String(formData.get("artworkPriceRange") ?? "").trim() || null,
      currency: (String(formData.get("artworkCurrency") ?? "EUR") || "EUR") as ArtworkCurrency,
      status: (String(formData.get("artworkStatus") ?? "available") || "available") as ArtworkStatus,
      description: String(formData.get("artworkDescription") ?? "").trim() || null,
      shippingNote: String(formData.get("artworkShippingNote") ?? "").trim() || null,
      images,
      featured: formData.get("artworkFeatured") === "on",
      hero: formData.get("artworkHero") === "on",
      sortOrder: parseNumber(formData.get("artworkSortOrder")) ?? 100,
      showPrice: formData.get("artworkShowPrice") === "on",
      seoTitle: String(formData.get("artworkSeoTitle") ?? "").trim() || null,
      seoDescription: String(formData.get("artworkSeoDescription") ?? "").trim() || null
    });

    return NextResponse.json({ success: true, artwork, redirectTo: "/admin/artworks" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Не удалось сохранить работу."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Требуется вход в админку." }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };

  if (!id) {
    return NextResponse.json({ success: false, message: "Не передан id работы." }, { status: 422 });
  }

  await galleryStore.deleteArtwork(id);
  return NextResponse.json({ success: true });
}
