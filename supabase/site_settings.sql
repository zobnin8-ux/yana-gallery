-- Ключ–значение для редких настроек сайта (портрет на странице «Художник» и т.п.).
-- Выполните в Supabase → SQL Editor для проекта из NEXT_PUBLIC_SUPABASE_URL.

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is 'Site-wide key/value settings editable from admin';

-- Публичное чтение для будущего клиента; сейчас значения читает только сервер с service role.
alter table public.site_settings enable row level security;

create policy "Allow public read site_settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Запись только через service role (API админки), без policy для anon.

create index if not exists site_settings_key_idx on public.site_settings (key);
