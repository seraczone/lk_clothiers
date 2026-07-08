import {
  categories,
  products,
  type Category,
  type CategoryKey,
  type Product,
  type ProductVariant,
} from "@/lib/catalog";
import type { CartItem } from "@/lib/cart";
import { isSupabaseConfigured, supabase, supabaseConfigError } from "@/lib/supabase";

export type ProductStatus = "Live" | "Draft" | "Archived";
export type AdminProduct = Product & {
  stock: number;
  status: ProductStatus;
};

export type AdminCategory = Category;

export type ContentState = {
  general: {
    address: string;
    email: string;
    instagram: string;
    phoneDisplay: string;
    hours: string;
    footerCopy: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    copyright: string;
    credit: string;
  };
  home: {
    announcement: string;
    heroEyebrow: string;
    heroLineOne: string;
    heroAccent: string;
    heroLineTwo: string;
    heroCopy: string;
    primaryCta: string;
    secondaryCta: string;
    heroMetaLeft: string;
    heroMetaRight: string;
    heroSeasonLabel: string;
    heroLookLabel: string;
    marqueeItems: string[];
    collectionsEyebrow: string;
    collectionsTitle: string;
    collectionsCta: string;
    newArrivalsEyebrow: string;
    newArrivalsTitle: string;
    newArrivalsCta: string;
    bestSellersEyebrow: string;
    bestSellersTitle: string;
    aboutEyebrow: string;
    aboutHeadline: string;
    aboutCopy: string;
    aboutCta: string;
    stats: { value: string; label: string }[];
    lookbookEyebrow: string;
    lookbookTitle: string;
    lookbookAccent: string;
    lookbookCta: string;
    lookbookVideos: { title: string; caption: string }[];
    whyEyebrow: string;
    whyTitle: string;
    reasons: { title: string; description: string }[];
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    testimonials: { quote: string; name: string; city: string }[];
    instagramEyebrow: string;
    instagramHandle: string;
    instagramCta: string;
    visitEyebrow: string;
    visitTitle: string;
    addressLabel: string;
    hoursLabel: string;
    contactLabel: string;
    directionsCta: string;
    mapTitle: string;
    mapLocation: string;
  };
  shop: {
    eyebrow: string;
    title: string;
    copy: string;
    browseEyebrow: string;
    browseTitle: string;
    viewAll: string;
    collectionsLabel: string;
    allPieces: string;
    searchLabel: string;
    searchPlaceholder: string;
    sortLabel: string;
    maxPriceLabel: string;
    resultsHelper: string;
  };
  about: {
    eyebrow: string;
    headlinePrefix: string;
    headlineAccent: string;
    headlineSuffix: string;
    copy: string;
    pillars: { title: string; description: string }[];
    whyEyebrow: string;
    whyTitle: string;
    whyCopy: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    formTitle: string;
    successTitle: string;
    successCopy: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    messageLabel: string;
    button: string;
    atelierTitle: string;
    hoursLabel: string;
    contactLabel: string;
    followLabel: string;
    instagramLabel: string;
    tiktokLabel: string;
    whatsappLabel: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
    privacyTitle: string;
    privacyCopy: string;
    termsTitle: string;
    termsCopy: string;
  };
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  use_variants?: boolean | null;
  category: CategoryKey;
  image_url: string;
  gallery_urls: string[] | null;
  color_images?: Record<string, string> | null;
  sizes: string[];
  colors: string[];
  description: string;
  tag: string | null;
  best_seller: boolean;
  stock: number;
  status: ProductStatus;
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  variant_type: string;
  variant_value: string;
  options?: Record<string, string> | null;
  price: number;
  stock: number;
  sku: string | null;
  position: number | null;
};

type CategoryRow = {
  key: string;
  name: string;
  image_url: string;
  tagline: string;
  parent_key?: string | null;
  sort_order?: number | null;
};

type SiteContentRow = {
  key: string;
  value: Partial<ContentState>;
};

type DeletedProductRow = {
  id: string;
};

