import { categories, products, type CategoryKey, type Product } from "@/lib/catalog";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ProductStatus = "Live" | "Draft" | "Archived";
export type AdminProduct = Product & {
  stock: number;
  status: ProductStatus;
};

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
  category: CategoryKey;
  image_url: string;
  gallery_urls: string[] | null;
  sizes: string[];
  colors: string[];
  description: string;
  tag: string | null;
  best_seller: boolean;
  stock: number;
  status: ProductStatus;
};

type SiteContentRow = {
  key: string;
  value: Partial<ContentState>;
};

export const defaultContent: ContentState = {
  general: {
    address: "Wuye District,\nAbuja FCT, Nigeria",
    email: "hello@lkclothiers.com",
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
      { title: "Luxury Kaftan", caption: "Embroidered kaftan edit" },
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
    mapLocation: "Wuye, Abuja",
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
    headlinePrefix: "A quiet study in",
    headlineAccent: "modern modesty",
    headlineSuffix: ".",
    copy: "LK Clothiers was founded in Abuja in 2019 with a single belief - that modesty and elegance are not opposites, but partners. We design pieces that women and their families can wear for years, in fabrics that age beautifully and silhouettes that quietly turn heads.",
    pillars: [
      {
        title: "Mission",
        description:
          "To make premium modest fashion accessible to the modern African woman and her family - designed, cut and finished with intention.",
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
          "We accept returns within 7 days of delivery for unworn pieces with tags. Bespoke or altered pieces are final sale.",
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
    termsTitle: "Terms & Conditions",
    termsCopy:
      "By using lkclothiers.com you agree to our terms regarding orders, returns, intellectual property and acceptable use. Full terms available on request.",
  },
};

export const seedProducts: AdminProduct[] = products.map((product, index) => ({
  ...product,
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
const validCategoryKeys = new Set(categories.map((category) => category.key));
const replacedSeedProductIds = new Set([
  "ivory-shirt",
  "orange-set",
  "coffee-set",
  "kai-twopc",
  "omar-kaftan",
  "silk-flare-video",
]);

export async function listAdminProducts(): Promise<AdminProduct[]> {
  if (!isSupabaseConfigured || !supabase) return seedProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return mergeWithSeedProducts(
    (data ?? [])
      .filter((row) => validCategoryKeys.has(row.category))
      .map(productFromRow)
      .filter((product) => !replacedSeedProductIds.has(product.id)),
  );
}

export async function upsertAdminProduct(product: AdminProduct): Promise<AdminProduct> {
  if (!isSupabaseConfigured || !supabase) return product;

  const { data, error } = await supabase
    .from("products")
    .upsert(productToRow(product), { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return productFromRow(data);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured for image uploads.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeProductId = productId || "product";
  const filePath = `${safeProductId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("product-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  return supabase.storage.from("product-images").getPublicUrl(filePath).data.publicUrl;
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
  if (!isSupabaseConfigured || !supabase) return content;

  const normalizedContent = normalizeSiteContent(content);
  const { data, error } = await supabase
    .from("site_content")
    .upsert({ key: "homepage", value: normalizedContent }, { onConflict: "key" })
    .select("key,value")
    .single<SiteContentRow>();

  if (error) throw error;
  return normalizeSiteContent(data.value);
}

export function normalizeSiteContent(value: unknown): ContentState {
  return deepMerge(defaultContent, isPlainObject(value) ? value : {}) as ContentState;
}

function productFromRow(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    image: row.image_url,
    gallery: row.gallery_urls ?? undefined,
    sizes: row.sizes,
    colors: row.colors,
    description: row.description,
    tag: row.tag ?? undefined,
    bestSeller: row.best_seller,
    stock: row.stock,
    status: row.status,
  };
}

function mergeWithSeedProducts(remoteProducts: AdminProduct[]): AdminProduct[] {
  const remoteIds = new Set(remoteProducts.map((product) => product.id));
  return [
    ...remoteProducts,
    ...seedProducts.filter((product) => product.status === "Live" && !remoteIds.has(product.id)),
  ];
}

function productToRow(product: AdminProduct): ProductRow {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    image_url: product.image,
    gallery_urls: product.gallery ?? null,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    tag: product.tag ?? null,
    best_seller: Boolean(product.bestSeller),
    stock: product.stock,
    status: product.status,
  };
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
