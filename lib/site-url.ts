const DEFAULT_SITE_URL = "https://yanazubareva.com";

/** Public site origin; empty env in Vercel must not break `new URL()`. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return raw || DEFAULT_SITE_URL;
}

export function getSiteUrlOrigin(): URL {
  return new URL(getSiteUrl());
}