export const defaultContent: ContentState = {
  general: {
    address: "Block C, Suite 13 & 14,\nH & A Plaza, Wuye,\nAbuja FCT, Nigeria",
    email: "lkclothiers@gmail.com",
    instagram: "@lk_clothiers",
    phoneDisplay: "+234 817 195 0268",
    hours: "Mon - Sat - 10:00 - 19:00",
    footerCopy:
      "Premium modest fashion for the modern African family. Crafted with intention in Abuja.",
    newsletterPlaceholder: "Your email for new drops",
    newsletterButton: "Join",
    copyright: "(c) 2026 LK Clothiers - Wuye, Abuja",
    credit: "Designed by Seraczone Technology Limited",
  },
  home: {
    announcement: "Free delivery in Abuja on orders above NGN 100,000",
    heroEyebrow: "LK Clothiers - Wuye, Abuja",
    heroLineOne: "Modest fashion,",
    heroAccent: "timeless",
    heroLineTwo: "elegance.",
    heroCopy:
      "Premium ready-to-wear for women, girls and boys - designed for the modern African family.",
    primaryCta: "Shop Collection",
    secondaryCta: "Chat on WhatsApp",
    heroMetaLeft: "Est. 2019",
    heroMetaRight: "Abuja - Nigeria",
    heroSeasonLabel: "Autumn / Winter 26",
    heroLookLabel: "Look 01 - Ivory Kaftan",
    marqueeItems: [
      "Free Delivery in Abuja",
      "Nationwide Shipping",
      "Atelier Appointments",
      "Bespoke Tailoring",
      "Modest by Design",
    ],
    collectionsEyebrow: "The Collections",
    collectionsTitle: "Considered wardrobes for the whole family.",
    collectionsCta: "View all",
    newArrivalsEyebrow: "New Arrivals",
    newArrivalsTitle: "Fresh from the atelier.",
    newArrivalsCta: "Shop all new",
    bestSellersEyebrow: "Best Sellers",
    bestSellersTitle: "The pieces our clients return for, again and again.",
    aboutEyebrow: "Our Atelier",
    aboutHeadline: "Quality, modesty, elegance.",
    aboutCopy:
      "Founded in Abuja, LK Clothiers is a quiet study in modern modesty. Each piece is cut from considered fabrics and finished by hand. We believe modest dress is not a limitation, but a language of confidence.",
    aboutCta: "Read our story",
    stats: [
      { value: "6+", label: "Years crafting" },
      { value: "12k", label: "Women dressed" },
      { value: "36", label: "States delivered" },
    ],
    lookbookEyebrow: "In Motion",
    lookbookTitle: "The lookbook,",
    lookbookAccent: "in motion",
    lookbookCta: "Shop the edit",
    lookbookVideos: [
      { title: "The Aria Dress", caption: "Classic linen collection edit" },
      { title: "Girls Eid Edit", caption: "Mini LK occasionwear" },
      { title: "Silk Flare", caption: "Statement print" },
    ],
    whyEyebrow: "Why LK",
    whyTitle: "A quieter way to shop.",
    reasons: [
      {
        title: "Premium Quality",
        description: "Hand-finished pieces in Italian and Turkish fabrics.",
      },
      {
        title: "Elegant Designs",
        description: "Timeless silhouettes, refined for the modern woman.",
      },
      {
        title: "Nationwide Delivery",
        description: "Express shipping to all 36 states in 2-5 days.",
      },
      {
        title: "Exceptional Service",
        description: "Personal styling and bespoke alterations on request.",
      },
    ],
    testimonialsEyebrow: "Client Diary",
    testimonialsTitle: "Worn and loved.",
    testimonials: [
      {
        quote:
          "My LK kaftan turned heads at every event of the season. The fabric, the cut - pure artistry.",
        name: "Aisha A.",
        city: "Abuja",
      },
      {
        quote:
          "Finally a modest brand that doesn't compromise on style. Their kaftans have redefined my wardrobe.",
        name: "Halima O.",
        city: "Lagos",
      },
      {
        quote:
          "Bought matching pieces for my daughter and I. The quality is honestly worth every naira.",
        name: "Fatima B.",
        city: "Kano",
      },
    ],
    instagramEyebrow: "Instagram",
    instagramHandle: "@lk_clothiers",
    instagramCta: "Follow us",
    visitEyebrow: "Visit Our Atelier",
    visitTitle: "Showroom in Abuja.",
    addressLabel: "Address",
    hoursLabel: "Hours",
    contactLabel: "Contact",
    directionsCta: "Get directions",
    mapTitle: "LK Atelier",
    mapLocation: "Block C, Suite 13 & 14, H & A Plaza, Wuye, Abuja",
  },
  shop: {
    eyebrow: "Shop LK Clothiers",
    title: "Collections made to be lived in.",
    copy: "Explore refined modest pieces by collection, occasion, and family fit. Every path to checkout keeps WhatsApp close for quick confirmation.",
    browseEyebrow: "Browse by Collection",
    browseTitle: "Choose the edit that fits the moment.",
    viewAll: "View all",
    collectionsLabel: "Collections",
    allPieces: "All pieces",
    searchLabel: "Search",
    searchPlaceholder: "Search pieces or collection",
    sortLabel: "Sort",
    maxPriceLabel: "Max Price",
    resultsHelper: "Showing live products up to",
  },
  about: {
    eyebrow: "Our Story",
    headlinePrefix: "Ready to wear,",
    headlineAccent: "bespoke",
    headlineSuffix: ".",
    copy: "LK Clothiers is a fantastic READY TO WEAR & BESPOKE brand that caters to both kids and women with a focus on quality, modesty, simplicity, and customer satisfaction.\n\nWe offer ready-to-wear for customer convenience, making ready-to-wear clothes readily available in store for customers who need clothing without the wait time associated with bespoke pieces.\n\nReady-to-wear collections also offer variety: a wide range of styles, sizes, colours, and designs to choose from, giving customers more options to suit their personal tastes and preferences. Our ready-to-wear pieces include casual, office-friendly, and special-event clothing, as well as kids' pieces for girls and boys.",
    pillars: [
      {
        title: "Our Mission",
        description:
          "To provide unique and beautiful clothes by using quality fabrics and producing well-finished pieces. To keep building trust and confidence with customers by providing a 100% money-back guarantee.",
      },
      {
        title: "Vision",
        description:
          "To become the most loved modest fashion atelier on the continent, one quietly confident piece at a time.",
      },
      {
        title: "Philosophy",
        description:
          "Quality over quantity. Considered fabrics. Hand-finished detail. Designs that outlive trends.",
      },
    ],
    whyEyebrow: "Why LK Exists",
    whyTitle: "For the woman who refuses to choose between modesty and modernity.",
    whyCopy:
      "We exist for the woman who walks into a room and is remembered for her quiet confidence - not for what she wore, but for how she wore it.",
    cta: "Explore the Collection",
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "Visit - Write - Chat.",
    formTitle: "Send us a message",
    successTitle: "Thank you.",
    successCopy: "We will reply within one business day.",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    messageLabel: "Message",
    button: "Send Message",
    atelierTitle: "Our Atelier",
    hoursLabel: "Business Hours",
    contactLabel: "Contact",
    followLabel: "Follow",
    instagramLabel: "Instagram",
    tiktokLabel: "TikTok",
    whatsappLabel: "WhatsApp",
  },
  faq: {
    eyebrow: "Frequently Asked",
    title: "Need to know.",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Within Abuja: 24-48 hours. Nationwide: 2-5 business days via our courier partners.",
      },
      {
        question: "What is your returns policy?",
        answer:
          "We offer exchange/refund based on terms and conditions. Clothes must not be worn, scented, or otherwise altered, and must be neatly packaged as received.",
      },
      {
        question: "How do I know my size?",
        answer:
          "Each product page includes a size guide with garment measurements. For bespoke fitting, book an atelier appointment in Wuye.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "Paystack (cards, bank transfer, USSD), Flutterwave, and direct bank transfer to our LK Clothiers account.",
      },
      {
        question: "Can I track my order?",
        answer: "Yes. Once dispatched, you'll receive a tracking link by SMS and email.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We ship across West Africa and to select international destinations. Reach out on WhatsApp for a quote.",
      },
      {
        question: "Can I alter a piece?",
        answer:
          "Yes - our atelier offers complimentary minor alterations on full-price ready-to-wear within 14 days of purchase.",
      },
    ],
    privacyTitle: "Privacy Policy",
    privacyCopy:
      "We collect only the information needed to fulfil your orders. We never sell your data and use industry-standard encryption to keep your details safe.",
    termsTitle: "Exchange/Refund",
    termsCopy:
      "We offer exchange/refund based on terms and conditions.\n\n1. Clothes didn't fit (size mixed up from us).\n2. Clothes must be returned within 24hrs within Abuja and 48-72hrs outside Abuja.\n3. Clothes must not be worn.\n4. Clothes must not be scented or otherwise altered.\n5. Clothes must be neatly packaged as received.",
  },
};

