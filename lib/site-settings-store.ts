import { randomUUID } from "node:crypto";

import { unstable_noStore as noStore } from "next/cache";

import siteSettingsFallback from "@/data/site-settings.json";
import { extensionForArtworkUpload, uploadBlobToPublicBucket } from "@/lib/gallery-store";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

const ARTIST_PORTRAIT_KEY = "artist_portrait_url";

type SiteSettingsJson = {
  artistPortraitUrl?: string | null;
};

function errorMessageFromUnknown(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "";
}

function isSiteSettingsRelationMissing(error: unknown): boolean {
  const message = errorMessageFromUnknown(error);
  return message.includes("PGRST205") && message.includes("site_settings");
}

export async function getArtistPortraitUrl(): Promise<string | null> {
  noStore();

  if (!isSupabaseConfigured()) {
    const raw = siteSettingsFallback as SiteSettingsJson;
    const url = raw.artistPortraitUrl?.trim();
    return url || null;
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("site_settings")
    .select("value")
    .eq("key", ARTIST_PORTRAIT_KEY)
    .maybeSingle();

  if (error) {
    if (isSiteSettingsRelationMissing(error)) {
      return null;
    }
    throw error;
  }

  const value = data && typeof data === "object" && "value" in data ? String((data as { value: unknown }).value) : "";
  return value.trim() || null;
}

export async function setArtistPortraitUrl(url: string | null) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is required to save site settings.");
  }

  const supabase = getSupabaseAdminClient();
  const trimmed = url?.trim() || null;

  if (!trimmed) {
    const { error } = await supabase.from("site_settings").delete().eq("key", ARTIST_PORTRAIT_KEY);
    if (error && !isSiteSettingsRelationMissing(error)) {
      throw error;
    }
    return;
  }

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: ARTIST_PORTRAIT_KEY,
      value: trimmed,
      updated_at: new Date().toISOString()
    },
    { onConflict: "key" }
  );

  if (error) {
    if (isSiteSettingsRelationMissing(error)) {
      throw new Error("Таблица site_settings не найдена. Выполните supabase/site_settings.sql в SQL Editor.");
    }
    throw error;
  }
}

export async function uploadArtistPortraitImage(blob: Blob): Promise<string> {
  const ext = extensionForArtworkUpload(blob);
  const path = `site/artist-portrait-${Date.now()}-${randomUUID()}.${ext}`;
  return uploadBlobToPublicBucket(path, blob);
}
