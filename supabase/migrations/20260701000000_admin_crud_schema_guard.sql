-- Ensure the live Supabase schema matches the admin dashboard CRUD code.
-- This is intentionally additive/idempotent: it does not drop existing data.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  key text primary key,
  name text,
  image_url text,
  tagline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories add column if not exists name text;
alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists tagline text;
alter table public.categories add column if not exists created_at timestamptz not null default now();
alter table public.categories add column if not exists updated_at timestamptz not null default now();

update public.categories set name = key where name is null;
update public.categories set image_url = '' where image_url is null;
update public.categories set tagline = 'LK collection' where tagline is null;

alter table public.categories alter column name set not null;
alter table public.categories alter column image_url set not null;
alter table public.categories alter column tagline set not null;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create table if not exists public.products (
  id text primary key,
  name text,
  price integer,
  use_variants boolean not null default false,
  category text,
  image_url text,
  gallery_urls text[],
  color_images jsonb not null default '{}'::jsonb,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  description text not null default '',
  tag text,
  best_seller boolean not null default false,
  stock integer not null default 0,
  status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists name text;
alter table public.products add column if not exists price integer;
alter table public.products add column if not exists use_variants boolean not null default false;
alter table public.products add column if not exists category text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists gallery_urls text[];
alter table public.products add column if not exists color_images jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists sizes text[] not null default '{}';
alter table public.products add column if not exists colors text[] not null default '{}';
alter table public.products add column if not exists description text not null default '';
alter table public.products add column if not exists tag text;
alter table public.products add column if not exists best_seller boolean not null default false;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists status text not null default 'Draft';
alter table public.products add column if not exists created_at timestamptz not null default now();
alter table public.products add column if not exists updated_at timestamptz not null default now();

update public.products set name = id where name is null;
update public.products set price = 0 where price is null;
update public.products set category = (select key from public.categories order by name limit 1) where category is null;
update public.products set image_url = '' where image_url is null;
update public.products set sizes = '{}' where sizes is null;
update public.products set colors = '{}' where colors is null;
update public.products set description = '' where description is null;
update public.products set stock = 0 where stock is null;
update public.products set status = 'Draft' where status is null;

alter table public.products alter column name set not null;
alter table public.products alter column price set not null;
alter table public.products alter column image_url set not null;

alter table public.products drop constraint if exists products_price_nonnegative;
alter table public.products add constraint products_price_nonnegative check (price >= 0) not valid;

alter table public.products drop constraint if exists products_stock_nonnegative;
alter table public.products add constraint products_stock_nonnegative check (stock >= 0) not valid;

alter table public.products drop constraint if exists products_status_valid;
alter table public.products add constraint products_status_valid
check (status in ('Live', 'Draft', 'Archived')) not valid;

create index if not exists products_category_idx on public.products(category);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_created_at_idx on public.products(created_at desc);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

create table if not exists public.product_variants (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  variant_type text not null,
  variant_value text not null,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sku text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx
on public.product_variants(product_id);

create index if not exists product_variants_product_position_idx
on public.product_variants(product_id, position);

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

create table if not exists public.deleted_products (
  id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0 check (subtotal >= 0),
  discount integer not null default 0 check (discount >= 0),
  total integer not null default 0 check (total >= 0),
  payment_method text not null default 'paystack'
    check (payment_method in ('paystack', 'flutterwave', 'transfer')),
  delivery_method text not null default 'pickup'
    check (delivery_method in ('pickup', 'home')),
  delivery_address text,
  status text not null default 'Processing'
    check (status in ('Pending', 'Processing', 'Delivered', 'Cancelled')),
  customer_email_body text not null default '',
  admin_notification_body text not null default '',
  updated_at timestamptz not null default now(),
  check (delivery_method = 'pickup' or nullif(trim(delivery_address), '') is not null)
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_content enable row level security;
alter table public.product_variants enable row level security;
alter table public.deleted_products enable row level security;
alter table public.orders enable row level security;

drop policy if exists categories_select_public on public.categories;
create policy categories_select_public on public.categories
for select to anon, authenticated using (true);

drop policy if exists categories_insert_admin on public.categories;
create policy categories_insert_admin on public.categories
for insert to authenticated with check (true);

drop policy if exists categories_update_admin on public.categories;
create policy categories_update_admin on public.categories
for update to authenticated using (true) with check (true);

drop policy if exists categories_delete_admin on public.categories;
create policy categories_delete_admin on public.categories
for delete to authenticated using (true);

drop policy if exists products_select_public on public.products;
create policy products_select_public on public.products
for select to anon, authenticated using (true);

drop policy if exists products_insert_mvp on public.products;
drop policy if exists products_insert_admin on public.products;
create policy products_insert_admin on public.products
for insert to authenticated with check (true);

drop policy if exists products_update_mvp on public.products;
drop policy if exists products_update_admin on public.products;
create policy products_update_admin on public.products
for update to authenticated using (true) with check (true);

drop policy if exists products_delete_mvp on public.products;
drop policy if exists products_delete_admin on public.products;
create policy products_delete_admin on public.products
for delete to authenticated using (true);

drop policy if exists site_content_select_public on public.site_content;
create policy site_content_select_public on public.site_content
for select to anon, authenticated using (true);

drop policy if exists site_content_insert_mvp on public.site_content;
drop policy if exists site_content_insert_admin on public.site_content;
create policy site_content_insert_admin on public.site_content
for insert to authenticated with check (true);

drop policy if exists site_content_update_mvp on public.site_content;
drop policy if exists site_content_update_admin on public.site_content;
create policy site_content_update_admin on public.site_content
for update to authenticated using (true) with check (true);

drop policy if exists site_content_delete_admin on public.site_content;
create policy site_content_delete_admin on public.site_content
for delete to authenticated using (true);

drop policy if exists product_variants_select_public on public.product_variants;
create policy product_variants_select_public on public.product_variants
for select to anon, authenticated using (true);

drop policy if exists product_variants_insert_admin on public.product_variants;
create policy product_variants_insert_admin on public.product_variants
for insert to authenticated with check (true);

drop policy if exists product_variants_update_admin on public.product_variants;
create policy product_variants_update_admin on public.product_variants
for update to authenticated using (true) with check (true);

drop policy if exists product_variants_delete_admin on public.product_variants;
create policy product_variants_delete_admin on public.product_variants
for delete to authenticated using (true);

drop policy if exists deleted_products_select_public on public.deleted_products;
create policy deleted_products_select_public on public.deleted_products
for select to anon, authenticated using (true);

drop policy if exists deleted_products_insert_admin on public.deleted_products;
create policy deleted_products_insert_admin on public.deleted_products
for insert to authenticated with check (true);

drop policy if exists deleted_products_update_admin on public.deleted_products;
create policy deleted_products_update_admin on public.deleted_products
for update to authenticated using (true) with check (true);

drop policy if exists deleted_products_delete_admin on public.deleted_products;
create policy deleted_products_delete_admin on public.deleted_products
for delete to authenticated using (true);

drop policy if exists orders_insert_public on public.orders;
create policy orders_insert_public on public.orders
for insert to anon, authenticated with check (true);

drop policy if exists orders_select_admin on public.orders;
create policy orders_select_admin on public.orders
for select to authenticated using (true);

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders
for update to authenticated using (true) with check (true);

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders
for delete to authenticated using (true);

drop policy if exists product_images_select_public on storage.objects;
create policy product_images_select_public on storage.objects
for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_insert_mvp on storage.objects;
drop policy if exists product_images_insert_admin on storage.objects;
create policy product_images_insert_admin on storage.objects
for insert to authenticated
with check (bucket_id = 'product-images');

drop policy if exists product_images_update_mvp on storage.objects;
drop policy if exists product_images_update_admin on storage.objects;
create policy product_images_update_admin on storage.objects
for update to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists product_images_delete_admin on storage.objects;
create policy product_images_delete_admin on storage.objects
for delete to authenticated
using (bucket_id = 'product-images');