export const seedProducts: AdminProduct[] = products.map((product, index) => ({
  ...product,
  useVariants: false,
  variants: [],
  stock: 18 + ((index * 7) % 23),
  status:
    product.category === "adire" ||
    product.category === "boubou" ||
    product.category === "linen" ||
    product.category === "shirt-dress" ||
    product.category === "silk" ||
    index % 9 !== 0
      ? "Live"
      : "Draft",
}));

export const adminCategories = categories;
const replacedSeedProductIds = new Set([
  "zara-mini",
  "lila-dress",
  "ivory-shirt",
  "orange-set",
  "coffee-set",
  "kai-twopc",
  "omar-kaftan",
  "silk-flare-video",
  "noir-boubou",
  "gold-kaftan",
  "ivory-gown",
]);
const localStockKey = "lk_stock_overrides_v1";
const deletedProductsKey = "lk_deleted_products_v1";
const storefrontProductsCacheKey = "lk_storefront_products_v1";

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const deletedProductIds = await listDeletedProductIds();
  const loadedCategories = await listAdminCategories();
  const validCategoryKeys = new Set(loadedCategories.map((category) => category.key));

  if (!isSupabaseConfigured || !supabase) {
    return applyLocalStockOverrides(
      seedProducts.filter((product) => !deletedProductIds.has(product.id)),
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const productIds = (data ?? []).map((row) => String(row.id));
  const variantsByProductId = await listVariantsByProductId(productIds);
  const loadedProducts = (data ?? [])
    .filter((row) => validCategoryKeys.has(row.category))
    .map((row) => productFromRow(row, variantsByProductId.get(row.id) ?? []))
    .filter(
      (product) => !replacedSeedProductIds.has(product.id) && !deletedProductIds.has(product.id),
    );
  cacheStorefrontProducts(loadedProducts);
  return loadedProducts;
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const cachedProduct = readCachedStorefrontProduct(id);
  if (cachedProduct) return cachedProduct;

  if (!isSupabaseConfigured || !supabase) {
    return seedProducts.find((product) => product.id === id) ?? null;
  }

  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw adminDataError("Product load failed", error);
  if (!data) return null;

  const variantsByProductId = await listVariantsByProductId([id]);
  return productFromRow(data, variantsByProductId.get(id) ?? []);
}

export function readCachedStorefrontProducts(): AdminProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storefrontProductsCacheKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAdminProductLike) as AdminProduct[];
  } catch {
    return [];
  }
}

