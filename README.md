# Yana Zubareva Gallery

Production-oriented Next.js App Router gallery engine for artist Yana Zubareva.

## Environment

- `GALLERY_ADMIN_PASSWORD` protects `/admin` (local fallback: `change-me`).
- `GALLERY_ADMIN_SESSION_TOKEN` can be set to rotate admin sessions independently from the password.
- `NEXT_PUBLIC_SITE_URL` is used for canonical sitemap and metadata URLs.
- `GALLERY_INQUIRY_WEBHOOK_URL` optionally receives saved inquiry payloads as JSON.

Gallery data is stored in `data/gallery.json`; uploaded artwork images are written to `public/uploads/artworks`.
