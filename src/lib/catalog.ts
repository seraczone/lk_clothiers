import catGlam from "@/assets/cat-glam.jpg";
import catBoubou from "@/assets/cat-boubou.jpg";
import girlsPurpleDress from "@/assets/girls-purple-dress.jpeg";
import boubouEmbellishedColors from "@/assets/boubou-embellished-colors.jpeg";
import shirtDressBlueHanger from "@/assets/shirt-dress-blue-hanger.jpeg";
import shirtDressBlueModel from "@/assets/shirt-dress-blue-model.jpeg";
import shirtDressBlueFrontBack from "@/assets/shirt-dress-blue-front-back.jpeg";
import shirtDressPinkSet from "@/assets/shirt-dress-pink-set.jpeg";
import boysKaftanSageTan from "@/assets/boys-kaftan-sage-tan.jpeg";
import boysKaftanWhite from "@/assets/boys-kaftan-white.jpeg";
import adireOrange from "@/assets/adire-orange.jpeg";
import adireBlueBurgundy from "@/assets/adire-blue-burgundy.jpeg";
import silkFlarePurple from "@/assets/silk-flare-purple.jpeg";
import silkFlareTrio from "@/assets/silk-flare-trio.jpeg";
import silkFlarePanel from "@/assets/silk-flare-panel.jpeg";
import silkFlareQuartet from "@/assets/silk-flare-quartet.jpeg";
import silkFlareRack from "@/assets/silk-flare-rack.jpeg";
import silkFlareBrown from "@/assets/silk-flare-brown.jpeg";
import silkFlareHangers from "@/assets/silk-flare-hangers.jpeg";
import luxuryKaftanModels from "@/assets/luxury-kaftan-models.jpeg";
import luxuryKaftanMannequin from "@/assets/luxury-kaftan-mannequin.jpeg";
import luxuryKaftanDetail from "@/assets/luxury-kaftan-detail.jpeg";
import luxuryKaftanHangers from "@/assets/luxury-kaftan-hangers.jpeg";
import linenPantsMint from "@/assets/linen-pants-mint.jpeg";
import linenLongShirtMint from "@/assets/linen-long-shirt-mint.jpeg";
import linenSetMint from "@/assets/linen-set-mint.jpeg";
import linenLongShirtYellow from "@/assets/linen-long-shirt-yellow.jpeg";
import p4 from "@/assets/p4.jpg";

export type CategoryKey =
  | "girls"
  | "boys"
  | "shirt-dress"
  | "luxury-kaftan"
  | "linen"
  | "glam"
  | "boubou"
  | "adire"
  | "silk";

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
  { key: "girls", name: "Girls", image: girlsPurpleDress, tagline: "Mini LK" },
  { key: "boys", name: "Boys", image: boysKaftanSageTan, tagline: "Little gentlemen" },
  {
    key: "shirt-dress",
    name: "Shirt Dress",
    image: shirtDressBlueHanger,
    tagline: "Buttoned ease",
  },
  {
    key: "luxury-kaftan",
    name: "Luxury Kaftan",
    image: luxuryKaftanModels,
    tagline: "Embellished modest elegance",
  },
  { key: "linen", name: "Linen", image: linenSetMint, tagline: "Easy linen separates" },
  { key: "glam", name: "Glam", image: catGlam, tagline: "Evening statements" },
  { key: "boubou", name: "Bou'bou", image: boubouEmbellishedColors, tagline: "Embellished ease" },
  { key: "adire", name: "Adire", image: adireOrange, tagline: "Artisan dyed pieces" },
  { key: "silk", name: "Silk", image: silkFlarePurple, tagline: "Silk flare dresses" },
];

const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
const KIDS_SIZES = ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"];

