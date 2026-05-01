import { NextResponse, type NextRequest } from "next/server";

import { adminSessionCookieName, getAdminSessionToken } from "@/lib/admin-auth";
import { slugify } from "@/lib/slugify";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const artworkMatch = pathname.match(/^\/artworks\/([^/]+)$/);
  if (artworkMatch) {
    let segment = artworkMatch[1];
    try {
      segment = decodeURIComponent(segment);
    } catch {
      /* оставляем как в URL */
    }
    const canonical = slugify(segment);
    if (canonical && segment !== canonical) {
      const url = request.nextUrl.clone();
      url.pathname = `/artworks/${canonical}`;
      return NextResponse.redirect(url, 301);
    }
  }

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(adminSessionCookieName)?.value;

  if (session === getAdminSessionToken()) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/artworks/:slug"]
};
