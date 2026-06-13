import pg from "pg";

const { Client } = pg;

const required = ["SUPABASE_DB_URL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  const policies = [
    [
      "storage_public_read_product_images",
      "select",
      "using (bucket_id in ('product-images', 'site-assets'))",
    ],
    [
      "storage_anon_insert_product_images_mvp",
      "insert",
      "with check (bucket_id in ('product-images', 'site-assets'))",
    ],
    [
      "storage_anon_update_product_images_mvp",
      "update",
      "using (bucket_id in ('product-images', 'site-assets')) with check (bucket_id in ('product-images', 'site-assets'))",
    ],
  ];

  for (const [name, command, clause] of policies) {
    await client.query(`drop policy if exists ${name} on storage.objects`);
    await client.query(`create policy ${name} on storage.objects for ${command} ${clause}`);
  }
} finally {
  await client.end();
}

console.log("Storage policies updated.");
