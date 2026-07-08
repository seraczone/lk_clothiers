-- Add hierarchical categories without changing product-category relationships.

alter table public.categories add column if not exists parent_key text;
alter table public.categories add column if not exists sort_order integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'categories_parent_key_fkey'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_parent_key_fkey
      foreign key (parent_key)
      references public.categories(key)
      on update cascade
      on delete restrict;
  end if;
end;
$$;

insert into public.categories (key, name, image_url, tagline, parent_key, sort_order)
select
  'women',
  'Women',
  coalesce(
    (
      select image_url
      from public.categories
      where lower(key) not in ('boys', 'girls', 'women')
        and nullif(image_url, '') is not null
      order by created_at nulls last, name
      limit 1
    ),
    ''
  ),
  'LK women collection',
  null,
  0
where not exists (
  select 1
  from public.categories
  where lower(key) = 'women' or lower(name) = 'women'
);

update public.categories
set parent_key = null,
    sort_order = case lower(key)
      when 'women' then 0
      when 'boys' then 1
      when 'girls' then 2
      else sort_order
    end
where lower(key) in ('women', 'boys', 'girls');

update public.categories
set parent_key = (select key from public.categories where lower(key) = 'women' limit 1)
where parent_key is null
  and lower(key) not in ('women', 'boys', 'girls')
  and exists (select 1 from public.categories where lower(key) = 'women');

with ranked_children as (
  select
    key,
    row_number() over (partition by parent_key order by coalesce(sort_order, 999999), name) - 1 as next_order
  from public.categories
  where parent_key is not null
)
update public.categories c
set sort_order = ranked_children.next_order
from ranked_children
where c.key = ranked_children.key
  and c.sort_order is null;

create index if not exists categories_parent_key_idx on public.categories(parent_key);
create index if not exists categories_sort_order_idx on public.categories(parent_key, sort_order, name);