function readCachedStorefrontProduct(id: string) {
  return readCachedStorefrontProducts().find((product) => product.id === id) ?? null;
}

function cacheStorefrontProducts(productList: AdminProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storefrontProductsCacheKey, JSON.stringify(productList));
}

export async function upsertAdminProduct(product: AdminProduct): Promise<AdminProduct> {
  const client = requireSupabase();

  const { data, error } = await client
    .from("products")
    .upsert(productToRow(product), { onConflict: "id" })
    .select()
    .single();

  if (error) throw adminDataError("Product save failed", error);
  try {
    await replaceProductVariants(product.id, product.variants ?? []);
  } catch (error) {
    throw adminDataError("Product variants save failed", error);
  }
  forgetDeletedProductId(product.id);

  const { error: deletedProductError } = await client
    .from("deleted_products")
    .delete()
    .eq("id", product.id);

  if (deletedProductError) {
    console.info(
      "Product was saved. Deleted-product marker was cleared locally only:",
      deletedProductError.message,
    );
  }

  return productFromRow(data, product.variants ?? []);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const client = requireSupabase();

  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw adminDataError("Product delete failed", error);

  rememberDeletedProductId(id);

  const { error: deletedProductError } = await client
    .from("deleted_products")
    .upsert({ id }, { onConflict: "id" });

  if (deletedProductError) {
    console.info(
      "Product was deleted from products. Deleted-product marker was saved locally only:",
      deletedProductError.message,
    );
  }
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  if (!isSupabaseConfigured || !supabase) return adminCategories;

  const { data, error } = await supabase
    .from("categories")
    .select("key,name,image_url,tagline,parent_key,sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    console.info("Categories could not be loaded from Supabase:", error.message);
    return adminCategories;
  }

  const remoteCategories = (data ?? []).map(categoryFromRow);
  return remoteCategories;
}

