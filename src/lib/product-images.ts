import amaraPrintDressPrimary from "@/assets/amara-print-dress-primary.png";
import boysBlueKaftanHero from "@/assets/boys-blue-kaftan-hero.jpeg";
import girlDresses from "@/assets/girl-dresses.png";
import type { SyntheticEvent } from "react";
import type { Product } from "@/lib/catalog";

const categoryFallbacks: Record<string, string> = {
  adire: amaraPrintDressPrimary,
  boubou: amaraPrintDressPrimary,
  boys: boysBlueKaftanHero,
  girls: girlDresses,
  linen: amaraPrintDressPrimary,
  "luxury-kaftan": amaraPrintDressPrimary,
  shirt: amaraPrintDressPrimary,
  "shirt-dress": amaraPrintDressPrimary,
  silk: amaraPrintDressPrimary,
};

const productFallbacks: Record<string, string> = {
  "amara-print-dress": amaraPrintDressPrimary,
  "boys-kaftan-sage-tan": boysBlueKaftanHero,
  "boys-kaftan-white": boysBlueKaftanHero,
  "girl-dresses": girlDresses,
};

export function fallbackImageForProduct(product?: Pick<Product, "id" | "category"> | null) {
  if (!product) return amaraPrintDressPrimary;
  return productFallbacks[product.id] ?? categoryFallbacks[product.category] ?? amaraPrintDressPrimary;
}

export function handleImageFallback(
  event: SyntheticEvent<HTMLImageElement>,
  fallback: string,
) {
  const image = event.currentTarget;
  if (image.src === fallback) return;
  image.src = fallback;
}
