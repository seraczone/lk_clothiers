-- Store explicit image selections for each product color.
-- Example value:
--   {"Blue": "https://.../blue-image.jpg", "Burgundy": "https://.../burgundy-image.jpg"}
--
-- This is additive and safe for existing products. Products without mappings
-- continue to use their primary image/gallery as before.

alter table public.products
add column if not exists color_images jsonb not null default '{}'::jsonb;
