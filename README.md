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
- **Онлайн-резерв оригиналов (ЮKassa):** `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, и
  `YOOKASSA_WEBHOOK_PATH_SECRET` — секрет в пути вебхука. В личном кабинете ЮKassa укажите URL вида
  `https://<домен>/api/webhooks/yookassa/<YOOKASSA_WEBHOOK_PATH_SECRET>`.
- `GALLERY_ORDER_WEBHOOK_URL` (необязательно) — POST JSON при ключевых сменах статуса заказа.

Перед использованием заказов выполните SQL `supabase/orders.sql` в проекте Supabase.

When Supabase is configured, gallery data is stored in Supabase tables and artwork images are uploaded to
Supabase Storage. Without Supabase environment variables, the app falls back to `data/gallery.json` for local
read-only development.
