# Yana Zubareva Gallery

Production-oriented **Next.js 15 (App Router)** site for a private gallery: exposition by series, artwork detail pages, contact inquiries, optional **orders / reserve** flow (payment integration is optional and currently a placeholder), and a **password-protected admin** for content.

This document is the **single operational source of truth** for the current branch: setup, Supabase, env vars, admin URLs, troubleshooting, and **how to push to GitHub**.

---

## Table of contents

1. [Stack](#stack)
2. [Repository and GitHub](#repository-and-github)
3. [Prerequisites](#prerequisites)
4. [Quick start (local)](#quick-start-local)
5. [Environment variables](#environment-variables)
6. [Supabase setup](#supabase-setup)
7. [Local development without Supabase](#local-development-without-supabase)
8. [Project layout (where things live)](#project-layout-where-things-live)
9. [Public site map](#public-site-map)
10. [Admin](#admin)
11. [Orders and payments](#orders-and-payments)
12. [Build and production](#build-and-production)
13. [Troubleshooting](#troubleshooting)
14. [Security checklist before production](#security-checklist-before-production)

---

## Stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js **15.2**, App Router, React **19** |
| Language | TypeScript |
| Database & storage (production) | **Supabase** (Postgres + Storage) |
| Auth (admin) | Cookie session; password from env (see [Admin](#admin)) |
| Images | `next/image` with **`unoptimized: true`** (see `next.config.ts`) |

---

## Repository and GitHub

Typical workflow from a clean machine:

```bash
git clone https://github.com/zobnin8-ux/yana-gallery.git
cd yana-gallery
git checkout cursor/gallery-engine-remake   # or your working branch
npm install
cp .env.local.example .env.local            # if you add an example file; otherwise create .env.local manually
# edit .env.local — see Environment variables
npm run dev
```

**Push changes to GitHub** (after you have committed):

```bash
git status
git add <files>
git commit -m "Your message"
git push origin cursor/gallery-engine-remake
```

If the remote branch does not exist yet:

```bash
git push -u origin cursor/gallery-engine-remake
```

**Open a pull request** against `main` on GitHub when the branch is ready.

> Replace `zobnin8-ux/yana-gallery` with your fork or org if the remote differs (`git remote -v`).

---

## Prerequisites

- **Node.js** 20+ (LTS recommended; matches typical Vercel/Render runtimes).
- **npm** (comes with Node).
- For full features: a **Supabase** project with Postgres + Storage.

---

## Quick start (local)

```bash
npm install
npm run dev
```

App: **http://localhost:3000**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

---

## Environment variables

Create **`.env.local`** in the project root (never commit secrets). Next.js loads it automatically.

**Example (copy and fill in):**

```bash
# Core
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=artworks

# Admin
GALLERY_ADMIN_PASSWORD=your-strong-password
GALLERY_ADMIN_SESSION_TOKEN=your-long-random-session-secret

# Optional webhooks
# GALLERY_INQUIRY_WEBHOOK_URL=
# GALLERY_ORDER_WEBHOOK_URL=

# Payment placeholder (leave unset to keep checkout off)
# YOOKASSA_SHOP_ID=
# YOOKASSA_SECRET_KEY=
# YOOKASSA_WEBHOOK_PATH_SECRET=
```

### Required for production (gallery + admin writes)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for admin API routes, uploads, and server reads |
| `GALLERY_ADMIN_PASSWORD` | Password for `/admin` login |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL (no trailing slash), sitemap, metadata, order links |

### Strongly recommended

| Variable | Purpose |
|----------|---------|
| `GALLERY_ADMIN_SESSION_TOKEN` | Fixed secret string stored in the admin cookie. **Set a long random value in production** so the session value is not derived from the password. |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for artwork and site images. Default: **`artworks`**. |

### Optional

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reserved for possible future browser-side Supabase usage; not required for current server-centric flow. |
| `GALLERY_INQUIRY_WEBHOOK_URL` | If set, `POST` JSON when a contact inquiry is saved. |
| `GALLERY_ORDER_WEBHOOK_URL` | If set, `POST` JSON on important order status changes (when orders feature is used). |

### Payment placeholder (checkout disabled until configured)

Checkout is **off** unless Supabase is configured **and** all of the following are set (see `lib/checkout-config.ts`):

- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

Webhook route (placeholder): **`YOOKASSA_WEBHOOK_PATH_SECRET`** — path segment for `app/api/webhooks/yookassa/[secret]`.

> The codebase may keep historical “YooKassa” env names; a future provider (e.g. Robokassa, Prodamus) would replace `lib/yookassa.ts` and related routes.

---

## Supabase setup

All SQL lives under **`supabase/`**. Run scripts in the **Supabase Dashboard → SQL Editor** for the **same** project as `NEXT_PUBLIC_SUPABASE_URL`.

### 1. Core gallery schema

Your project may already have `collections`, `artworks`, `artwork_images`, `inquiries` from earlier work. If you are bootstrapping from scratch, use whatever migration history you keep for those tables (not all are duplicated in this repo’s `supabase/` folder).

### 2. Schema drift on `artworks`

If the admin save fails on missing columns, run:

- **`supabase/artworks_sync_missing_columns.sql`** — adds `size_label`, `price_range`, `shipping_note`, `interior_image_url` if missing.

Alternatively, only interior URL:

- **`supabase/artworks_add_interior_image_url.sql`**

### 3. Orders (optional)

- **`supabase/orders.sql`** — creates `public.orders` for the reserve / delivery flow.

Without this table, the app still builds; server code treats a missing `orders` relation gracefully where applicable.

### 4. Site settings (artist portrait on About)

- **`supabase/site_settings.sql`** — key/value table (e.g. `artist_portrait_url` for `/about`).

Without it, `/admin/about` cannot persist a portrait to the database; the public `/about` page falls back to the default illustration.

### Storage bucket

- Create a **public** bucket (default name **`artworks`** or match `SUPABASE_STORAGE_BUCKET`).
- Uploaded paths include:
  - `artworks/…` — artwork images
  - `site/…` — artist portrait from admin

`next.config.ts` includes `images.remotePatterns` for `*.supabase.co` public object URLs.

---

## Local development without Supabase

If **`NEXT_PUBLIC_SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`** are **not** set:

- Public gallery reads from **`data/gallery.json`** (read-only seed).
- Admin **mutations** (save artwork, upload, inquiries to DB, orders) require Supabase — they will error or no-op as designed.
- Artist portrait fallback: **`data/site-settings.json`** (`artistPortraitUrl`) is read for `/about` when Supabase is off; **upload from admin requires Supabase**.

---

## Project layout (where things live)

| Path | Role |
|------|------|
| `app/(public)/` | Public routes: home, gallery, artwork, about, contact, checkout/archive placeholders |
| `app/(admin)/admin/` | Admin UI (protected by `middleware.ts`) |
| `app/api/` | Route handlers: admin CRUD, inquiries, orders, payment webhook placeholder |
| `components/` | UI components (layout, gallery, artworks, admin, checkout, order) |
| `lib/gallery-store.ts` | Artworks, collections, inquiries, image upload to Storage |
| `lib/orders-store.ts` | Orders CRUD and status transitions |
| `lib/site-settings-store.ts` | Site key/value (artist portrait URL) |
| `lib/supabase.ts` | Supabase admin client and bucket name |
| `lib/admin-auth.ts` | Admin password and session cookie value |
| `data/gallery.json` | Offline gallery seed |
| `data/site-settings.json` | Offline `site_settings` fallback |
| `supabase/*.sql` | Manual SQL migrations / reference scripts |
| `types/` | Shared TypeScript types |
| `middleware.ts` | Admin gate + artwork slug canonicalization |

---

## Public site map

| Route | Description |
|-------|-------------|
| `/` | Home: hero, featured feed, link to exposition |
| `/gallery` | Exposition: collections + filters |
| `/artworks/[slug]` | Artwork detail |
| `/about` | Artist dossier (portrait from `site_settings` when set) |
| `/contact` | Inquiry form |
| `/oplata/[slug]` | Checkout entry (when checkout enabled) |
| `/zakaz/[token]` | Order archive page for buyer (token in URL) |
| `/sitemap.xml`, `/robots.txt` | SEO |

---

## Admin

- **URL:** `/admin` (redirects to `/admin/login` if session cookie missing).
- **Login:** password = `GALLERY_ADMIN_PASSWORD`; session cookie = `GALLERY_ADMIN_SESSION_TOKEN` (must match server env).
- **Cookie name:** `yana-gallery-admin` (`lib/admin-auth.ts`).

### Admin sections

| Path | Purpose |
|------|---------|
| `/admin` | Overview |
| `/admin/artworks` | List works |
| `/admin/artworks/new` | Create work |
| `/admin/artworks/[id]/edit` | Edit work |
| `/admin/collections` | Collections |
| `/admin/inquiries` | Inquiries |
| `/admin/orders` | Orders list (needs `orders` table) |
| `/admin/orders/[id]` | Order detail + actions |
| `/admin/about` | Artist portrait for public `/about` |

---

## Orders and payments

- **Data model:** `supabase/orders.sql`. Columns named `yookassa_*` hold **generic external payment IDs** historically; they can be repurposed when switching provider.
- **Checkout:** gated in `lib/checkout-config.ts` — disabled until payment env + Supabase are set.
- **Webhook:** `app/api/webhooks/yookassa/[secret]/route.ts` — placeholder; `YOOKASSA_WEBHOOK_PATH_SECRET` must match the `[secret]` segment.

---

## Build and production

```bash
npm run build
npm run start
```

- **`next.config.ts`:** `images.unoptimized: true` avoids heavy image optimization on constrained hosts (e.g. some Render setups). Adjust if you move to a host with full image optimization support.
- Set **`NEXT_PUBLIC_SITE_URL`** to the deployed origin (e.g. `https://yanazubareva.com`).

---

## Troubleshooting

| Symptom | What to try |
|---------|-------------|
| `PGRST205` / table not in schema cache | Run the relevant `supabase/*.sql` in the correct project; then `select pg_notify('pgrst', 'reload schema');` in SQL Editor or wait and retry. |
| Missing column on `artworks` | Run `supabase/artworks_sync_missing_columns.sql`. |
| `interior_image_url` errors | Same, or `artworks_add_interior_image_url.sql`. |
| Admin uploads fail | Confirm Storage bucket exists, is **public** for read URLs, and `SUPABASE_SERVICE_ROLE_KEY` + bucket name are correct. |
| Images from Supabase not loading in `next/image` | Check `next.config.ts` `remotePatterns` matches your Supabase host. |
| Build fails on `/admin/orders` without DB | Orders store should degrade if table missing; if not, apply `orders.sql` or check error logs. |

---

## Security checklist before production

- [ ] Set **`GALLERY_ADMIN_PASSWORD`** to a strong unique password.
- [ ] Set **`GALLERY_ADMIN_SESSION_TOKEN`** to a long random secret (do not reuse the password).
- [ ] Never expose **`SUPABASE_SERVICE_ROLE_KEY`** to the client or commit it to git.
- [ ] Restrict Supabase **service role** usage to server-side only (already the case in this app).
- [ ] Confirm Storage policies: public read only where needed; writes only via service role / signed uploads as you prefer.

---

## License / ownership

Private project for the gallery; adjust this section if you open-source or add a formal license.
