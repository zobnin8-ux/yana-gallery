import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  setArtistPortraitUrl,
  uploadArtistPortraitImage
} from "@/lib/site-settings-store";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminSession(cookieStore.get(adminSessionCookieName)?.value);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Нужна авторизация." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Для фотографии художника нужен настроенный Supabase." },
      { status: 503 }
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const clear = formData.get("clearPortrait") === "on" || formData.get("clearPortrait") === "true";

      if (clear) {
        await setArtistPortraitUrl(null);
        return NextResponse.json({ success: true, artistPortraitUrl: null });
      }

      const file = formData.get("portrait");
      if (file instanceof Blob && file.size > 0) {
        const url = await uploadArtistPortraitImage(file);
        await setArtistPortraitUrl(url);
        return NextResponse.json({ success: true, artistPortraitUrl: url });
      }

      const urlRaw = String(formData.get("artistPortraitUrl") ?? "").trim();
      if (urlRaw) {
        await setArtistPortraitUrl(urlRaw);
        return NextResponse.json({ success: true, artistPortraitUrl: urlRaw });
      }

      return NextResponse.json(
        {
          success: false,
          message: "Добавьте файл, введите URL изображения или отметьте «Сбросить»."
        },
        { status: 422 }
      );
    }

    const body = (await request.json()) as { clearPortrait?: boolean; artistPortraitUrl?: string };
    if (body.clearPortrait) {
      await setArtistPortraitUrl(null);
      return NextResponse.json({ success: true, artistPortraitUrl: null });
    }
    const url = String(body.artistPortraitUrl ?? "").trim();
    if (url) {
      await setArtistPortraitUrl(url);
      return NextResponse.json({ success: true, artistPortraitUrl: url });
    }

    return NextResponse.json({ success: false, message: "Нет данных для сохранения." }, { status: 422 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить настройки.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
