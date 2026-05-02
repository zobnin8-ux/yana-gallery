-- Заказы на оригиналы (оплата — отдельная интеграция). Выполните в SQL Editor Supabase после бэкапа.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  display_number bigint generated always as identity unique not null,
  access_token text not null unique,
  artwork_id uuid not null references artworks (id) on delete restrict,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  artwork_amount_value numeric(12, 2) not null,
  currency text not null default 'RUB',
  yookassa_artwork_payment_id text,
  yookassa_shipping_payment_id text,
  shipping_amount_value numeric(12, 2),
  shipping_confirmation_url text,
  status text not null,
  artwork_paid_at timestamptz,
  confirmed_at timestamptz,
  rejected_at timestamptz,
  shipping_paid_at timestamptz,
  preparing_at timestamptz,
  shipped_at timestamptz,
  tracking_number text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_artwork_id_idx on orders (artwork_id);
create index if not exists orders_created_at_idx on orders (created_at desc);