export async function upsertAdminCategory(category: AdminCategory): Promise<AdminCategory> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("categories")
    .upsert(categoryToRow(category), { onConflict: "key" })
    .select("key,name,image_url,tagline,parent_key,sort_order")
    .single();

  if (error) throw adminDataError("Category save failed", error);
  return categoryFromRow(data);
}

export async function deleteAdminCategory(key: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("categories").delete().eq("key", key);
  if (error) throw adminDataError("Category delete failed", error);
}

export async function decrementProductStock(
  items: Pick<CartItem, "id" | "qty" | "variantId">[],
): Promise<void> {
  const quantities = items.reduce<Record<string, number>>((total, item) => {
    const key = item.variantId ? `${item.id}::${item.variantId}` : item.id;
    total[key] = (total[key] ?? 0) + item.qty;
    return total;
  }, {});

  if (!isSupabaseConfigured || !supabase) {
    decrementLocalStock(quantities);
    return;
  }

  const currentProducts = await listAdminProducts();
  await Promise.all(
    Object.entries(quantities).map(async ([key, purchasedQty]) => {
      const [id, variantId] = key.split("::");
      const product = currentProducts.find((item) => item.id === id);
      if (!product) return;
      if (variantId) {
        await upsertAdminProduct({
          ...product,
          variants: (product.variants ?? []).map((variant) =>
            variant.id === variantId
              ? { ...variant, stock: Math.max(0, variant.stock - purchasedQty) }
              : variant,
          ),
        });
        return;
      }
      await upsertAdminProduct({
        ...product,
        stock: Math.max(0, product.stock - purchasedQty),
      });
    }),
  );
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const client = requireSupabase();

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeProductId = productId || "product";
  const filePath = `${safeProductId}/${Date.now()}.${extension}`;

  const { error } = await client.storage.from("product-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw adminDataError("Image upload failed", error);

  return client.storage.from("product-images").getPublicUrl(filePath).data.publicUrl;
}

export async function getSiteContent(): Promise<ContentState> {
  if (!isSupabaseConfigured || !supabase) return defaultContent;

  const { data, error } = await supabase
    .from("site_content")
    .select("key,value")
    .eq("key", "homepage")
    .maybeSingle<SiteContentRow>();

  if (error) throw error;
  return normalizeSiteContent(data?.value);
}

export async function saveSiteContent(content: ContentState): Promise<ContentState> {
  const client = requireSupabase();

  const normalizedContent = normalizeSiteContent(content);
  const { data, error } = await client
    .from("site_content")
    .upsert({ key: "homepage", value: normalizedContent }, { onConflict: "key" })
    .select("key,value")
    .single<SiteContentRow>();

  if (error) throw error;
  return normalizeSiteContent(data.value);
}

function adminDataError(context: string, error: unknown) {
  if (error instanceof Error) return new Error(`${context}: ${error.message}`);
  if (isPlainObject(error)) {
    const parts = [
      typeof error.message === "string" ? error.message : "",
      typeof error.details === "string" ? error.details : "",
      typeof error.hint === "string" ? error.hint : "",
      typeof error.code === "string" ? `Code: ${error.code}` : "",
    ].filter(Boolean);
    return new Error(`${context}: ${parts.join(" ") || JSON.stringify(error)}`);
  }
  return new Error(`${context}: ${String(error)}`);
}

export function normalizeSiteContent(value: unknown): ContentState {
  return deepMerge(defaultContent, isPlainObject(value) ? value : {}) as ContentState;
}

function productFromRow(row: ProductRow, variants: ProductVariant[] = []): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    useVariants: Boolean(row.use_variants && variants.length > 0),
    variants,
    category: row.category,
    image: row.image_url,
    gallery: row.gallery_urls ?? undefined,
    colorImages: normalizeColorImages(row.color_images, row.colors),
    sizes: row.sizes,
    colors: row.colors,
    description: row.description,
    tag: row.tag ?? undefined,
    bestSeller: row.best_seller,
    stock: row.stock,
    status: row.status,
  };
}