export const products: Product[] = [
  // Girls
  {
    id: "zara-mini",
    name: "Zara Mini Set",
    price: 48000,
    category: "girls",
    image: girlsPurpleDress,
    gallery: [girlsPurpleDress],
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
    image: girlsPurpleDress,
    gallery: [girlsPurpleDress],
    sizes: KIDS_SIZES,
    colors: ["Cream"],
    description: "A breezy modest dress with hand-finished hems.",
  },
  // Boys
  {
    id: "boys-kaftan-sage-tan",
    name: "Boys Kaftan",
    price: 55000,
    category: "boys",
    image: boysKaftanSageTan,
    gallery: [boysKaftanSageTan, boysKaftanWhite],
    sizes: KIDS_SIZES,
    colors: ["Sage", "Tan"],
    description:
      "A neatly finished boys kaftan with embroidered detailing and a polished modest fit.",
    tag: "New",
  },
  {
    id: "boys-kaftan-white",
    name: "Boys Kaftan",
    price: 55000,
    category: "boys",
    image: boysKaftanWhite,
    gallery: [boysKaftanWhite, boysKaftanSageTan],
    sizes: KIDS_SIZES,
    colors: ["White", "Sage"],
    description:
      "A neatly finished boys kaftan with embroidered detailing and a polished modest fit.",
  },
  // Shirt Dress
  {
    id: "blue-shirt-dress",
    name: "Shirt Dress",
    price: 60000,
    category: "shirt-dress",
    image: shirtDressBlueHanger,
    gallery: [shirtDressBlueHanger, shirtDressBlueModel, shirtDressBlueFrontBack],
    sizes: WOMEN_SIZES,
    colors: ["Blue"],
    description: "A relaxed long shirt dress with button-front styling and a clean modest fit.",
    tag: "New",
  },
  {
    id: "pink-shirt-dress-set",
    name: "Shirt Dress",
    price: 60000,
    category: "shirt-dress",
    image: shirtDressPinkSet,
    gallery: [shirtDressPinkSet],
    sizes: WOMEN_SIZES,
    colors: ["Pink", "Blue", "Grey", "Olive"],
    description: "A soft striped shirt dress set with floral detail and easy modest styling.",
  },
  // Luxury Kaftan
  {
    id: "luxury-embroidered-kaftan",
    name: "Luxury Embroidered Kaftan",
    price: 85000,
    category: "luxury-kaftan",
    image: luxuryKaftanModels,
    gallery: [luxuryKaftanModels, luxuryKaftanMannequin, luxuryKaftanDetail, luxuryKaftanHangers],
    sizes: WOMEN_SIZES,
    colors: ["Sage", "Charcoal", "Grey", "Black"],
    description:
      "A full-length embroidered kaftan with soft drape, statement sleeves and floral beadwork across the neckline and cuffs.",
    tag: "New",
    bestSeller: true,
  },
  // Linen
  {
    id: "linen-pants",
    name: "Linen Pants",
    price: 35000,
    category: "linen",
    image: linenPantsMint,
    gallery: [linenPantsMint, linenSetMint],
    sizes: WOMEN_SIZES,
    colors: ["Mint"],
    description:
      "Wide-leg linen pants with an easy elastic waist, soft drape and relaxed modest fit.",
    tag: "New",
  },
  {
    id: "linen-long-shirt",
    name: "Linen Long Shirt",
    price: 45000,
    category: "linen",
    image: linenLongShirtMint,
    gallery: [linenLongShirtMint, linenSetMint, linenLongShirtYellow],
    sizes: WOMEN_SIZES,
    colors: ["Mint", "Yellow", "Pink", "Beige", "Black", "Burgundy", "Purple"],
    description:
      "A flowing button-front linen long shirt with a soft collar, cuffed sleeves and versatile styling.",
    tag: "New",
    bestSeller: true,
  },
  // Glam
  {
    id: "noir-boubou",
    name: "Noir Glam Bou'bou",
    price: 265000,
    category: "glam",
    image: catBoubou,
    sizes: WOMEN_SIZES,
    colors: ["Noir", "Coffee"],
    description: "An evening bou'bou with tonal embroidery and silk lining.",
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
  // Bou'bou
  {
    id: "embellished-boubou-colors",
    name: "Embellished Bou'bou",
    price: 85000,
    category: "boubou",
    image: boubouEmbellishedColors,
    sizes: WOMEN_SIZES,
    colors: ["Purple", "Teal", "Royal Blue", "Emerald Green", "Rose Pink", "Champagne Gold"],
    description:
      "An embellished bou'bou available in rich jewel tones with detailed neckline work.",
    tag: "New",
  },
  // Adire
  {
    id: "adire-orange-flare",
    name: "Adire Flare",
    price: 55000,
    category: "adire",
    image: adireOrange,
    gallery: [adireOrange, adireBlueBurgundy],
    sizes: WOMEN_SIZES,
    colors: ["Orange"],
    description: "A vibrant adire flare dress with a full flowing skirt and matching scarf.",
    tag: "New",
  },
  {
    id: "adire-blue-burgundy-flare",
    name: "Adire Flare",
    price: 55000,
    category: "adire",
    image: adireBlueBurgundy,
    gallery: [adireBlueBurgundy, adireOrange],
    sizes: WOMEN_SIZES,
    colors: ["Blue", "Burgundy"],
    description: "A vibrant adire flare dress with a full flowing skirt and soft bell sleeves.",
  },
  // Silk
  {
    id: "silk-flare-purple",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlarePurple,
    gallery: [silkFlarePurple, silkFlareRack, silkFlareTrio, silkFlarePanel, silkFlareQuartet],
    sizes: WOMEN_SIZES,
    colors: ["Purple"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
    tag: "New",
    bestSeller: true,
  },
  {
    id: "silk-flare-trio",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlareTrio,
    gallery: [silkFlareTrio, silkFlarePurple, silkFlareRack, silkFlarePanel, silkFlareQuartet],
    sizes: WOMEN_SIZES,
    colors: ["Lilac", "Gold", "Mauve"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
    tag: "New",
  },
  {
    id: "silk-flare-panel",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlarePanel,
    gallery: [silkFlarePanel, silkFlarePurple, silkFlareTrio, silkFlareHangers, silkFlareQuartet],
    sizes: WOMEN_SIZES,
    colors: ["Plum", "Sage"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
  },
  {
    id: "silk-flare-quartet",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlareQuartet,
    gallery: [silkFlareQuartet, silkFlareRack, silkFlarePurple, silkFlareTrio, silkFlarePanel],
    sizes: WOMEN_SIZES,
    colors: ["Burgundy", "Plum"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
  },
  {
    id: "silk-flare-rack",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlareRack,
    gallery: [silkFlareRack, silkFlarePurple, silkFlareBrown, silkFlareHangers],
    sizes: WOMEN_SIZES,
    colors: ["Purple", "Green", "Orange", "Red"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
  },
  {
    id: "silk-flare-brown",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlareBrown,
    gallery: [silkFlareBrown, silkFlareRack, silkFlarePurple],
    sizes: WOMEN_SIZES,
    colors: ["Brown"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
  },
  {
    id: "silk-flare-hangers",
    name: "Silk Flare",
    price: 35000,
    category: "silk",
    image: silkFlareHangers,
    gallery: [silkFlareHangers, silkFlarePurple, silkFlareRack],
    sizes: WOMEN_SIZES,
    colors: ["Purple", "Pink", "Blue", "Yellow"],
    description: "A flowing silk flare dress with a soft drape and statement patterned finish.",
  },
];

export const ngn = (n: number) => "NGN " + n.toLocaleString("en-NG");

export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (key: CategoryKey) => products.filter((p) => p.category === key);
export const newArrivals = () =>
  products.filter((p) => p.tag === "New" || p.tag === "Signature").slice(0, 4);
export const bestSellers = () => products.filter((p) => p.bestSeller).slice(0, 3);
