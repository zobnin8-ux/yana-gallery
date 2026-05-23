import { randomUUID } from "node:crypto";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { extensionForArtworkUpload } from "@/lib/image-upload";
import { getR2BucketName, getR2Client, getR2PublicBaseUrl, isR2Configured } from "@/lib/r2";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function mimeForExtension(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp"
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

function assertImageBlob(blob: Blob, fileName?: string) {
  const type = blob.type.toLowerCase();
  if (type && !ALLOWED_TYPES.has(type)) {
    throw new Error("Неподдерживаемый формат. Используйте JPG, PNG или WEBP.");
  }
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой. Максимум 10 МБ.");
  }
  const ext = extensionForArtworkUpload(blob);
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
    throw new Error("Неподдерживаемый формат. Используйте JPG, PNG или WEBP.");
  }
  if (!type && fileName) {
    const fromName = fileName.split(".").pop()?.toLowerCase();
    if (fromName && !["jpg", "jpeg", "png", "webp"].includes(fromName)) {
      throw new Error("Неподдерживаемый формат. Используйте JPG, PNG или WEBP.");
    }
  }
}

function normalizeFolder(folder: string): string {
  return folder.replace(/^\/+|\/+$/g, "") || "artworks";
}

export async function uploadBlobToR2(blob: Blob, folder = "artworks"): Promise<{ key: string; url: string }> {
  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 не настроен. Задайте R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL."
    );
  }

  const fileName = typeof File !== "undefined" && blob instanceof File ? blob.name : undefined;
  assertImageBlob(blob, fileName);

  const ext = extensionForArtworkUpload(blob);
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  const key = `${normalizeFolder(folder)}/${Date.now()}-${randomUUID()}.${normalizedExt}`;
  const contentType = blob.type.trim() || mimeForExtension(normalizedExt);
  const body = Buffer.from(await blob.arrayBuffer());

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  const baseUrl = getR2PublicBaseUrl();
  return { key, url: `${baseUrl}/${key}` };
}

export async function uploadImageToR2(file: File, folder = "artworks"): Promise<{ key: string; url: string }> {
  return uploadBlobToR2(file, folder);
}

export async function deleteImageFromR2(keyOrUrl: string): Promise<void> {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  const baseUrl = getR2PublicBaseUrl();
  const key = keyOrUrl.startsWith(baseUrl) ? keyOrUrl.slice(baseUrl.length + 1) : keyOrUrl.replace(/^\/+/, "");

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key
    })
  );
}

/** @deprecated Use uploadBlobToR2 — kept for call sites migrating off Supabase Storage. */
export async function uploadBlobToPublicBucket(path: string, blob: Blob): Promise<string> {
  const folder = path.includes("/") ? path.split("/")[0] : "artworks";
  const { url } = await uploadBlobToR2(blob, folder);
  return url;
}
