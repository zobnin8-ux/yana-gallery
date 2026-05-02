import { NextResponse } from "next/server";

import { ordersStore } from "@/lib/orders-store";

/**
 * Webhook route shape matches the placeholder adapter in `lib/yookassa.ts`. Change path and payload handling
 * when switching payment providers.
 */
export const runtime = "nodejs";

type YooNotification = {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    metadata?: Record<string, string>;
  };
};

export async function POST(
  request: Request,
  context: { params: Promise<{ secret: string }> }
) {
  const { secret } = await context.params;
  const expected = process.env.YOOKASSA_WEBHOOK_PATH_SECRET?.trim();
  if (!expected || secret !== expected) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let payload: YooNotification;
  try {
    payload = (await request.json()) as YooNotification;
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const event = payload.event;
  const payment = payload.object;
  if (!payment?.id || !payment.metadata) {
    return NextResponse.json({ ok: true });
  }

  const orderId = payment.metadata.order_id;
  const kind = payment.metadata.payment_kind;
  if (!orderId || (kind !== "artwork" && kind !== "shipping")) {
    return NextResponse.json({ ok: true });
  }

  if (event === "payment.succeeded" && payment.status === "succeeded") {
    try {
      if (kind === "artwork") {
        await ordersStore.onArtworkPaymentSucceeded(orderId, payment.id);
      } else {
        await ordersStore.onShippingPaymentSucceeded(orderId, payment.id);
      }
    } catch (error) {
      console.error("payment webhook", error);
      return new NextResponse("Error", { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
