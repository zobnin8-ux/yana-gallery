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
  let body: { shippingAmountRub?: number } = {};
  try {
    body = (await request.json()) as { shippingAmountRub?: number };
  } catch {
    /* empty */
  }

  const raw = body.shippingAmountRub;
  const shippingAmountRub = typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, raw) : 0;

  try {
    const result = await ordersStore.adminConfirm(id, shippingAmountRub);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Ошибка" },
      { status: 400 }
    );
  }
}
