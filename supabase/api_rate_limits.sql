-- Rate limiting for public POST endpoints (inquiries, admin login).
-- Run in Supabase → SQL Editor for the production project.

create table if not exists public.api_rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists api_rate_limit_events_bucket_created_at_idx
  on public.api_rate_limit_events (bucket, created_at desc);

alter table public.api_rate_limit_events enable row level security;
