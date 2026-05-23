import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { uploadBlobToR2 } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminSession(cookieStore.get(adminSessionCookieName)?.value);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Требуется вход в админку." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "artworks");

    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const result = await uploadBlobToR2(file, folder);
    return NextResponse.json(result);
  } catch (error) {
    console.error("R2 upload failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
