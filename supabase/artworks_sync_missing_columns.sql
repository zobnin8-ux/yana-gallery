-- Добавить колонки, которых нет в старой схеме, но которые ожидает приложение (см. lib/gallery-store artworkToRow).
-- Выполните в Supabase → SQL Editor на проекте из NEXT_PUBLIC_SUPABASE_URL.
-- Не пересоздавайте таблицу в проде — только ALTER.

alter table public.artworks add column if not exists size_label text;
alter table public.artworks add column if not exists price_range text;
alter table public.artworks add column if not exists shipping_note text;
alter table public.artworks add column if not exists interior_image_url text;

-- Проверка: должно быть 4 строки
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'artworks'
  and column_name in ('size_label', 'price_range', 'shipping_note', 'interior_image_url')
order by column_name;

-- При залипшем кэше PostgREST (редко):
-- select pg_notify('pgrst', 'reload schema');
