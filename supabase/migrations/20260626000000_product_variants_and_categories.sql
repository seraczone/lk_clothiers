create table if not exists public.categories (
  key text primary key,
  name text not null,
  image_url text not null,
  tagline text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists use_variants boolean not null default false;

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.product_variants enable row level security;

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