function categoryFromRow(row: CategoryRow): AdminCategory {
  return {
    key: row.key,
    name: row.name,
    image: row.image_url,
    tagline: row.tagline,
    parentKey: row.parent_key ?? null,
    sortOrder: row.sort_order ?? undefined,
  };
}

function mergeWithSeedProducts(
  remoteProducts: AdminProduct[],
  deletedProductIds = new Set<string>(),
): AdminProduct[] {
  const remoteIds = new Set(remoteProducts.map((product) => product.id));
  return [
    ...remoteProducts,
    ...seedProducts.filter(
      (product) =>
        product.status === "Live" &&
        !remoteIds.has(product.id) &&
        !deletedProductIds.has(product.id),
    ),
  ];
}

function applyLocalStockOverrides(productList: AdminProduct[]): AdminProduct[] {
  const overrides = readLocalStockOverrides();
  if (!overrides) return productList;

  return productList.map((product) => ({
    ...product,
    stock: typeof overrides[product.id] === "number" ? overrides[product.id] : product.stock,
  }));
}

function decrementLocalStock(quantities: Record<string, number>) {
  if (typeof window === "undefined") return;

  const currentProducts = applyLocalStockOverrides(seedProducts);
  const overrides = readLocalStockOverrides() ?? {};

  Object.entries(quantities).forEach(([key, purchasedQty]) => {
    const [id] = key.split("::");
    const product = currentProducts.find((item) => item.id === id);
    if (!product) return;
    overrides[id] = Math.max(0, product.stock - purchasedQty);
  });

  window.localStorage.setItem(localStockKey, JSON.stringify(overrides));
}

function readLocalStockOverrides(): Record<string, number> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(localStockKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) return null;

    return Object.entries(parsed).reduce<Record<string, number>>((acc, [key, value]) => {
      if (typeof value === "number") acc[key] = value;
      return acc;
    }, {});
  } catch {
    return null;
  }
}

async function listDeletedProductIds(): Promise<Set<string>> {
  const deletedIds = readLocalDeletedProductIds();

  if (!isSupabaseConfigured || !supabase) return deletedIds;

  const { data, error } = await supabase.from("deleted_products").select("id");
  if (error) {
    console.info("Deleted products could not be loaded from Supabase:", error.message);
    return deletedIds;
  }

  (data ?? []).forEach((row: DeletedProductRow) => deletedIds.add(row.id));
  return deletedIds;
}

function rememberDeletedProductId(id: string) {
  if (typeof window === "undefined") return;
  const deletedIds = readLocalDeletedProductIds();
  deletedIds.add(id);
  window.localStorage.setItem(deletedProductsKey, JSON.stringify([...deletedIds]));
}

function forgetDeletedProductId(id: string) {
  if (typeof window === "undefined") return;
  const deletedIds = readLocalDeletedProductIds();
  deletedIds.delete(id);
  window.localStorage.setItem(deletedProductsKey, JSON.stringify([...deletedIds]));
}

function readLocalDeletedProductIds(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const parsed = JSON.parse(window.localStorage.getItem(deletedProductsKey) ?? "[]");
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((value): value is string => typeof value === "string"));
  } catch {
    return new Set();
  }
}

