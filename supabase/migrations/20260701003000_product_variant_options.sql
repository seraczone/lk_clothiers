-- Adds flexible option combinations to product variants.
-- Example options value: {"Color": "Pink", "Size": "XL"}.

alter table public.product_variants
add column if not exists options jsonb not null default '{}'::jsonb;

create index if not exists product_variants_options_gin_idx
on public.product_variants using gin (options);
