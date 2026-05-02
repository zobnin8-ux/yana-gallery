import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { adminSessionCookieName, isAdminSession } from "@/lib/admin-auth";
import { ordersStore } from "@/lib/orders-store";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminSession(cookieStore.get(adminSessionCookieName)?.value);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { id } = await context.params;
  let trackingNumber: string | null = null;
  try {
    const body = (await request.json()) as { trackingNumber?: string };
    trackingNumber = body.trackingNumber?.trim() || null;
  } catch {
    /* optional body */
  }

  try {
    await ordersStore.adminMarkShipped(id, trackingNumber);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Ошибка" },
      { status: 400 }
    );
  }
}
