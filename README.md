# Yana Zubareva Gallery

Production-oriented Next.js App Router gallery engine for artist Yana Zubareva.

## Environment

- `GALLERY_ADMIN_PASSWORD` protects `/admin` (local fallback: `change-me`).
- `GALLERY_ADMIN_SESSION_TOKEN` can be set to rotate admin sessions independently from the password.
- `NEXT_PUBLIC_SITE_URL` is used for canonical sitemap and metadata URLs.
- `NEXT_PUBLIC_SUPABASE_URL` points to the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is available for future public client-side Supabase reads.
- `SUPABASE_SERVICE_ROLE_KEY` is used only on the server for admin CRUD, inquiries, and uploads.
- `SUPABASE_STORAGE_BUCKET` defaults to `artworks`.
- `GALLERY_INQUIRY_WEBHOOK_URL` optionally receives saved inquiry payloads as JSON.

When Supabase is configured, gallery data is stored in Supabase tables and artwork images are uploaded to
Supabase Storage. Without Supabase environment variables, the app falls back to `data/gallery.json` for local
read-only development.
