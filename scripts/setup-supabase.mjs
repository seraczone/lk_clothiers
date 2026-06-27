import pg from "pg";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const { Client } = pg;

const required = [
  "SUPABASE_DB_PASSWORD",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const projectRef = new URL(process.env.VITE_SUPABASE_URL).hostname.split(".")[0];
const databaseUrl =
  process.env.SUPABASE_DB_URL ??
  `postgresql://postgres:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`;

const assetMap = {
  "adire-blue-burgundy.jpeg": "adire-blue-burgundy.jpeg",
  "adire-orange.jpeg": "adire-orange.jpeg",
  "amara-print-dress-front.png": "amara-print-dress-front.png",
  "amara-print-dress-primary.png": "amara-print-dress-primary.png",
  "amara-print-dress-side.png": "amara-print-dress-side.png",
  "boubou-embellished-colors.jpeg": "boubou-embellished-colors.jpeg",
  "boys-blue-kaftan-hero.jpeg": "boys-blue-kaftan-hero.jpeg",
  "boys-kaftan-sage-tan.jpeg": "boys-kaftan-sage-tan.jpeg",
  "boys-kaftan-white.jpeg": "boys-kaftan-white.jpeg",
  "girl-dresses.png": "girl-dresses.png",
  "hero-collection.png": "hero-collection.png",
  "shirt-dress-blue-front-back.jpeg": "shirt-dress-blue-front-back.jpeg",
  "shirt-dress-blue-hanger.jpeg": "shirt-dress-blue-hanger.jpeg",
  "shirt-dress-blue-model.jpeg": "shirt-dress-blue-model.jpeg",
  "shirt-dress-pink-set.jpeg": "shirt-dress-pink-set.jpeg",
  "silk-flare-brown.jpeg": "silk-flare-brown.jpeg",
  "silk-flare-hangers.jpeg": "silk-flare-hangers.jpeg",
  "silk-flare-panel.jpeg": "silk-flare-panel.jpeg",
  "silk-flare-purple.jpeg": "silk-flare-purple.jpeg",
  "silk-flare-quartet.jpeg": "silk-flare-quartet.jpeg",
  "silk-flare-rack.jpeg": "silk-flare-rack.jpeg",
  "silk-flare-trio.jpeg": "silk-flare-trio.jpeg",
  "luxury-kaftan-models.jpeg": "luxury-kaftan-models.jpeg",
  "luxury-kaftan-mannequin.jpeg": "luxury-kaftan-mannequin.jpeg",
  "luxury-kaftan-detail.jpeg": "luxury-kaftan-detail.jpeg",
  "luxury-kaftan-hangers.jpeg": "luxury-kaftan-hangers.jpeg",
  "linen-pants-mint.jpeg": "linen-pants-mint.jpeg",
  "linen-long-shirt-mint.jpeg": "linen-long-shirt-mint.jpeg",
  "linen-set-mint.jpeg": "linen-set-mint.jpeg",
  "linen-long-shirt-yellow.jpeg": "linen-long-shirt-yellow.jpeg",
};

const categories = [
  { key: "girls", name: "Girls", image: "girl-dresses.png", tagline: "Mini LK" },
  { key: "boys", name: "Boys", image: "boys-blue-kaftan-hero.jpeg", tagline: "Little gentlemen" },
  {
    key: "shirt",
    name: "Shirt",
    image: "linen-long-shirt-mint.jpeg",
    tagline: "Tailored everyday shirts",
  },
  {
    key: "shirt-dress",
    name: "Shirt Dress",
    image: "shirt-dress-blue-hanger.jpeg",
    tagline: "Buttoned ease",
  },
  {
    key: "luxury-kaftan",
    name: "Luxury Kaftan",
    image: "luxury-kaftan-models.jpeg",
    tagline: "Embellished modest elegance",
  },
  { key: "linen", name: "Linen", image: "linen-set-mint.jpeg", tagline: "Easy linen separates" },
  {
    key: "boubou",
    name: "Bou'bou",
    image: "boubou-embellished-colors.jpeg",
    tagline: "Embellished ease",
  },
  { key: "adire", name: "Adire", image: "adire-orange.jpeg", tagline: "Artisan dyed pieces" },
  { key: "silk", name: "Silk", image: "silk-flare-purple.jpeg", tagline: "Silk flare dresses" },
];

const products = [
  [
    "girl-dresses",
    "Girl Dresses",
    55000,
    "girls",
    "girl-dresses.png",
    ["girl-dresses.png"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Burgundy"],
    "A polished girls dress with puff sleeves, button detailing and a matching headwrap.",
    "New",
    false,
    30,
    "Live",
  ],
  [
    "amara-print-dress",
    "Amara Print Dress",
    30000,
    "girls",
    "amara-print-dress-primary.png",
    ["amara-print-dress-primary.png", "amara-print-dress-side.png", "amara-print-dress-front.png"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Emerald", "Pink"],
    "A vibrant girls maxi dress designed for polished occasion wear and everyday confidence. Cut in a flowing silhouette with a self-tie waist, soft flared sleeves and a coordinated scarf, it brings comfortable modest coverage together with a bold LK print finish.",
    "New",
    false,
    30,
    "Live",
  ],
  [
    "boys-kaftan-sage-tan",
    "Boys Kaftan",
    55000,
    "boys",
    "boys-kaftan-sage-tan.jpeg",
    ["boys-kaftan-sage-tan.jpeg", "boys-kaftan-white.jpeg"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Sage", "Tan"],
    "A neatly finished boys kaftan with embroidered detailing and a polished modest fit.",
    "New",
    false,
    30,
    "Live",
  ],
  [
    "boys-kaftan-white",
    "Boys Kaftan",
    55000,
    "boys",
    "boys-kaftan-white.jpeg",
    ["boys-kaftan-white.jpeg", "boys-kaftan-sage-tan.jpeg"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["White", "Sage"],
    "A neatly finished boys kaftan with embroidered detailing and a polished modest fit.",
    null,
    false,
    30,
    "Live",
  ],
  [
    "luxury-embroidered-kaftan",
    "Luxury Embroidered Kaftan",
    85000,
    "luxury-kaftan",
    "luxury-kaftan-models.jpeg",
    [
      "luxury-kaftan-models.jpeg",
      "luxury-kaftan-mannequin.jpeg",
      "luxury-kaftan-detail.jpeg",
      "luxury-kaftan-hangers.jpeg",
    ],
    ["XS", "S", "M", "L", "XL"],
    ["Sage", "Charcoal", "Grey", "Black"],
    "A full-length embroidered kaftan with soft drape, statement sleeves and floral beadwork across the neckline and cuffs.",
    "New",
    true,
    24,
    "Live",
  ],
  [
    "linen-pants",
    "Linen Pants",
    35000,
    "linen",
    "linen-pants-mint.jpeg",
    ["linen-pants-mint.jpeg", "linen-set-mint.jpeg"],
    ["XS", "S", "M", "L", "XL"],
    ["Mint"],
    "Wide-leg linen pants with an easy elastic waist, soft drape and relaxed modest fit.",
    "New",
    false,
    30,
    "Live",
  ],
  [
    "linen-long-shirt",
    "Linen Long Shirt",
    45000,
    "linen",
    "linen-long-shirt-mint.jpeg",
    ["linen-long-shirt-mint.jpeg", "linen-set-mint.jpeg", "linen-long-shirt-yellow.jpeg"],
    ["XS", "S", "M", "L", "XL"],
    ["Mint", "Yellow", "Pink", "Beige", "Black", "Burgundy", "Purple"],
    "A flowing button-front linen long shirt with a soft collar, cuffed sleeves and versatile styling.",
    "New",
    true,
    30,
    "Live",
  ],
];

const content = {
  announcement: "Free delivery in Abuja on orders above NGN 100,000",
  heroEyebrow: "LK Clothiers - Wuye, Abuja",
  heroHeadline: "Modest fashion, timeless elegance.",
  heroAccent: "timeless",
  heroCopy:
    "Premium ready-to-wear for women, girls and boys, designed for the modern African family.",
  primaryCta: "Shop Collection",
  secondaryCta: "Chat on WhatsApp",
  atelierHeadline: "Quality, modesty, elegance.",
  home: {
    lookbookVideos: [
      { title: "The Aria Dress", caption: "Classic linen collection edit" },
      { title: "Girls Eid Edit", caption: "Mini LK occasionwear" },
      { title: "Silk Flare", caption: "Statement print" },
    ],
  },
  general: {
    address: "Block C, Suite 13 & 14,\nH & A Plaza, Wuye,\nAbuja FCT, Nigeria",
    email: "lkclothiers@gmail.com",
  },
  instagram: "@lk_clothiers",
};

await ensureBuckets();
const urls = await uploadAssets();
await setupDatabase(urls);

console.log("Supabase setup complete.");

async function ensureBuckets() {
  for (const bucket of ["product-images", "site-assets"]) {
    const response = await storageFetch("/bucket", {
      method: "POST",
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
        file_size_limit: 10 * 1024 * 1024,
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      if (!body.toLowerCase().includes("already exists") && !body.includes('"Duplicate"')) {
        throw new Error(`Unable to create bucket ${bucket}: ${body}`);
      }
    }
  }
}

async function uploadAssets() {
  const urls = {};
  for (const [source, destination] of Object.entries(assetMap)) {
    const bucket = source === "hero-collection.png" ? "site-assets" : "product-images";
    const filePath = path.join(process.cwd(), "src", "assets", source);
    if (existsSync(filePath)) {
      const bytes = await readFile(filePath);
      const response = await storageFetch(`/object/${bucket}/${destination}`, {
        method: "POST",
        headers: {
          "content-type": contentTypeFor(source),
          "x-upsert": "true",
        },
        body: bytes,
      });
      if (!response.ok) {
        throw new Error(`Unable to upload ${source}: ${await response.text()}`);
      }
    }
    urls[source] =
      `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${destination}`;
  }
  return urls;
}

function contentTypeFor(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "image/jpeg";
}

async function storageFetch(pathname, init = {}) {
  return fetch(`${process.env.VITE_SUPABASE_URL}/storage/v1${pathname}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function setupDatabase(urls) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query(`
      create table if not exists public.categories (
        key text primary key,
        name text not null,
        image_url text not null,
        tagline text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists public.products (
        id text primary key,
        name text not null,
        price integer not null check (price >= 0),
        use_variants boolean not null default false,
        category text not null references public.categories(key),
        image_url text not null,
        gallery_urls text[],
        sizes text[] not null default '{}',
        colors text[] not null default '{}',
        description text not null default '',
        tag text,
        best_seller boolean not null default false,
        stock integer not null default 0 check (stock >= 0),
        status text not null default 'Draft' check (status in ('Live', 'Draft', 'Archived')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      alter table public.products add column if not exists use_variants boolean not null default false;

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

      create table if not exists public.site_content (
        key text primary key,
        value jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists public.deleted_products (
        id text primary key,
        created_at timestamptz not null default now()
      );

      create table if not exists public.orders (
        id text primary key,
        created_at timestamptz not null default now(),
        customer jsonb not null,
        items jsonb not null,
        subtotal integer not null check (subtotal >= 0),
        discount integer not null default 0 check (discount >= 0),
        total integer not null check (total >= 0),
        payment_method text not null check (payment_method in ('paystack', 'flutterwave', 'transfer')),
        delivery_method text not null check (delivery_method in ('pickup', 'home')),
        delivery_address text,
        status text not null default 'Processing' check (status in ('Pending', 'Processing', 'Delivered', 'Cancelled')),
        customer_email_body text not null default '',
        admin_notification_body text not null default '',
        updated_at timestamptz not null default now(),
        check (delivery_method = 'pickup' or nullif(trim(delivery_address), '') is not null)
      );

      alter table public.orders add column if not exists customer jsonb not null default '{}'::jsonb;
      alter table public.orders add column if not exists items jsonb not null default '[]'::jsonb;
      alter table public.orders add column if not exists subtotal integer not null default 0 check (subtotal >= 0);
      alter table public.orders add column if not exists discount integer not null default 0 check (discount >= 0);
      alter table public.orders add column if not exists total integer not null default 0 check (total >= 0);
      alter table public.orders add column if not exists payment_method text not null default 'paystack';
      alter table public.orders add column if not exists delivery_method text not null default 'pickup';
      alter table public.orders add column if not exists delivery_address text;
      alter table public.orders add column if not exists status text not null default 'Processing';
      alter table public.orders add column if not exists customer_email_body text not null default '';
      alter table public.orders add column if not exists admin_notification_body text not null default '';
      alter table public.orders add column if not exists updated_at timestamptz not null default now();

      create or replace function public.set_updated_at()
      returns trigger
      language plpgsql
      as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$;

      drop trigger if exists categories_set_updated_at on public.categories;
      create trigger categories_set_updated_at
      before update on public.categories
      for each row execute function public.set_updated_at();

      drop trigger if exists products_set_updated_at on public.products;
      create trigger products_set_updated_at
      before update on public.products
      for each row execute function public.set_updated_at();

      drop trigger if exists product_variants_set_updated_at on public.product_variants;
      create trigger product_variants_set_updated_at
      before update on public.product_variants
      for each row execute function public.set_updated_at();

      drop trigger if exists site_content_set_updated_at on public.site_content;
      create trigger site_content_set_updated_at
      before update on public.site_content
      for each row execute function public.set_updated_at();

      drop trigger if exists orders_set_updated_at on public.orders;
      create trigger orders_set_updated_at
      before update on public.orders
      for each row execute function public.set_updated_at();

      alter table public.categories enable row level security;
      alter table public.products enable row level security;
      alter table public.product_variants enable row level security;
      alter table public.site_content enable row level security;
      alter table public.deleted_products enable row level security;
      alter table public.orders enable row level security;
    `);

    await upsertPolicies(client);
    await upsertStoragePolicies(client);

    for (const category of categories) {
      await client.query(
        `
          insert into public.categories (key, name, image_url, tagline)
          values ($1, $2, $3, $4)
          on conflict (key) do update set
            name = excluded.name,
            image_url = excluded.image_url,
            tagline = excluded.tagline
        `,
        [category.key, category.name, urls[category.image], category.tagline],
      );
    }

    for (const product of products) {
      const [
        id,
        name,
        price,
        category,
        image,
        gallery,
        sizes,
        colors,
        description,
        tag,
        bestSeller,
        stock,
        status,
      ] = product;
      await client.query(
        `
          insert into public.products (
            id, name, price, category, image_url, gallery_urls, sizes, colors,
            description, tag, best_seller, stock, status
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          on conflict (id) do update set
            name = excluded.name,
            price = excluded.price,
            category = excluded.category,
            image_url = excluded.image_url,
            gallery_urls = excluded.gallery_urls,
            sizes = excluded.sizes,
            colors = excluded.colors,
            description = excluded.description,
            tag = excluded.tag,
            best_seller = excluded.best_seller,
            stock = excluded.stock,
            status = excluded.status
        `,
        [
          id,
          name,
          price,
          category,
          urls[image],
          gallery?.map((item) => urls[item]) ?? null,
          sizes,
          colors,
          description,
          tag,
          bestSeller,
          stock,
          status,
        ],
      );
    }

    await client.query(
      `
        delete from public.products
        where category = 'glam'
          or id in (
            'zara-mini',
            'lila-dress',
            'noir-boubou',
            'gold-kaftan',
            'ivory-gown',
            'kai-twopc',
            'omar-kaftan',
            'ivory-shirt',
            'orange-set',
            'coffee-set'
          )
      `,
    );
    await client.query("delete from public.categories where key in ('glam', 'casual')");
    await removeDeletedGeneratedAssets();

    await client.query(
      `
        insert into public.site_content (key, value)
        values ('homepage', $1)
        on conflict (key) do update set value = excluded.value
      `,
      [content],
    );
  } finally {
    await client.end();
  }
}

async function removeDeletedGeneratedAssets() {
  const staleObjects = [
    "girls-purple-dress.jpeg",
    "girls-green-dress.jpeg",
    "cat-boys.jpg",
    "cat-boubou.jpg",
    "cat-shirts.jpg",
    "cat-twopc.jpg",
    "p1.jpg",
    "p3.jpg",
    "p4.jpg",
  ];
  const response = await storageFetch("/object/product-images", {
    method: "DELETE",
    body: JSON.stringify({ prefixes: staleObjects }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to remove deleted generated assets: ${body}`);
  }
}

async function upsertPolicies(client) {
  const policies = [
    ["categories_select_public", "categories", "select", "using (true)"],
    ["categories_insert_admin", "categories", "insert", "to authenticated with check (true)"],
    [
      "categories_update_admin",
      "categories",
      "update",
      "to authenticated using (true) with check (true)",
    ],
    ["categories_delete_admin", "categories", "delete", "to authenticated using (true)"],
    ["products_select_public", "products", "select", "using (true)"],
    ["product_variants_select_public", "product_variants", "select", "using (true)"],
    [
      "product_variants_insert_admin",
      "product_variants",
      "insert",
      "to authenticated with check (true)",
    ],
    [
      "product_variants_update_admin",
      "product_variants",
      "update",
      "to authenticated using (true) with check (true)",
    ],
    [
      "product_variants_delete_admin",
      "product_variants",
      "delete",
      "to authenticated using (true)",
    ],
    ["site_content_select_public", "site_content", "select", "using (true)"],
    [
      "deleted_products_select_public",
      "deleted_products",
      "select",
      "to anon, authenticated using (true)",
    ],
    [
      "deleted_products_insert_admin",
      "deleted_products",
      "insert",
      "to authenticated with check (true)",
    ],
    [
      "deleted_products_update_admin",
      "deleted_products",
      "update",
      "to authenticated using (true) with check (true)",
    ],
    [
      "deleted_products_delete_admin",
      "deleted_products",
      "delete",
      "to authenticated using (true)",
    ],
    ["orders_insert_public", "orders", "insert", "to anon, authenticated with check (true)"],
    ["orders_select_admin", "orders", "select", "to authenticated using (true)"],
    ["products_insert_mvp", "products", "insert", "with check (true)"],
    ["products_update_mvp", "products", "update", "using (true) with check (true)"],
    ["products_delete_mvp", "products", "delete", "using (true)"],
    ["site_content_insert_mvp", "site_content", "insert", "with check (true)"],
    ["site_content_update_mvp", "site_content", "update", "using (true) with check (true)"],
  ];

  for (const [name, table, command, clause] of policies) {
    await client.query(`drop policy if exists ${name} on public.${table}`);
    await client.query(`create policy ${name} on public.${table} for ${command} ${clause}`);
  }
}

async function upsertStoragePolicies(client) {
  await client.query(`
    drop policy if exists product_images_select_public on storage.objects;
    create policy product_images_select_public
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'product-images');

    drop policy if exists product_images_insert_mvp on storage.objects;
    create policy product_images_insert_mvp
    on storage.objects for insert
    to anon, authenticated
    with check (bucket_id = 'product-images');

    drop policy if exists product_images_update_mvp on storage.objects;
    create policy product_images_update_mvp
    on storage.objects for update
    to anon, authenticated
    using (bucket_id = 'product-images')
    with check (bucket_id = 'product-images');
  `);
}
