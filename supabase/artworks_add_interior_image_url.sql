-- Дополнение схемы: URL фото работы в интерьере (поле в админке «Фото в интерьере»).
-- Выполните в Supabase → SQL Editor, если видите ошибку про отсутствие interior_image_url.

alter table public.artworks
  add column if not exists interior_image_url text;

comment on column public.artworks.interior_image_url is 'Optional full URL for interior/context image on artwork page';
