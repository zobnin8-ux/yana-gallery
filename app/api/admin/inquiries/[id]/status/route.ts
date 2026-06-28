import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { galleryStore } from "@/lib/gallery-store";
import type { Inquiry } from "@/types/inquiry";

export const runtime = "nodejs";

const STATUSES: Inquiry["status"][] = ["new", "read", "archived"];

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminSession(cookieStore.get(adminSessionCookieName)?.value);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { status?: Inquiry["status"] } = {};
  try {
    body = (await request.json()) as { status?: Inquiry["status"] };
  } catch {
    return NextResponse.json({ success: false, message: "Некорректный запрос." }, { status: 400 });
  }

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ success: false, message: "Укажите статус: new, read или archived." }, { status: 422 });
  }

  try {
    await galleryStore.updateInquiryStatus(id, body.status);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Ошибка" },
      { status: 400 }
    );
  }
}
