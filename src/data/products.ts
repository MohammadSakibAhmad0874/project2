export type SizeKey = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type GenderFilter = 'Men' | 'Women' | 'Unisex';
export type ColorFamily = 'Neutral' | 'Earthy' | 'Bold';
export type StyleTag = 'Casual' | 'Minimal' | 'Formal' | 'Festive';
export type FitType = 'Slim' | 'Classic' | 'Tailored';

export interface SizeMeasurement {
  chest: number;
  shoulder: number;
  length: number;
  sleeve: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductMedia {
  front: string;
  back: string;
  side: string;
  sleeve: string;
  macro: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  shopName: string;
  locality: string;
  priceINR: number;
  mrpINR: number;
  rating: number;
  reviewCount: number;
  gender: GenderFilter;
  category:
    | 'Shirts'
    | 'Kurtas'
    | 'Tops & Dresses'
    | 'Outerwear'
    | 'Trousers'
    | 'Footwear'
    | 'Accessories';
  fabric: string;
  weave: string;
  fitType?: FitType;
  colorFamily: ColorFamily;
  styleTags: StyleTag[];
  sustainable: boolean;
  colors: ProductColor[];
  sizeRun: Record<SizeKey, SizeMeasurement>;
  media: ProductMedia;
  /** Per-product macro weave asset; falls back to front image in UI if ever omitted */
  macroTexture: string;
  /** Subtle multiply tint hex so macro weave matches garment hue */
  macroTintHex: string;
  description: string;
  shopkeeperNote: string;
  crossSellIds: string[];
  stockBySize: Record<SizeKey, number>;
  featured?: boolean;
}

export const HERO_EDITORIAL_IMAGE =
  '/src/assets/images/hero_jalandhar_editorial_1794869258398.jpg';

export const LUXURY_HERO_IMAGE =
  '/src/assets/images/hero_luxury_atelier_1794871841277.jpg';

export const STYLIST_AVATAR_IMAGE =
  '/src/assets/images/stylist_avatar_portrait_1794871842650.jpg';

export interface EventBoard {
  id: string;
  title: string;
  subtitle: string;
  queryTrigger: string;
  image: string;
  dressCode: string;
}

export const EVENT_BOARDS: EventBoard[] = [
  {
    id: 'dinner',
    title: 'Candlelight Dinner',
    subtitle: 'Tailored Charcoal & Supima Layers for Evening Courtyards',
    queryTrigger: 'Office ke liye',
    image: '/src/assets/images/event_candlelight_dinner_1794871841596.jpg',
    dressCode: 'Smart Tailored · Charcoal & Navy',
  },
  {
    id: 'sunset-soiree',
    title: 'Sunset Soiree',
    subtitle: 'Effortless Ivory Linen & Sand Chinos for Golden Hour',
    queryTrigger: 'Date ke liye',
    image: '/src/assets/images/event_sunset_soiree_1794871841454.jpg',
    dressCode: 'Resort Minimal · Ivory & Olive',
  },
  {
    id: 'royal-shaadi',
    title: 'Anand Karaj & Shaadi',
    subtitle: 'Doaba Handloom Kurtas, Phulkari Stoles & Cushioned Juttis',
    queryTrigger: 'Shaadi ke liye',
    image: '/src/assets/images/event_royal_shaadi_1794871841775.jpg',
    dressCode: 'Heritage Festive · Oatmeal & Terracotta',
  },
  {
    id: 'heritage-walk',
    title: 'Model Town & Campus',
    subtitle: 'Selvedge Denim & Pleated Linen for Daytime Gatherings',
    queryTrigger: 'College fest',
    image: '/src/assets/images/hero_jalandhar_editorial_1794869258398.jpg',
    dressCode: 'Urban Casual · Indigo & Sage',
  },
];

const SHIRT_SIZE_RUN: Record<SizeKey, SizeMeasurement> = {
  S: { chest: 38.5, shoulder: 17.0, length: 28.0, sleeve: 24.5 },
  M: { chest: 40.5, shoulder: 17.8, length: 28.8, sleeve: 25.0 },
  L: { chest: 42.5, shoulder: 18.5, length: 29.5, sleeve: 25.5 },
  XL: { chest: 45.0, shoulder: 19.3, length: 30.3, sleeve: 26.0 },
  XXL: { chest: 47.5, shoulder: 20.0, length: 31.0, sleeve: 26.5 },
};

const KURTA_SIZE_RUN: Record<SizeKey, SizeMeasurement> = {
  S: { chest: 40.0, shoulder: 17.2, length: 39.5, sleeve: 24.0 },
  M: { chest: 42.0, shoulder: 18.0, length: 40.5, sleeve: 24.5 },
  L: { chest: 44.0, shoulder: 18.8, length: 41.5, sleeve: 25.0 },
  XL: { chest: 46.5, shoulder: 19.5, length: 42.5, sleeve: 25.5 },
  XXL: { chest: 49.0, shoulder: 20.3, length: 43.5, sleeve: 26.0 },
};

const WOMEN_TOP_SIZE_RUN: Record<SizeKey, SizeMeasurement> = {
  S: { chest: 35.0, shoulder: 14.5, length: 23.5, sleeve: 22.0 },
  M: { chest: 37.0, shoulder: 15.2, length: 24.2, sleeve: 22.5 },
  L: { chest: 39.5, shoulder: 16.0, length: 25.0, sleeve: 23.0 },
  XL: { chest: 42.0, shoulder: 16.8, length: 25.8, sleeve: 23.5 },
  XXL: { chest: 44.5, shoulder: 17.5, length: 26.5, sleeve: 24.0 },
};

const TROUSER_SIZE_RUN: Record<SizeKey, SizeMeasurement> = {
  S: { chest: 30.0, shoulder: 15.0, length: 39.5, sleeve: 30.0 },
  M: { chest: 32.0, shoulder: 15.8, length: 40.5, sleeve: 30.5 },
  L: { chest: 34.0, shoulder: 16.5, length: 41.0, sleeve: 31.0 },
  XL: { chest: 36.0, shoulder: 17.2, length: 41.5, sleeve: 31.5 },
  XXL: { chest: 38.0, shoulder: 18.0, length: 42.0, sleeve: 32.0 },
};

const ACCESSORY_SIZE_RUN: Record<SizeKey, SizeMeasurement> = {
  S: { chest: 36.0, shoulder: 14.0, length: 16.0, sleeve: 10.0 },
  M: { chest: 38.0, shoulder: 14.5, length: 16.5, sleeve: 10.5 },
  L: { chest: 40.0, shoulder: 15.0, length: 17.0, sleeve: 11.0 },
  XL: { chest: 42.0, shoulder: 15.5, length: 17.5, sleeve: 11.5 },
  XXL: { chest: 44.0, shoulder: 16.0, length: 18.0, sleeve: 12.0 },
};

export const PRODUCTS: Product[] = [
  {
    id: 'aura-oxford-shirt',
    sku: 'LT-MT-0101',
    name: 'Aura Supima Oxford Shirt',
    shopName: 'Model Town Looms',
    locality: 'Model Town, Jalandhar',
    priceINR: 2499,
    mrpINR: 3299,
    rating: 4.8,
    reviewCount: 142,
    gender: 'Men',
    category: 'Shirts',
    fabric: '100% Supima Cotton',
    weave: 'Fine Basketweave Oxford',
    colorFamily: 'Bold',
    styleTags: ['Minimal', 'Formal', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Midnight Navy', hex: '#1E2A4A' },
      { name: 'Stone Chalk', hex: '#EDE8DE' },
      { name: 'Slate Indigo', hex: '#334155' },
    ],
    sizeRun: SHIRT_SIZE_RUN,
    media: {
      front: '/src/assets/images/oxford_shirt_front_1794869259031.jpg',
      side: '/src/assets/images/oxford_shirt_side_1794869259328.jpg',
      back: '/src/assets/images/oxford_shirt_back_1794869257260.jpg',
      sleeve: '/src/assets/images/oxford_shirt_sleeve_1794869258644.jpg',
      macro: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    },
    macroTexture: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    macroTintHex: '#1E2A4A',
    description:
      'Tailored in our Model Town workshop from double-twisted Supima cotton yarns. Features a clean button-down collar roll, mother-of-pearl buttons, and a relaxed back box pleat.',
    shopkeeperNote:
      'Ye Supima cotton garmi me chipkega nahi, pure din office ya shaam ki coffee dono me fresh lagega.',
    crossSellIds: ['sand-chino-trousers', 'tan-punjabi-jutti', 'braided-jute-tote'],
    stockBySize: { S: 6, M: 14, L: 11, XL: 8, XXL: 4 },
    featured: true,
  },
  {
    id: 'doaba-linen-kurta',
    sku: 'LT-RB-0102',
    name: 'Doaba Handloom Linen Kurta',
    shopName: 'Rainak Bazaar Drapers',
    locality: 'Rainak Bazaar, Jalandhar',
    priceINR: 2899,
    mrpINR: 3699,
    rating: 4.9,
    reviewCount: 198,
    gender: 'Men',
    category: 'Kurtas',
    fabric: '100% Pure European Flax Linen',
    weave: 'Breathable Slub Plain Weave',
    colorFamily: 'Neutral',
    styleTags: ['Festive', 'Minimal', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Oatmeal Beige', hex: '#D8CBB8' },
      { name: 'Ivory Cream', hex: '#F3EFE6' },
    ],
    sizeRun: KURTA_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_beige_kurta_1794869261317.jpg',
      side: '/src/assets/images/prod_beige_kurta_1794869261317.jpg',
      back: '/src/assets/images/prod_beige_kurta_1794869261317.jpg',
      sleeve: '/src/assets/images/prod_beige_kurta_1794869261317.jpg',
      macro: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    },
    macroTexture: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    macroTintHex: '#D8CBB8',
    description:
      'Pre-washed oatmeal linen straight kurta with a crisp mandarin collar, concealed horn-button placket, and deep side slits stitched for Jalandhar summers and daytime wedding functions.',
    shopkeeperNote:
      'Linen jitna dhulega utna soft hota jayega — Anand Karaj se leke family dinner tak sabse classy lagta hai.',
    crossSellIds: ['sand-chino-trousers', 'tan-punjabi-jutti', 'phulkari-silk-stole'],
    stockBySize: { S: 5, M: 12, L: 15, XL: 9, XXL: 5 },
    featured: true,
  },
  {
    id: 'flax-wrap-blouse',
    sku: 'LT-SB-0103',
    name: 'European Flax Linen Wrap Blouse',
    shopName: 'Sadar Studio',
    locality: 'Sadar Bazaar, Jalandhar',
    priceINR: 2199,
    mrpINR: 2799,
    rating: 4.8,
    reviewCount: 89,
    gender: 'Women',
    category: 'Tops & Dresses',
    fabric: '100% European Flax Linen',
    weave: 'Soft Washed Plain Weave',
    colorFamily: 'Neutral',
    styleTags: ['Minimal', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Warm Cream', hex: '#E9E0D2' },
      { name: 'Sandstone', hex: '#CBBBA6' },
    ],
    sizeRun: WOMEN_TOP_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_linen_blouse_1794869262783.jpg',
      side: '/src/assets/images/prod_linen_blouse_1794869262783.jpg',
      back: '/src/assets/images/prod_linen_blouse_1794869262783.jpg',
      sleeve: '/src/assets/images/prod_linen_blouse_1794869262783.jpg',
      macro: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    },
    macroTexture: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    macroTintHex: '#EFE6D7',
    description:
      'Relaxed-drape kimono wrap blouse with self-tie waist belt and French seams. Cut from breathable Belgian flax woven into airy summer-weight fabric.',
    shopkeeperNote:
      'High-waist trousers ya denim ke saath tuck karke pehno, bilkul effortless boutique look aayega.',
    crossSellIds: ['olive-pleated-trousers', 'braided-jute-tote', 'tan-punjabi-jutti'],
    stockBySize: { S: 8, M: 10, L: 9, XL: 4, XXL: 2 },
    featured: true,
  },
  {
    id: 'selvedge-denim-jacket',
    sku: 'LT-GT-0104',
    name: 'Raw Selvedge Denim Trucker Jacket',
    shopName: 'GT Road Tailors',
    locality: 'GT Road, Jalandhar',
    priceINR: 3899,
    mrpINR: 4799,
    rating: 4.9,
    reviewCount: 114,
    gender: 'Unisex',
    category: 'Outerwear',
    fabric: '13.5oz Japanese-Style Selvedge Denim',
    weave: '3x1 Right-Hand Twill',
    colorFamily: 'Bold',
    styleTags: ['Casual'],
    sustainable: false,
    colors: [
      { name: 'Raw Indigo', hex: '#1E293B' },
      { name: 'Washed Slate', hex: '#475569' },
    ],
    sizeRun: SHIRT_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_denim_jacket_1794869262932.jpg',
      side: '/src/assets/images/prod_denim_jacket_1794869262932.jpg',
      back: '/src/assets/images/prod_denim_jacket_1794869262932.jpg',
      sleeve: '/src/assets/images/prod_denim_jacket_1794869262932.jpg',
      macro: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    },
    macroTexture: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    macroTintHex: '#1D293D',
    description:
      'Constructed with antique brass shank buttons, twin chest flap pockets, and selvedge locker loops. Ages naturally with your movement across seasons.',
    shopkeeperNote:
      'Heavy 13.5oz denim hai par rigid nahi — do baar pehenne ke baad aapki body shape le leta hai.',
    crossSellIds: ['ivory-utility-overshirt', 'sand-chino-trousers', 'braided-jute-tote'],
    stockBySize: { S: 4, M: 9, L: 11, XL: 6, XXL: 3 },
    featured: true,
  },
  {
    id: 'striped-knit-dress',
    sku: 'LT-SB-0105',
    name: 'Monochrome Striped Cotton Knit Dress',
    shopName: 'Sadar Studio',
    locality: 'Sadar Bazaar, Jalandhar',
    priceINR: 2699,
    mrpINR: 3399,
    rating: 4.7,
    reviewCount: 73,
    gender: 'Women',
    category: 'Tops & Dresses',
    fabric: '100% Combed Organic Cotton Knit',
    weave: 'Interlock Rib Jersey',
    colorFamily: 'Neutral',
    styleTags: ['Minimal', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Ink & Ivory', hex: '#1F2937' },
    ],
    sizeRun: WOMEN_TOP_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_striped_dress_1794869263196.jpg',
      side: '/src/assets/images/prod_striped_dress_1794869263196.jpg',
      back: '/src/assets/images/prod_striped_dress_1794869263196.jpg',
      sleeve: '/src/assets/images/prod_striped_dress_1794869263196.jpg',
      macro: '/src/assets/images/macro_striped_knit_1794869260594.jpg',
    },
    macroTexture: '/src/assets/images/macro_striped_knit_1794869260594.jpg',
    macroTintHex: '#FFFFFF',
    description:
      'Yarn-dyed black and ivory horizontal striped midi dress with breathable half sleeves and structured rib neckline that holds its shape wash after wash.',
    shopkeeperNote:
      'Printed stripes nahi hain, asli yarn-dyed knit hai — colour kabhi fade nahi hoga aur stretch bhi balanced hai.',
    crossSellIds: ['braided-jute-tote', 'tan-punjabi-jutti', 'selvedge-denim-jacket'],
    stockBySize: { S: 7, M: 11, L: 8, XL: 5, XXL: 2 },
  },
  {
    id: 'braided-jute-tote',
    sku: 'LT-MT-0106',
    name: 'Braided Natural Jute Carryall Tote',
    shopName: 'Model Town Looms',
    locality: 'Model Town, Jalandhar',
    priceINR: 1699,
    mrpINR: 2199,
    rating: 4.8,
    reviewCount: 164,
    gender: 'Unisex',
    category: 'Accessories',
    fabric: '100% Golden Bengal Jute & Veg-Tan Leather',
    weave: 'Coarse Braided Herringbone',
    colorFamily: 'Earthy',
    styleTags: ['Casual', 'Minimal'],
    sustainable: true,
    colors: [
      { name: 'Golden Husk', hex: '#B78C56' },
    ],
    sizeRun: ACCESSORY_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_jute_tote_1794869263353.jpg',
      side: '/src/assets/images/prod_jute_tote_1794869263353.jpg',
      back: '/src/assets/images/prod_jute_tote_1794869263353.jpg',
      sleeve: '/src/assets/images/prod_jute_tote_1794869263353.jpg',
      macro: '/src/assets/images/macro_golden_jute_1794869259356.jpg',
    },
    macroTexture: '/src/assets/images/macro_golden_jute_1794869259356.jpg',
    macroTintHex: '#C6975B',
    description:
      'Hand-braided natural jute structured tote reinforced with vegetable-tanned saddle leather handles and brass rivets. Fits a 15-inch laptop with room to spare.',
    shopkeeperNote:
      'Isme raw jute ki bhoosi nahi jhadti — double-waxed finish hai aur leather straps time ke saath rich tan hote hain.',
    crossSellIds: ['flax-wrap-blouse', 'striped-knit-dress', 'aura-oxford-shirt'],
    stockBySize: { S: 10, M: 16, L: 16, XL: 10, XXL: 6 },
  },
  {
    id: 'sand-chino-trousers',
    sku: 'LT-GT-0107',
    name: 'Model Town Pleated Sand Chinos',
    shopName: 'GT Road Tailors',
    locality: 'GT Road, Jalandhar',
    priceINR: 2399,
    mrpINR: 2999,
    rating: 4.7,
    reviewCount: 95,
    gender: 'Men',
    category: 'Trousers',
    fabric: '98% Organic Cotton Twill, 2% Elastane',
    weave: 'Compact Peach-Finish Twill',
    colorFamily: 'Neutral',
    styleTags: ['Formal', 'Minimal', 'Casual'],
    sustainable: false,
    colors: [
      { name: 'Warm Sand', hex: '#CBB799' },
      { name: 'Khaki Stone', hex: '#B4A184' },
    ],
    sizeRun: TROUSER_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_sand_chinos_1794869263518.jpg',
      side: '/src/assets/images/prod_sand_chinos_1794869263518.jpg',
      back: '/src/assets/images/prod_sand_chinos_1794869263518.jpg',
      sleeve: '/src/assets/images/prod_sand_chinos_1794869263518.jpg',
      macro: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    },
    macroTexture: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    macroTintHex: '#D5BFA0',
    description:
      'Single-pleated tailored chino trousers with horn button tab closure and clean tapered hem. Engineered to pair seamlessly with navy Oxford shirts or oatmeal kurtas.',
    shopkeeperNote:
      'Pocket lining tak pure cotton poplin ki hai — summer me thighs pe sweat bilkul feel nahi hoga.',
    crossSellIds: ['aura-oxford-shirt', 'charcoal-wool-blazer', 'tan-punjabi-jutti'],
    stockBySize: { S: 7, M: 15, L: 12, XL: 9, XXL: 4 },
  },
  {
    id: 'tan-punjabi-jutti',
    sku: 'LT-RB-0108',
    name: 'Handcrafted Tan Leather Punjabi Jutti',
    shopName: 'Rainak Bazaar Drapers',
    locality: 'Rainak Bazaar, Jalandhar',
    priceINR: 1999,
    mrpINR: 2599,
    rating: 4.9,
    reviewCount: 211,
    gender: 'Unisex',
    category: 'Footwear',
    fabric: 'Full-Grain Vegetable-Tanned Leather',
    weave: 'Hand-Stitched Zari & Thread Embroidery',
    colorFamily: 'Earthy',
    styleTags: ['Festive', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Saddle Tan', hex: '#9A6338' },
    ],
    sizeRun: ACCESSORY_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_leather_kolhapuri_1794869265073.jpg',
      side: '/src/assets/images/prod_leather_kolhapuri_1794869265073.jpg',
      back: '/src/assets/images/prod_leather_kolhapuri_1794869265073.jpg',
      sleeve: '/src/assets/images/prod_leather_kolhapuri_1794869265073.jpg',
      macro: '/src/assets/images/macro_golden_jute_1794869259356.jpg',
    },
    macroTexture: '/src/assets/images/macro_golden_jute_1794869259356.jpg',
    macroTintHex: '#A86B3E',
    description:
      'Made by third-generation mochis near Mai Hiran Gate with double-cushioned leather insoles so there is zero shoe-bite from day one.',
    shopkeeperNote:
      'Pehli baar pehenne pe bhi pair nahi kategi — andar double memory foam + soft goat leather lining lagayi hai.',
    crossSellIds: ['doaba-linen-kurta', 'sand-chino-trousers', 'phulkari-silk-stole'],
    stockBySize: { S: 8, M: 14, L: 14, XL: 10, XXL: 5 },
  },
  {
    id: 'phulkari-silk-stole',
    sku: 'LT-RB-0109',
    name: 'Phulkari Heritage Cotton-Silk Stole',
    shopName: 'Rainak Bazaar Drapers',
    locality: 'Rainak Bazaar, Jalandhar',
    priceINR: 1850,
    mrpINR: 2400,
    rating: 4.9,
    reviewCount: 127,
    gender: 'Unisex',
    category: 'Accessories',
    fabric: '70% Mulberry Silk, 30% Khadi Cotton',
    weave: 'Hand-Embroidered Geometric Phulkari',
    colorFamily: 'Earthy',
    styleTags: ['Festive', 'Minimal'],
    sustainable: true,
    colors: [
      { name: 'Terracotta & Ivory', hex: '#B4532A' },
    ],
    sizeRun: ACCESSORY_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
      side: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
      back: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
      sleeve: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
      macro: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
    },
    macroTexture: '/src/assets/images/prod_phulkari_stole_1794869264830.jpg',
    macroTintHex: '#FFFFFF',
    description:
      'Authentic hand-darned Phulkari geometric motifs worked in terracotta silk thread on unbleached khadi cotton base with hand-knotted tassels.',
    shopkeeperNote:
      'Machine embroidery nahi hai — Doaba ke karigaron ne haath se phulkari taanke lagaye hain, har piece unique hai.',
    crossSellIds: ['doaba-linen-kurta', 'flax-wrap-blouse', 'tan-punjabi-jutti'],
    stockBySize: { S: 12, M: 12, L: 12, XL: 12, XXL: 12 },
  },
  {
    id: 'charcoal-wool-blazer',
    sku: 'LT-GT-0110',
    name: 'Sutlej Tropical Wool-Linen Blazer',
    shopName: 'GT Road Tailors',
    locality: 'GT Road, Jalandhar',
    priceINR: 5499,
    mrpINR: 6999,
    rating: 4.9,
    reviewCount: 68,
    gender: 'Men',
    category: 'Outerwear',
    fabric: '60% Super 110s Tropical Wool, 40% Linen',
    weave: 'High-Twist Hopsack Weave',
    colorFamily: 'Bold',
    styleTags: ['Formal', 'Minimal'],
    sustainable: false,
    colors: [
      { name: 'Charcoal Slate', hex: '#374151' },
    ],
    sizeRun: SHIRT_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_charcoal_blazer_1794869265828.jpg',
      side: '/src/assets/images/prod_charcoal_blazer_1794869265828.jpg',
      back: '/src/assets/images/prod_charcoal_blazer_1794869265828.jpg',
      sleeve: '/src/assets/images/prod_charcoal_blazer_1794869265828.jpg',
      macro: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    },
    macroTexture: '/src/assets/images/macro_navy_oxford_1794869260906.jpg',
    macroTintHex: '#374151',
    description:
      'Half-canvas unstructured blazer with natural shoulder padding, notch lapels, and breathable Bemberg lining made for Punjab evenings and boardroom presentations.',
    shopkeeperNote:
      'Bhari winter blazer nahi hai — light hopsack weave hai jo AC office se evening reception tak comfortable rehta hai.',
    crossSellIds: ['aura-oxford-shirt', 'sand-chino-trousers', 'tan-punjabi-jutti'],
    stockBySize: { S: 3, M: 7, L: 9, XL: 6, XXL: 3 },
  },
  {
    id: 'ivory-utility-overshirt',
    sku: 'LT-MT-0111',
    name: 'Heavy Twill Ivory Utility Overshirt',
    shopName: 'Model Town Looms',
    locality: 'Model Town, Jalandhar',
    priceINR: 2599,
    mrpINR: 3199,
    rating: 4.8,
    reviewCount: 84,
    gender: 'Unisex',
    category: 'Shirts',
    fabric: '100% Organic Heavy Cotton Twill',
    weave: '310 GSM Brushed Cavalry Twill',
    colorFamily: 'Neutral',
    styleTags: ['Casual', 'Minimal'],
    sustainable: true,
    colors: [
      { name: 'Raw Ivory', hex: '#F2ECE1' },
    ],
    sizeRun: SHIRT_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_ivory_overshirt_1794869264899.jpg',
      side: '/src/assets/images/prod_ivory_overshirt_1794869264899.jpg',
      back: '/src/assets/images/prod_ivory_overshirt_1794869264899.jpg',
      sleeve: '/src/assets/images/prod_ivory_overshirt_1794869264899.jpg',
      macro: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    },
    macroTexture: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    macroTintHex: '#F2ECE1',
    description:
      'Boxy workwear-inspired overshirt with twin buttoned utility pockets and genuine horn buttons. Wear open over a tee or buttoned up as a crisp layer.',
    shopkeeperNote:
      '310 GSM twill hai — shirt se zyada structure aur jacket se zyada lightness deta hai.',
    crossSellIds: ['olive-pleated-trousers', 'braided-jute-tote', 'tan-punjabi-jutti'],
    stockBySize: { S: 5, M: 10, L: 11, XL: 7, XXL: 4 },
  },
  {
    id: 'olive-pleated-trousers',
    sku: 'LT-SB-0112',
    name: 'Sage Olive Linen-Cotton Pleated Trousers',
    shopName: 'Sadar Studio',
    locality: 'Sadar Bazaar, Jalandhar',
    priceINR: 2499,
    mrpINR: 3099,
    rating: 4.8,
    reviewCount: 91,
    gender: 'Unisex',
    category: 'Trousers',
    fabric: '55% Linen, 45% Organic Cotton',
    weave: 'Matte Slub Twill',
    colorFamily: 'Earthy',
    styleTags: ['Minimal', 'Casual'],
    sustainable: true,
    colors: [
      { name: 'Sage Olive', hex: '#717B62' },
    ],
    sizeRun: TROUSER_SIZE_RUN,
    media: {
      front: '/src/assets/images/prod_olive_trousers_1794869265746.jpg',
      side: '/src/assets/images/prod_olive_trousers_1794869265746.jpg',
      back: '/src/assets/images/prod_olive_trousers_1794869265746.jpg',
      sleeve: '/src/assets/images/prod_olive_trousers_1794869265746.jpg',
      macro: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    },
    macroTexture: '/src/assets/images/macro_beige_linen_1794869260565.jpg',
    macroTintHex: '#7A866B',
    description:
      'Relaxed double-pleat trousers with hidden interior drawstring and crisp leg crease. Cut for breezy airflow and clean drape.',
    shopkeeperNote:
      'Elastic ya rigid belt ka jhanjhat nahi — andar concealed drawstring hai jo comfort aur tailored look dono rakhta hai.',
    crossSellIds: ['ivory-utility-overshirt', 'flax-wrap-blouse', 'braided-jute-tote'],
    stockBySize: { S: 6, M: 11, L: 10, XL: 7, XXL: 3 },
  },
];

export const SIZE_ORDER: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];
