import { NextResponse } from "next/server";

import { galleryStore } from "@/lib/gallery-store";
import { enforceRateLimit } from "@/lib/rate-limit";
import { isTurnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit("inquiry", request);
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const artworkSlug = String(formData.get("artworkSlug") ?? "").trim() || null;
  const artworkIdInput = String(formData.get("artworkId") ?? "").trim() || null;
  const turnstileToken = String(formData.get("turnstileToken") ?? "");
  let artworkTitle = String(formData.get("artworkTitle") ?? "").trim() || null;

  if (isTurnstileRequired()) {
    const captchaOk = await verifyTurnstileToken(turnstileToken, request);
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Подтвердите, что вы не робот." }, { status: 422 });
    }
  }

  if (!name || !isValidEmail(email) || message.length < 10) {
    return NextResponse.json(
      {
        success: false,
        message: "Проверьте имя, email и текст запроса."
      },
      { status: 422 }
    );
  }

  let artworkId: string | null = artworkIdInput && isUuid(artworkIdInput) ? artworkIdInput : null;

  if (artworkSlug) {
    const artwork = await galleryStore.findArtworkBySlug(artworkSlug);
    if (artwork) {
      artworkId = artwork.id;
      artworkTitle = artworkTitle || artwork.title;
    }
  }

  try {
    const inquiry = await galleryStore.createInquiry({
      name,
      email,
      message,
      artworkId,
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
      message: "Спасибо. Заявка принята — свяжемся с вами в ближайшее время."
    });
  } catch (error) {
    console.error("Inquiry create failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Не удалось сохранить заявку. Попробуйте позже или напишите на почту студии."
      },
      { status: 500 }
    );
  }
}
