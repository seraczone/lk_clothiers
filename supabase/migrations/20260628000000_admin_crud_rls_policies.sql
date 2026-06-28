-- Admin CRUD RLS policies for the current schema.
-- Existing tables only:
--   public.categories
--   public.products
--   public.site_content
-- Storage bucket:
--   product-images
--
-- RLS remains enabled. Public users can read storefront data.
-- Authenticated users, after passing the app's admin login/allowlist,
-- can create, update, and delete admin-managed records.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_content enable row level security;

drop policy if exists categories_select_public on public.categories;
create policy categories_select_public
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists categories_insert_admin on public.categories;
create policy categories_insert_admin
on public.categories for insert
to authenticated
with check (true);

drop policy if exists categories_update_admin on public.categories;
create policy categories_update_admin
on public.categories for update
to authenticated
using (true)
with check (true);

drop policy if exists categories_delete_admin on public.categories;
create policy categories_delete_admin
on public.categories for delete
to authenticated
using (true);

drop policy if exists products_select_public on public.products;
create policy products_select_public
on public.products for select
to anon, authenticated
using (true);

drop policy if exists products_insert_mvp on public.products;
drop policy if exists products_insert_admin on public.products;
create policy products_insert_admin
on public.products for insert
to authenticated
with check (true);

drop policy if exists products_update_mvp on public.products;
drop policy if exists products_update_admin on public.products;
create policy products_update_admin
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists products_delete_mvp on public.products;
drop policy if exists products_delete_admin on public.products;
create policy products_delete_admin
on public.products for delete
to authenticated
using (true);

drop policy if exists site_content_select_public on public.site_content;
create policy site_content_select_public
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists site_content_insert_mvp on public.site_content;
drop policy if exists site_content_insert_admin on public.site_content;
create policy site_content_insert_admin
on public.site_content for insert
to authenticated
with check (true);

drop policy if exists site_content_update_mvp on public.site_content;
drop policy if exists site_content_update_admin on public.site_content;
create policy site_content_update_admin
on public.site_content for update
to authenticated
using (true)
with check (true);

drop policy if exists site_content_delete_admin on public.site_content;
create policy site_content_delete_admin
on public.site_content for delete
to authenticated
using (true);

drop policy if exists product_images_select_public on storage.objects;
create policy product_images_select_public
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_insert_mvp on storage.objects;
drop policy if exists product_images_insert_admin on storage.objects;
create policy product_images_insert_admin
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists product_images_update_mvp on storage.objects;
drop policy if exists product_images_update_admin on storage.objects;
create policy product_images_update_admin
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists product_images_delete_admin on storage.objects;
create policy product_images_delete_admin
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
