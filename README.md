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
- `GALLERY_ORDER_WEBHOOK_URL` (optional) — JSON POST on important order status changes, if you use the orders feature.

**Orders / online reserve:** the app can store orders in Supabase after you run `supabase/orders.sql`. **Online checkout is off until a payment provider is chosen and wired in** (there is placeholder server code and env names in the repo; you do not need to set them until then). Likely options to integrate later include **Robokassa** or **Prodamus** — the current placeholder adapter will be replaced when you pick one.

When Supabase is configured, gallery data is stored in Supabase tables and artwork images are uploaded to
Supabase Storage. Without Supabase environment variables, the app falls back to `data/gallery.json` for local
read-only development.

**Schema drift:** older `artworks` tables may lack columns the app writes (`size_label`, `price_range`, `shipping_note`, `interior_image_url`). In **the same Supabase project** as `NEXT_PUBLIC_SUPABASE_URL`, run `supabase/artworks_sync_missing_columns.sql` in **SQL Editor** (or `supabase/artworks_add_interior_image_url.sql` if you only need the interior URL). If the API still mentions “schema cache”, run once: `select pg_notify('pgrst', 'reload schema');` or wait and retry.
