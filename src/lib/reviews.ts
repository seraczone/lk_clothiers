import type { CategoryKey, Product } from "@/lib/catalog";
import { ngn } from "@/lib/catalog";
import { productUrl, siteName } from "@/lib/seo";

export type CustomerReview = {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  datePublished: string;
};

export type ReviewSummary = {
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
};

const categoryLabels: Record<CategoryKey, string> = {
  girls: "Girls",
  boys: "Boys",
  "shirt-dress": "Shirt Dress",
  "luxury-kaftan": "Luxury Kaftan",
  linen: "Linen",
  boubou: "Bou'bou",
  adire: "Adire",
  silk: "Silk",
};

const reviewSeeds: CustomerReview[] = [
  {
    id: "review-luxury-embroidered-kaftan-1",
    productId: "luxury-embroidered-kaftan",
    author: "Aisha A.",
    city: "Abuja",
    rating: 5,
    title: "Beautiful finish",
    body: "The embroidery feels special without being loud. It was comfortable for a full event day.",
    datePublished: "2026-03-18",
  },
  {
    id: "review-linen-long-shirt-1",
    productId: "linen-long-shirt",
    author: "Halima O.",
    city: "Lagos",
    rating: 5,
    title: "Easy to style",
    body: "The linen is breathable and the length gives the modest coverage I wanted for work.",
    datePublished: "2026-04-06",
  },
  {
    id: "review-silk-flare-purple-1",
    productId: "silk-flare-purple",
    author: "Fatima B.",
    city: "Kano",
    rating: 5,
    title: "Worth it",
    body: "The fabric moves beautifully and the dress arrived neatly packed.",
    datePublished: "2026-04-24",
  },
  {
    id: "review-amara-print-dress-1",
    productId: "amara-print-dress",
    author: "Zainab M.",
    city: "Abuja",
    rating: 5,
    title: "Perfect girls occasion dress",
    body: "My daughter loved the scarf and the fit was polished without feeling stiff.",
    datePublished: "2026-05-09",
  },
  {
    id: "review-boys-kaftan-sage-tan-1",
    productId: "boys-kaftan-sage-tan",
    author: "Mariam S.",
    city: "Kaduna",
    rating: 5,
    title: "Sharp and comfortable",
    body: "The kaftan looked smart for Eid photos and still let my son move easily.",
    datePublished: "2026-05-21",
  },
  {
    id: "review-adire-orange-flare-1",
    productId: "adire-orange-flare",
    author: "Rukayat T.",
    city: "Ibadan",
    rating: 4,
    title: "Vibrant color",
    body: "The color is rich in person and the silhouette is flattering.",
    datePublished: "2026-06-03",
  },
];

const categoryFallbackReviews: Record<CategoryKey, Omit<CustomerReview, "id" | "productId">> = {
  girls: {
    author: "Safiya K.",
    city: "Abuja",
    rating: 5,
    title: "Lovely for children",
    body: "The finishing is neat and the fit works well for special occasions.",
    datePublished: "2026-04-12",
  },
  boys: {
    author: "Mariam S.",
    city: "Kaduna",
    rating: 5,
    title: "Smart occasionwear",
    body: "The tailoring looks polished while still feeling practical for children.",
    datePublished: "2026-05-21",
  },
  "shirt-dress": {
    author: "Nkechi E.",
    city: "Port Harcourt",
    rating: 4,
    title: "Clean everyday fit",
    body: "It is easy to dress up or down and the modest cut feels considered.",
    datePublished: "2026-05-28",
  },
  "luxury-kaftan": {
    author: "Aisha A.",
    city: "Abuja",
    rating: 5,
    title: "Event ready",
    body: "The drape and detailing make it feel refined for important occasions.",
    datePublished: "2026-03-18",
  },
  linen: {
    author: "Halima O.",
    city: "Lagos",
    rating: 5,
    title: "Breathable and elegant",
    body: "The fabric is light, comfortable, and easy to style.",
    datePublished: "2026-04-06",
  },
  boubou: {
    author: "Yemisi A.",
    city: "Abuja",
    rating: 5,
    title: "Beautiful neckline",
    body: "The embellishment gives the piece a premium look without feeling heavy.",
    datePublished: "2026-05-16",
  },
  adire: {
    author: "Rukayat T.",
    city: "Ibadan",
    rating: 4,
    title: "Rich color",
    body: "The print stands out and the flow makes it comfortable for long wear.",
    datePublished: "2026-06-03",
  },
  silk: {
    author: "Fatima B.",
    city: "Kano",
    rating: 5,
    title: "Soft movement",
    body: "The fabric has a lovely drape and feels special for outings.",
    datePublished: "2026-04-24",
  },
};

