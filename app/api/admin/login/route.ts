import { NextResponse } from "next/server";

import { adminSessionCookieName, getAdminPassword, getAdminSessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

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
