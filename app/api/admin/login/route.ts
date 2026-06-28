import { NextResponse } from "next/server";

import { adminSessionCookieName, getAdminPassword, getAdminSessionToken } from "@/lib/admin-auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { isTurnstileRequired, verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const rateLimit = await enforceRateLimit("admin-login", request);
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");
  const turnstileToken = String(formData.get("turnstileToken") ?? "");

  if (isTurnstileRequired()) {
    const captchaOk = await verifyTurnstileToken(turnstileToken, request);
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Подтвердите, что вы не робот." }, { status: 422 });
    }
  }

  if (password !== getAdminPassword()) {
    return NextResponse.json({ success: false, message: "Неверный пароль." }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    redirectTo: nextPath.startsWith("/admin") ? nextPath : "/admin"
  });

  response.cookies.set(adminSessionCookieName, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
