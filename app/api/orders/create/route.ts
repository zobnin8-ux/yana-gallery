import { NextResponse } from "next/server";

import { isCheckoutEnabled } from "@/lib/checkout-config";
import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { ordersStore } from "@/lib/orders-store";

export const runtime = "nodejs";

function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  if (!isCheckoutEnabled()) {
    return NextResponse.json({ success: false, message: "Онлайн-оплата не настроена." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Некорректный JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Пустое тело запроса." }, { status: 400 });
  }

  const { artworkId, buyerName, buyerEmail, buyerPhone } = body as Record<string, unknown>;
  const name = String(buyerName ?? "").trim();
  const email = String(buyerEmail ?? "").trim().toLowerCase();
  const phone = typeof buyerPhone === "string" && buyerPhone.trim() ? buyerPhone.trim() : null;
  const id = String(artworkId ?? "").trim();

  if (!id || !name || !validEmail(email)) {
    return NextResponse.json({ success: false, message: "Укажите работу, имя и корректный email." }, { status: 422 });
  }

  const artwork = await artworksRepository.findById(id);
  if (!artwork) {
    return NextResponse.json({ success: false, message: "Работа не найдена." }, { status: 404 });
  }

  if (artwork.status !== "available") {
    return NextResponse.json({ success: false, message: "Работа недоступна для резерва." }, { status: 409 });
  }

  if (!artwork.showPrice || typeof artwork.price !== "number" || artwork.price <= 0) {
    return NextResponse.json({ success: false, message: "Для этой работы не указана цена для оплаты." }, { status: 422 });
  }

  if (artwork.currency !== "RUB") {
    return NextResponse.json(
      { success: false, message: "Онлайн-оплата пока доступна только для цен в рублях (RUB)." },
      { status: 422 }
    );
  }

  try {
    const result = await ordersStore.createPendingOrder({
      artworkId: artwork.id,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      artworkAmountRub: artwork.price
    });

    return NextResponse.json({
      success: true,
      confirmationUrl: result.confirmationUrl,
      orderToken: result.accessToken
    });
  } catch (error) {
    console.error("orders/create", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Не удалось создать заказ." },
      { status: 500 }
    );
  }
}
