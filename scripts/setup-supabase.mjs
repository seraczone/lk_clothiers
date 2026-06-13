import pg from "pg";
import { readFile } from "node:fs/promises";
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
  "boubou-embellished-colors.jpeg": "boubou-embellished-colors.jpeg",
  "boys-kaftan-sage-tan.jpeg": "boys-kaftan-sage-tan.jpeg",
  "boys-kaftan-white.jpeg": "boys-kaftan-white.jpeg",
  "girls-purple-dress.jpeg": "girls-purple-dress.jpeg",
  "cat-boys.jpg": "cat-boys.jpg",
  "cat-glam.jpg": "cat-glam.jpg",
  "cat-shirts.jpg": "cat-shirts.jpg",
  "cat-twopc.jpg": "cat-twopc.jpg",
  "cat-boubou.jpg": "cat-boubou.jpg",
  "p1.jpg": "p1.jpg",
  "p3.jpg": "p3.jpg",
  "p4.jpg": "p4.jpg",
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
  { key: "girls", name: "Girls", image: "girls-purple-dress.jpeg", tagline: "Mini LK" },
  { key: "boys", name: "Boys", image: "boys-kaftan-sage-tan.jpeg", tagline: "Little gentlemen" },
  { key: "casual", name: "Casual", image: "cat-shirts.jpg", tagline: "Legacy everyday ease" },
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
  { key: "glam", name: "Glam", image: "cat-glam.jpg", tagline: "Evening statements" },
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
    "zara-mini",
    "Zara Mini Set",
    48000,
    "girls",
    "girls-purple-dress.jpeg",
    ["girls-purple-dress.jpeg"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Ivory", "Peach"],
    "A coordinated two-piece for our littlest customers, in soft brushed cotton.",
    "New",
    false,
    23,
    "Live",
  ],
  [
    "lila-dress",
    "Lila Cream Dress",
    55000,
    "girls",
    "girls-purple-dress.jpeg",
    ["girls-purple-dress.jpeg"],
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Cream"],
    "A breezy modest dress with hand-finished hems.",
    null,
    false,
    30,
    "Live",
  ],
  [
    "kai-twopc",
    "Kai Two-Piece",
    52000,
    "boys",
    "cat-boys.jpg",
    null,
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Coffee", "Ivory"],
    "A tailored two-piece set for boys, cut from breathable cotton.",
    null,
    false,
    37,
    "Live",
  ],
  [
    "omar-kaftan",
    "Omar Mini Kaftan",
    48000,
    "boys",
    "boys-kaftan-white.jpeg",
    null,
    ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"],
    ["Ivory"],
    "A miniature take on our signature kaftan.",
    null,
    false,
    21,
    "Live",
  ],
  [
    "ivory-shirt",
    "Ivory Atelier Shirt",
    62000,
    "casual",
    "cat-shirts.jpg",
    ["cat-shirts.jpg", "p1.jpg"],
    ["XS", "S", "M", "L", "XL"],
    ["Ivory", "Sand"],
    "A relaxed everyday shirt with a slightly oversized fit.",
    null,
    true,
    28,
    "Live",
  ],
  [
    "orange-set",
    "Burnt Orange Two-Piece",
    98000,
    "casual",
    "p3.jpg",
    null,
    ["XS", "S", "M", "L", "XL"],
    ["Burnt Orange"],
    "A confident two-piece in our signature burnt orange.",
    null,
    false,
    35,
    "Draft",
  ],
  [
    "coffee-set",
    "Coffee Co-ord Set",
    105000,
    "casual",
    "cat-twopc.jpg",
    null,
    ["XS", "S", "M", "L", "XL"],
    ["Coffee"],
    "A relaxed co-ord set with wide trousers and a tunic top.",
    null,
    false,
    19,
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
  [
    "noir-boubou",
    "Noir Glam Boubou",
    265000,
    "glam",
    "cat-boubou.jpg",
    null,
    ["XS", "S", "M", "L", "XL"],
    ["Noir", "Coffee"],
    "An evening boubou with tonal embroidery and silk lining.",
    null,
    false,
    24,
    "Live",
  ],
  [
    "gold-kaftan",
    "Gold Soiree Kaftan",
    285000,
    "glam",
    "cat-glam.jpg",
    null,
    ["XS", "S", "M", "L", "XL"],
    ["Champagne"],
    "Our most opulent kaftan, finished with hand-applied detailing.",
    "Signature",
    false,
    31,
    "Live",
  ],
  [
    "ivory-gown",
    "Ivory Statement Gown",
    240000,
    "glam",
    "p4.jpg",
    null,
    ["XS", "S", "M", "L", "XL"],
    ["Ivory"],
    "A floor-sweeping ivory gown for occasion dressing.",
    null,
    false,
    38,
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
  address: "Wuye District, Abuja FCT, Nigeria",
  email: "hello@lkclothiers.com",
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

      create table if not exists public.site_content (
        key text primary key,
        value jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

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

      drop trigger if exists site_content_set_updated_at on public.site_content;
      create trigger site_content_set_updated_at
      before update on public.site_content
      for each row execute function public.set_updated_at();

      alter table public.categories enable row level security;
      alter table public.products enable row level security;
      alter table public.site_content enable row level security;
    `);

    await upsertPolicies(client);

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

async function upsertPolicies(client) {
  const policies = [
    ["categories_select_public", "categories", "select", "using (true)"],
    ["products_select_public", "products", "select", "using (true)"],
    ["site_content_select_public", "site_content", "select", "using (true)"],
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
