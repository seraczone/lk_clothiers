-- Required by admin CRUD upserts that use onConflict.
-- Safe to run after the schema guard migration.

create unique index if not exists categories_key_unique_idx
on public.categories(key);

create unique index if not exists products_id_unique_idx
on public.products(id);

create unique index if not exists site_content_key_unique_idx
on public.site_content(key);

create unique index if not exists product_variants_id_unique_idx
on public.product_variants(id);

create unique index if not exists deleted_products_id_unique_idx
on public.deleted_products(id);

create unique index if not exists orders_id_unique_idx
on public.orders(id);
