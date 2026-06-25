import type { Product } from "@/lib/catalog";
import { ngn } from "@/lib/catalog";
import heroCollection from "@/assets/hero-collection.png";
import logo from "@/assets/lk-logo.png";

export const siteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://lkclothiers.com";

export const siteName = "LK Clothiers";
export const siteDescription =
  "Premium ready-to-wear modest fashion for women, girls, and boys. Crafted in Abuja and delivered across Nigeria.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productUrl(productId: string) {
  return absoluteUrl(`/product/${productId}`);
}

export function collectionUrl(category: string) {
  return absoluteUrl(`/shop/${category}`);
}

export function productMetaDescription(product: Product) {
  return `${product.description} Available from ${ngn(product.price)} at LK Clothiers in Abuja.`;
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: absoluteUrl(logo),
  image: absoluteUrl(heroCollection),
  description: siteDescription,
  telephone: "+2348171950268",
  email: "lkclothiers@gmail.com",
  priceRange: "NGN 30,000 - NGN 85,000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Block C, Suite 13 & 14, H & A Plaza, Wuye",
    addressLocality: "Abuja",
    addressRegion: "FCT",
    addressCountry: "NG",
  },
  sameAs: ["https://instagram.com/lk_clothiers"],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/shop?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
