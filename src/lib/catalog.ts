import catWomen from "@/assets/cat-women.jpg";
import catGirls from "@/assets/cat-girls.jpg";
import catBoys from "@/assets/cat-boys.jpg";
import catGlam from "@/assets/cat-glam.jpg";
import catWork from "@/assets/cat-work.jpg";
import catKids from "@/assets/cat-kids.jpg";
import catShirts from "@/assets/cat-shirts.jpg";
import catTwoPc from "@/assets/cat-twopc.jpg";
import catBoubou from "@/assets/cat-boubou.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";

export type CategoryKey = "women" | "girls" | "boys" | "casual" | "workwear" | "glam";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryKey;
  image: string;
  gallery?: string[];
  sizes: string[];
  colors: string[];
  description: string;
  tag?: string;
  bestSeller?: boolean;
};

export const categories: { key: CategoryKey; name: string; image: string; tagline: string }[] = [
  { key: "women", name: "Women", image: catWomen, tagline: "Ready-to-wear" },
  { key: "girls", name: "Girls", image: catGirls, tagline: "Mini LK" },
  { key: "boys", name: "Boys", image: catBoys, tagline: "Little gentlemen" },
  { key: "casual", name: "Casual", image: catShirts, tagline: "Everyday ease" },
  { key: "workwear", name: "Workwear", image: catWork, tagline: "Quiet authority" },
  { key: "glam", name: "Glam", image: catGlam, tagline: "Evening statements" },
];

const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
const KIDS_SIZES = ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"];

export const products: Product[] = [
  // Women
  {
    id: "aanu-blouse",
    name: "Aanu Silk Blouse",
    price: 78000,
    category: "women",
    image: p1,
    gallery: [p1, catShirts],
    sizes: WOMEN_SIZES,
    colors: ["Ivory", "Coffee"],
    description:
      "An understated silk blouse with a softly draped neckline. Cut from Italian sandwashed silk and finished by hand in our Abuja atelier.",
    tag: "New",
    bestSeller: true,
  },
  {
    id: "layla-kaftan",
    name: "Layla Coffee Kaftan",
    price: 145000,
    category: "women",
    image: p2,
    gallery: [p2, catBoubou],
    sizes: WOMEN_SIZES,
    colors: ["Coffee", "Ivory"],
    description: "A liquid-soft kaftan in deep coffee crepe with hand-finished sleeves.",
    bestSeller: true,
  },
  {
    id: "sade-boubou",
    name: "Sade Ivory Boubou",
    price: 220000,
    category: "women",
    image: p4,
    gallery: [p4, catBoubou],
    sizes: WOMEN_SIZES,
    colors: ["Ivory"],
    description: "A statement ivory boubou crafted from raw silk with subtle tonal embroidery.",
    tag: "Signature",
  },
  {
    id: "amara-kaftan",
    name: "Amara Statement Kaftan",
    price: 185000,
    category: "women",
    image: catWomen,
    sizes: WOMEN_SIZES,
    colors: ["Ivory", "Sand"],
    description: "A clean-lined kaftan for the modern woman. Made to be worn day to evening.",
  },
  // Girls
  {
    id: "zara-mini",
    name: "Zara Mini Set",
    price: 48000,
    category: "girls",
    image: catGirls,
    sizes: KIDS_SIZES,
    colors: ["Ivory", "Peach"],
    description: "A coordinated two-piece for our littlest customers, in soft brushed cotton.",
    tag: "New",
  },
  {
    id: "lila-dress",
    name: "Lila Cream Dress",
    price: 55000,
    category: "girls",
    image: catKids,
    sizes: KIDS_SIZES,
    colors: ["Cream"],
    description: "A breezy modest dress with hand-finished hems.",
  },
  // Boys
  {
    id: "kai-twopc",
    name: "Kai Two-Piece",
    price: 52000,
    category: "boys",
    image: catBoys,
    sizes: KIDS_SIZES,
    colors: ["Coffee", "Ivory"],
    description: "A tailored two-piece set for boys, cut from breathable cotton.",
  },
  {
    id: "omar-kaftan",
    name: "Omar Mini Kaftan",
    price: 48000,
    category: "boys",
    image: catKids,
    sizes: KIDS_SIZES,
    colors: ["Ivory"],
    description: "A miniature take on our signature kaftan.",
  },
  // Casual
  {
    id: "ivory-shirt",
    name: "Ivory Atelier Shirt",
    price: 62000,
    category: "casual",
    image: catShirts,
    gallery: [catShirts, p1],
    sizes: WOMEN_SIZES,
    colors: ["Ivory", "Sand"],
    description: "A relaxed everyday shirt with a slightly oversized fit.",
    bestSeller: true,
  },
  {
    id: "orange-set",
    name: "Burnt Orange Two-Piece",
    price: 98000,
    category: "casual",
    image: p3,
    sizes: WOMEN_SIZES,
    colors: ["Burnt Orange"],
    description: "A confident two-piece in our signature burnt orange.",
  },
  {
    id: "coffee-set",
    name: "Coffee Co-ord Set",
    price: 105000,
    category: "casual",
    image: catTwoPc,
    sizes: WOMEN_SIZES,
    colors: ["Coffee"],
    description: "A relaxed co-ord set with wide trousers and a tunic top.",
  },
  // Workwear
  {
    id: "camel-suit",
    name: "Camel Tailored Suit",
    price: 185000,
    category: "workwear",
    image: catWork,
    sizes: WOMEN_SIZES,
    colors: ["Camel"],
    description: "A precise tailored suit for the modern professional.",
  },
  {
    id: "ivory-tunic",
    name: "Ivory Office Tunic",
    price: 72000,
    category: "workwear",
    image: p1,
    sizes: WOMEN_SIZES,
    colors: ["Ivory"],
    description: "A clean ivory tunic for the boardroom.",
  },
  {
    id: "coffee-blazer",
    name: "Coffee Blazer Set",
    price: 155000,
    category: "workwear",
    image: p3,
    sizes: WOMEN_SIZES,
    colors: ["Coffee"],
    description: "A relaxed blazer set in coffee crepe.",
    bestSeller: true,
  },
  // Glam
  {
    id: "noir-boubou",
    name: "Noir Glam Boubou",
    price: 265000,
    category: "glam",
    image: catBoubou,
    sizes: WOMEN_SIZES,
    colors: ["Noir", "Coffee"],
    description: "An evening boubou with tonal embroidery and silk lining.",
  },
  {
    id: "gold-kaftan",
    name: "Gold Soiree Kaftan",
    price: 285000,
    category: "glam",
    image: catGlam,
    sizes: WOMEN_SIZES,
    colors: ["Champagne"],
    description: "Our most opulent kaftan, finished with hand-applied detailing.",
    tag: "Signature",
  },
  {
    id: "ivory-gown",
    name: "Ivory Statement Gown",
    price: 240000,
    category: "glam",
    image: p4,
    sizes: WOMEN_SIZES,
    colors: ["Ivory"],
    description: "A floor-sweeping ivory gown for occasion dressing.",
  },
];

export const ngn = (n: number) => "NGN " + n.toLocaleString("en-NG");

export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (key: CategoryKey) => products.filter((p) => p.category === key);
export const newArrivals = () =>
  products.filter((p) => p.tag === "New" || p.tag === "Signature").slice(0, 4);
export const bestSellers = () => products.filter((p) => p.bestSeller).slice(0, 3);