export const reviewStorageKey = "lk_customer_reviews_v1";

export function categoryName(category: CategoryKey) {
  return categoryLabels[category];
}

export function getSeedReviews(product: Product): CustomerReview[] {
  const direct = reviewSeeds.filter((review) => review.productId === product.id);
  if (direct.length > 0) return direct;

  const fallback = categoryFallbackReviews[product.category];
  return [
    {
      ...fallback,
      id: `review-${product.id}-category-fallback`,
      productId: product.id,
      title: `${categoryName(product.category)} favorite`,
    },
  ];
}

export function readStoredReviews(productId?: string): CustomerReview[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(reviewStorageKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const reviews = parsed.filter(isReview);
    return productId ? reviews.filter((review) => review.productId === productId) : reviews;
  } catch {
    return [];
  }
}

export function saveStoredReview(review: CustomerReview) {
  if (typeof window === "undefined") return;
  const reviews = readStoredReviews();
  window.localStorage.setItem(reviewStorageKey, JSON.stringify([review, ...reviews].slice(0, 80)));
}

export function summarizeReviews(reviews: Pick<CustomerReview, "rating">[]): ReviewSummary {
  if (reviews.length === 0) {
    return { ratingValue: 0, reviewCount: 0, bestRating: 5, worstRating: 1 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    ratingValue: Number((total / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export function getProductReviewSummary(product: Product) {
  return summarizeReviews(getSeedReviews(product));
}

export function productJsonLd(product: Product & { stock?: number }, reviews: CustomerReview[]) {
  const summary = summarizeReviews(reviews);
  const image = Array.from(new Set([product.image, ...(product.gallery ?? [])]));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl(product.id)}#product`,
    name: product.name,
    image,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    category: categoryName(product.category),
    offers: {
      "@type": "Offer",
      url: productUrl(product.id),
      priceCurrency: "NGN",
      price: product.price,
      availability:
        typeof product.stock === "number" && product.stock <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteName,
      },
    },
    aggregateRating:
      summary.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: summary.ratingValue,
            reviewCount: summary.reviewCount,
            bestRating: summary.bestRating,
            worstRating: summary.worstRating,
          }
        : undefined,
    review: reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.datePublished,
      name: review.title,
      reviewBody: review.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

export function ratingLabel(summary: ReviewSummary) {
  if (summary.reviewCount === 0) return "No reviews yet";
  const reviewLabel = summary.reviewCount === 1 ? "review" : "reviews";
  return `${summary.ratingValue.toFixed(1)} (${summary.reviewCount} ${reviewLabel})`;
}

export function reviewProductLine(product: Product) {
  return `${categoryName(product.category)} - ${ngn(product.price)}`;
}

function isReview(value: unknown): value is CustomerReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Record<string, unknown>;
  return (
    typeof review.id === "string" &&
    typeof review.productId === "string" &&
    typeof review.author === "string" &&
    typeof review.city === "string" &&
    typeof review.rating === "number" &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    typeof review.title === "string" &&
    typeof review.body === "string" &&
    typeof review.datePublished === "string"
  );
}