function productToRow(product: AdminProduct): ProductRow {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    use_variants: Boolean(product.useVariants),
    category: product.category,
    image_url: product.image,
    gallery_urls: product.gallery ?? null,
    color_images: product.colorImages ?? null,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    tag: product.tag ?? null,
    best_seller: Boolean(product.bestSeller),
    stock: product.stock,
    status: product.status,
  };
}

function categoryToRow(category: AdminCategory): CategoryRow {
  return {
    key: category.key,
    name: category.name,
    image_url: category.image,
    tagline: category.tagline,
    parent_key: category.parentKey ?? null,
    sort_order: category.sortOrder ?? null,
  };
}

function normalizeColorImages(value: unknown, colors: string[] = []) {
  if (!isPlainObject(value)) return undefined;
  const validColors = new Set(colors.map((color) => color.trim()).filter(Boolean));
  const entries = Object.entries(value).filter(
    ([color, image]) =>
      validColors.has(color.trim()) && typeof image === "string" && image.trim().length > 0,
  );
  return entries.length > 0
    ? Object.fromEntries(entries.map(([color, image]) => [color.trim(), String(image).trim()]))
    : undefined;
}

function normalizeVariantOptions(value: unknown) {
  if (!isPlainObject(value)) return undefined;
  const entries = Object.entries(value)
    .map(([key, optionValue]) => [key.trim(), String(optionValue ?? "").trim()] as const)
    .filter(([key, optionValue]) => key.length > 0 && optionValue.length > 0);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function isAdminProductLike(value: unknown): value is AdminProduct {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.category === "string" &&
    typeof value.image === "string" &&
    Array.isArray(value.sizes) &&
    Array.isArray(value.colors) &&
    typeof value.description === "string" &&
    typeof value.stock === "number" &&
    typeof value.status === "string"
  );
}

async function listVariantsByProductId(productIds: string[]) {
  const variantsByProductId = new Map<string, ProductVariant[]>();
  if (!isSupabaseConfigured || !supabase || productIds.length === 0) return variantsByProductId;

  const { data, error } = await supabase
    .from("product_variants")
    .select("id,product_id,variant_type,variant_value,options,price,stock,sku,position")
    .in("product_id", productIds)
    .order("position", { ascending: true });

  if (error) {
    console.info("Product variants could not be loaded from Supabase:", error.message);
    return variantsByProductId;
  }

  (data ?? []).forEach((row: ProductVariantRow) => {
    const variant = variantFromRow(row);
    const current = variantsByProductId.get(variant.productId) ?? [];
    variantsByProductId.set(variant.productId, [...current, variant]);
  });

  return variantsByProductId;
}

async function replaceProductVariants(productId: string, variants: ProductVariant[]) {
  const client = requireSupabase();
  const { error: deleteError } = await client
    .from("product_variants")
    .delete()
    .eq("product_id", productId);

  if (deleteError) throw deleteError;
  if (variants.length === 0) return;

  const { error } = await client
    .from("product_variants")
    .insert(
      variants.map((variant, index) => variantToRow({ ...variant, productId, position: index })),
    );
  if (error) throw error;
}

function variantFromRow(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    variantType: row.variant_type,
    variantValue: row.variant_value,
    options: normalizeVariantOptions(row.options),
    price: row.price,
    stock: row.stock,
    sku: row.sku ?? undefined,
    position: row.position ?? 0,
  };
}

function variantToRow(variant: ProductVariant): ProductVariantRow {
  return {
    id: variant.id,
    product_id: variant.productId,
    variant_type: variant.variantType,
    variant_value: variant.variantValue,
    options: normalizeVariantOptions(variant.options) ?? {},
    price: variant.price,
    stock: variant.stock,
    sku: variant.sku ?? null,
    position: variant.position,
  };
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(supabaseConfigError);
  }
  return supabase;
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (!isPlainObject(base)) return override ?? base;

  const output: Record<string, unknown> = { ...base };
  if (!isPlainObject(override)) return output;

  for (const [key, value] of Object.entries(override)) {
    output[key] = key in output ? deepMerge(output[key], value) : value;
  }
  return output;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
