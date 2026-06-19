import amaraPrintDressFront from "@/assets/amara-print-dress-front.png";
import amaraPrintDressPrimary from "@/assets/amara-print-dress-primary.png";
import amaraPrintDressSide from "@/assets/amara-print-dress-side.png";
import girlDressesAsset from "@/assets/girl-dresses.png";

const publicSupabaseUrl = "https://mtymltempomoqdbfhngw.supabase.co";
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "") ??
  publicSupabaseUrl;

const productImage = (filename: string) =>
  `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`;

export const catalogImages = {
  adireBlueBurgundy: productImage("adire-blue-burgundy.jpeg"),
  adireOrange: productImage("adire-orange.jpeg"),
  amaraPrintDressFront,
  amaraPrintDressPrimary,
  amaraPrintDressSide,
  boubouEmbellishedColors: productImage("boubou-embellished-colors.jpeg"),
  boysKaftanSageTan: productImage("boys-kaftan-sage-tan.jpeg"),
  boysKaftanWhite: productImage("boys-kaftan-white.jpeg"),
  catBoubou: productImage("cat-boubou.jpg"),
  girlDresses: girlDressesAsset,
  linenLongShirtMint: productImage("linen-long-shirt-mint.jpeg"),
  linenLongShirtYellow: productImage("linen-long-shirt-yellow.jpeg"),
  linenPantsMint: productImage("linen-pants-mint.jpeg"),
  linenSetMint: productImage("linen-set-mint.jpeg"),
  luxuryKaftanDetail: productImage("luxury-kaftan-detail.jpeg"),
  luxuryKaftanHangers: productImage("luxury-kaftan-hangers.jpeg"),
  luxuryKaftanMannequin: productImage("luxury-kaftan-mannequin.jpeg"),
  luxuryKaftanModels: productImage("luxury-kaftan-models.jpeg"),
  shirtDressBlueFrontBack: productImage("shirt-dress-blue-front-back.jpeg"),
  shirtDressBlueHanger: productImage("shirt-dress-blue-hanger.jpeg"),
  shirtDressBlueModel: productImage("shirt-dress-blue-model.jpeg"),
  shirtDressPinkSet: productImage("shirt-dress-pink-set.jpeg"),
  silkFlareBrown: productImage("silk-flare-brown.jpeg"),
  silkFlareHangers: productImage("silk-flare-hangers.jpeg"),
  silkFlarePanel: productImage("silk-flare-panel.jpeg"),
  silkFlarePurple: productImage("silk-flare-purple.jpeg"),
  silkFlareQuartet: productImage("silk-flare-quartet.jpeg"),
  silkFlareRack: productImage("silk-flare-rack.jpeg"),
  silkFlareTrio: productImage("silk-flare-trio.jpeg"),
};

const {
  adireBlueBurgundy,
  adireOrange,
  boubouEmbellishedColors,
  boysKaftanSageTan,
  boysKaftanWhite,
  catBoubou,
  girlDresses,
  linenLongShirtMint,
  linenLongShirtYellow,
  linenPantsMint,
  linenSetMint,
  luxuryKaftanDetail,
  luxuryKaftanHangers,
  luxuryKaftanMannequin,
  luxuryKaftanModels,
  shirtDressBlueFrontBack,
  shirtDressBlueHanger,
  shirtDressBlueModel,
  shirtDressPinkSet,
  silkFlareBrown,
  silkFlareHangers,
  silkFlarePanel,
  silkFlarePurple,
  silkFlareQuartet,
  silkFlareRack,
  silkFlareTrio,
} = catalogImages;

export type CategoryKey =
  | "girls"
  | "boys"
  | "shirt-dress"
  | "luxury-kaftan"
  | "linen"
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
  { key: "girls", name: "Girls", image: girlDresses, tagline: "Mini LK" },
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
  { key: "boubou", name: "Bou'bou", image: boubouEmbellishedColors, tagline: "Embellished ease" },
  { key: "adire", name: "Adire", image: adireOrange, tagline: "Artisan dyed pieces" },
  { key: "silk", name: "Silk", image: silkFlarePurple, tagline: "Silk flare dresses" },
];

const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
const KIDS_SIZES = ["2-3y", "4-5y", "6-7y", "8-9y", "10-11y"];

export const products: Product[] = [
  // Girls
  {
    id: "girl-dresses",
    name: "Girl Dresses",
    price: 55000,
    category: "girls",
    image: girlDresses,
    gallery: [girlDresses],
    sizes: KIDS_SIZES,
    colors: ["Burgundy"],
    description:
      "A polished girls dress with puff sleeves, button detailing and a matching headwrap.",
    tag: "New",
  },
  {
    id: "amara-print-dress",
    name: "Amara Print Dress",
    price: 30000,
    category: "girls",
    image: amaraPrintDressPrimary,
    gallery: [amaraPrintDressPrimary, amaraPrintDressSide, amaraPrintDressFront],
    sizes: KIDS_SIZES,
    colors: ["Emerald", "Pink"],
    description:
      "A vibrant girls maxi dress designed for polished occasion wear and everyday confidence. Cut in a flowing silhouette with a self-tie waist, soft flared sleeves and a coordinated scarf, it brings comfortable modest coverage together with a bold LK print finish.",
    tag: "New",
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
