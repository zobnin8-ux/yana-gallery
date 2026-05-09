-- URL фото в интерьере для страницы работы (поле «Фото в интерьере (URL)» в админке).
-- Выполните целиком в Supabase → SQL Editor для того проекта, чей URL в NEXT_PUBLIC_SUPABASE_URL.

alter table public.artworks
  add column if not exists interior_image_url text;

comment on column public.artworks.interior_image_url is 'Optional full URL for interior/context image on artwork page';

-- Проверка: должна вернуть одну строку с interior_image_url
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'artworks'
  and column_name = 'interior_image_url';

-- Если колонка есть, а API всё ещё ругается на schema cache — подсказка кэшу PostgREST перечитать схему:
-- select pg_notify('pgrst', 'reload schema');
