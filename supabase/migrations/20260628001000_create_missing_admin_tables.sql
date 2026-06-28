-- Create the missing admin tables already used by the app:
--   public.product_variants
--   public.orders
--   public.deleted_products
--
-- This migration is safe to run after the existing-table RLS migration.
-- It keeps RLS enabled and grants only the access the app needs.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create index if not exists orders_created_at_idx
on public.orders(created_at desc);

create index if not exists orders_status_idx
on public.orders(status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.product_variants enable row level security;
alter table public.deleted_products enable row level security;
alter table public.orders enable row level security;

drop policy if exists product_variants_select_public on public.product_variants;
create policy product_variants_select_public
on public.product_variants for select
to anon, authenticated
using (true);

drop policy if exists product_variants_insert_admin on public.product_variants;
create policy product_variants_insert_admin
on public.product_variants for insert
to authenticated
with check (true);

drop policy if exists product_variants_update_admin on public.product_variants;
create policy product_variants_update_admin
on public.product_variants for update
to authenticated
using (true)
with check (true);

drop policy if exists product_variants_delete_admin on public.product_variants;
create policy product_variants_delete_admin
on public.product_variants for delete
to authenticated
using (true);

drop policy if exists deleted_products_select_public on public.deleted_products;
create policy deleted_products_select_public
on public.deleted_products for select
to anon, authenticated
using (true);

drop policy if exists deleted_products_insert_admin on public.deleted_products;
create policy deleted_products_insert_admin
on public.deleted_products for insert
to authenticated
with check (true);

drop policy if exists deleted_products_update_admin on public.deleted_products;
create policy deleted_products_update_admin
on public.deleted_products for update
to authenticated
using (true)
with check (true);

drop policy if exists deleted_products_delete_admin on public.deleted_products;
create policy deleted_products_delete_admin
on public.deleted_products for delete
to authenticated
using (true);

drop policy if exists orders_insert_public on public.orders;
create policy orders_insert_public
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists orders_select_admin on public.orders;
create policy orders_select_admin
on public.orders for select
to authenticated
using (true);

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin
on public.orders for update
to authenticated
using (true)
with check (true);

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin
on public.orders for delete
to authenticated
using (true);
