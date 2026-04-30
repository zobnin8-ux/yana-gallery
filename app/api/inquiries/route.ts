import { NextResponse } from "next/server";

import { galleryStore } from "@/lib/gallery-store";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const artworkTitle = String(formData.get("artworkTitle") ?? "").trim() || null;

  if (!name || !isValidEmail(email) || message.length < 10) {
    return NextResponse.json(
      {
        success: false,
        message: "Проверьте имя, email и текст запроса."
      },
      { status: 422 }
    );
  }

  const inquiry = galleryStore.createInquiry({
    name,
    email,
    message,
    artworkId: null,
    artworkTitle
  });

  if (process.env.GALLERY_INQUIRY_WEBHOOK_URL) {
    fetch(process.env.GALLERY_INQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry)
    }).catch(() => undefined);
  }

  return NextResponse.json({
    success: true,
    message: "Спасибо. Запрос сохранён, я свяжусь с вами по email."
  });
}
