import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { galleryStore, slugify } from "@/lib/gallery-store";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminSessionCookieName)?.value;

  return isAdminSession(session);
}

function parseNumber(value: unknown) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 100;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Требуется вход в админку." }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    name?: string;
    description?: string | null;
    coverArtworkId?: string | null;
    sortOrder?: number;
    featured?: boolean;
  };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ success: false, message: "Название коллекции обязательно." }, { status: 422 });
  }

  const collection = await galleryStore.upsertCollection({
    id: body.id ?? randomUUID(),
    slug: slugify(name),
    name,
    description: body.description?.trim() || null,
    coverArtworkId: body.coverArtworkId || null,
    sortOrder: parseNumber(body.sortOrder),
    featured: Boolean(body.featured)
  });

  return NextResponse.json({ success: true, collection });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false, message: "Требуется вход в админку." }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };

  if (!id || id === "collection-uncategorized") {
    return NextResponse.json({ success: false, message: "Эту коллекцию нельзя удалить." }, { status: 422 });
  }

  await galleryStore.deleteCollection(id);
  return NextResponse.json({ success: true });
}
