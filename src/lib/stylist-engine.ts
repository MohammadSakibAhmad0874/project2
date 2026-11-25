import { ColorFamily, PRODUCTS, Product, StyleTag } from '@/src/data/products';

export interface LookItems {
  upper: Product;
  lower: Product;
  footwear: Product;
  accessory: Product;
}

export interface BundledLook {
  id: string;
  title: string;
  subtitle: string;
  eventLabel: string;
  colorRule: string;
  colorFamily: ColorFamily;
  styleTag: StyleTag;
  rating: number;
  items: LookItems;
  totalINR: number;
  reason: string;
  stylistReplyHinglish: string;
}

export type EventCategoryKey = 'wedding' | 'dinner' | 'office' | 'date' | 'casual';

export interface EventTaxonomyRule {
  key: EventCategoryKey;
  id: string;
  title: string;
  subtitle: string;
  eventLabel: string;
  keywords: string[];
  preferredStyleTags: StyleTag[];
  preferredColorFamily: ColorFamily;
  secondaryColorFamily: ColorFamily;
  colorRule: string;
  paletteTokens: string[];
  upperCategories: Product['category'][];
  accessoryCategories: Product['category'][];
  preferredIds: {
    upper: string[];
    lower: string[];
    footwear: string[];
    accessory: string[];
  };
  reason: string;
  stylistReplyHinglish: string;
}

export const EVENT_TAXONOMY: EventTaxonomyRule[] = [
  {
    key: 'wedding',
    id: 'shaadi-look',
    title: 'Doaba Shaadi Edit',
    subtitle: 'Daytime Anand Karaj & Evening Sangeet',
    eventLabel: 'Shaadi / Festive',
    keywords: [
      'shaadi',
      'wedding',
      'anand karaj',
      'karaj',
      'sangeet',
      'roka',
      'mehndi',
      'mehendi',
      'haldi',
      'baraat',
      'festive',
      'diwali',
      'puja',
      'ethnic',
    ],
    preferredStyleTags: ['Festive', 'Minimal'],
    preferredColorFamily: 'Earthy',
    secondaryColorFamily: 'Neutral',
    colorRule: 'Oatmeal Beige + Warm Sand + Terracotta + Saddle Tan',
    paletteTokens: ['oatmeal', 'beige', 'ivory', 'cream', 'sand', 'terracotta', 'tan', 'phulkari'],
    upperCategories: ['Kurtas', 'Shirts', 'Tops & Dresses'],
    accessoryCategories: ['Accessories', 'Outerwear'],
    preferredIds: {
      upper: ['doaba-linen-kurta', 'flax-wrap-blouse', 'ivory-utility-overshirt'],
      lower: ['sand-chino-trousers', 'olive-pleated-trousers'],
      footwear: ['tan-punjabi-jutti'],
      accessory: ['phulkari-silk-stole', 'braided-jute-tote'],
    },
    reason:
      'Oatmeal Belgian flax pairs harmoniously with warm sand trousers, grounded by saddle tan Punjabi juttis and terracotta silk Phulkari as the focal color accent.',
    stylistReplyHinglish:
      'Arre wah, shaadi ka function hai! Jalandhar ki garmi aur family photos dono ke liye Oatmeal Linen Kurta best rahega. Uske saath Warm Sand Chinos, Terracotta Phulkari Stole aur double-cushioned Tan Jutti — bilkul royal Punjabi aesthetic bina heavy embroidery ke!',
  },
  {
    key: 'dinner',
    id: 'dinner-look',
    title: 'Candlelight Evening Edit',
    subtitle: 'Tailored Courtyard Dinner & Reception',
    eventLabel: 'Candlelight Dinner',
    keywords: [
      'candlelight',
      'dinner',
      'reception',
      'cocktail',
      'evening',
      'gala',
      'night',
    ],
    preferredStyleTags: ['Formal', 'Minimal'],
    preferredColorFamily: 'Bold',
    secondaryColorFamily: 'Neutral',
    colorRule: 'Charcoal Slate + Midnight Navy + Warm Sand + Saddle Brown',
    paletteTokens: ['charcoal', 'navy', 'indigo', 'slate', 'sand', 'ivory', 'tan'],
    upperCategories: ['Outerwear', 'Shirts', 'Tops & Dresses'],
    accessoryCategories: ['Shirts', 'Accessories', 'Outerwear'],
    preferredIds: {
      upper: ['charcoal-wool-blazer', 'aura-oxford-shirt', 'striped-knit-dress'],
      lower: ['sand-chino-trousers', 'olive-pleated-trousers'],
      footwear: ['tan-punjabi-jutti'],
      accessory: ['aura-oxford-shirt', 'phulkari-silk-stole', 'braided-jute-tote'],
    },
    reason:
      'Charcoal Super 110s hopsack layered with midnight navy Supima and warm sand trousers delivers understated evening authority under warm courtyard lighting.',
    stylistReplyHinglish:
      'Candlelight dinner ya evening reception ke liye Charcoal Tropical Blazer + Sand Chinos + Saddle Tan Jutti sabse timeless trio hai. Andar Navy Supima Shirt pehno toh warm lighting me sharp contrast aayega.',
  },
  {
    key: 'office',
    id: 'office-look',
    title: 'Model Town Executive',
    subtitle: 'Smart-Formal Tailored Rotation',
    eventLabel: 'Office & After-Hours',
    keywords: [
      'office',
      'meeting',
      'interview',
      'corporate',
      'work',
      'boardroom',
      'presentation',
      'formal',
      'party',
      'business',
    ],
    preferredStyleTags: ['Formal', 'Minimal'],
    preferredColorFamily: 'Bold',
    secondaryColorFamily: 'Neutral',
    colorRule: 'Navy + Sand Beige + Charcoal + Saddle Brown',
    paletteTokens: ['navy', 'sand', 'chalk', 'charcoal', 'slate', 'tan'],
    upperCategories: ['Shirts', 'Outerwear', 'Tops & Dresses'],
    accessoryCategories: ['Outerwear', 'Accessories'],
    preferredIds: {
      upper: ['aura-oxford-shirt', 'flax-wrap-blouse', 'charcoal-wool-blazer'],
      lower: ['sand-chino-trousers', 'olive-pleated-trousers'],
      footwear: ['tan-punjabi-jutti'],
      accessory: ['charcoal-wool-blazer', 'braided-jute-tote'],
    },
    reason:
      'Classic menswear color triad: Midnight Navy double-twisted Supima balanced by Sand Beige pleats, structured Charcoal outer layer, and Saddle Tan footwear.',
    stylistReplyHinglish:
      'Office party ya important presentation ke liye Navy + Beige + Charcoal rule kabhi fail nahi hota! Aura Supima Oxford Shirt ko Sand Chinos me tuck karo, aur evening ke liye upar Sutlej Charcoal Blazer daal lo — clean, sharp aur breathable.',
  },
  {
    key: 'date',
    id: 'date-look',
    title: 'Evening Coffee & Courtyard',
    subtitle: 'Relaxed Luxury Without Trying Too Hard',
    eventLabel: 'Date Night & Brunch',
    keywords: [
      'date',
      'coffee',
      'brunch',
      'soiree',
      'sunset',
      'gallery',
      'lounge',
      'resort',
      'outing',
    ],
    preferredStyleTags: ['Minimal', 'Casual'],
    preferredColorFamily: 'Neutral',
    secondaryColorFamily: 'Earthy',
    colorRule: 'Raw Ivory + Sage Olive + Saddle Tan + Golden Jute',
    paletteTokens: ['ivory', 'cream', 'olive', 'sage', 'sand', 'golden', 'tan'],
    upperCategories: ['Shirts', 'Tops & Dresses', 'Kurtas'],
    accessoryCategories: ['Accessories', 'Outerwear'],
    preferredIds: {
      upper: ['ivory-utility-overshirt', 'flax-wrap-blouse', 'striped-knit-dress'],
      lower: ['olive-pleated-trousers', 'sand-chino-trousers'],
      footwear: ['tan-punjabi-jutti'],
      accessory: ['braided-jute-tote', 'phulkari-silk-stole'],
    },
    reason:
      'Tonal Raw Ivory cotton twill lifts complexion in golden-hour light while Sage Olive linen trousers and natural jute craft a serene earthy palette.',
    stylistReplyHinglish:
      'Date pe over-dressed nahi, understated classy lagna chahiye! Heavy Twill Ivory Overshirt ya Flax Linen Blouse ke saath Sage Olive Pleated Trousers pehno — soft earth tones me natural confidence aata hai.',
  },
  {
    key: 'casual',
    id: 'college-look',
    title: 'Doaba Campus Layer',
    subtitle: 'Fest, Market Walk & Weekend Roadtrips',
    eventLabel: 'College Fest / Casual',
    keywords: [
      'college',
      'fest',
      'campus',
      'weekend',
      'street',
      'travel',
      'casual',
      'walk',
      'roadtrip',
    ],
    preferredStyleTags: ['Casual', 'Minimal'],
    preferredColorFamily: 'Bold',
    secondaryColorFamily: 'Earthy',
    colorRule: 'Raw Indigo + Sage Olive + Saddle Tan + Golden Husk',
    paletteTokens: ['indigo', 'slate', 'olive', 'sage', 'golden', 'tan'],
    upperCategories: ['Outerwear', 'Shirts', 'Tops & Dresses'],
    accessoryCategories: ['Accessories', 'Shirts'],
    preferredIds: {
      upper: ['selvedge-denim-jacket', 'striped-knit-dress', 'ivory-utility-overshirt'],
      lower: ['olive-pleated-trousers', 'sand-chino-trousers'],
      footwear: ['tan-punjabi-jutti'],
      accessory: ['braided-jute-tote', 'phulkari-silk-stole'],
    },
    reason:
      'Deep 13.5oz indigo selvedge structured against matte sage olive pleats balances rugged texture with breezy movement and warm tan leather accents.',
    stylistReplyHinglish:
      'College fest ya weekend outing ke liye ye Raw Selvedge Denim Jacket + Sage Olive Pleated Trousers wala combo super hit hai! Saath me Braided Jute Tote le lo — laptop, charger, sab aa jayega aur look ekdum standout rahega.',
  },
];

function findById(catalog: Product[], id: string, fallbackIndex: number): Product {
  return catalog.find((p) => p.id === id) ?? catalog[fallbackIndex % catalog.length];
}

function getTotalStock(product: Product): number {
  return Object.values(product.stockBySize).reduce((sum, count) => sum + (count || 0), 0);
}

function matchEventRule(query: string): EventTaxonomyRule {
  const q = query.toLowerCase();
  let bestRule = EVENT_TAXONOMY[EVENT_TAXONOMY.length - 1]; // casual fallback
  let bestMatches = 0;

  for (const rule of EVENT_TAXONOMY) {
    let matches = 0;
    for (const kw of rule.keywords) {
      if (q.includes(kw)) matches += kw.length > 5 ? 2 : 1;
    }
    if (matches > bestMatches) {
      bestMatches = matches;
      bestRule = rule;
    }
  }

  return bestRule;
}

const COLOR_QUERY_TOKENS = [
  'navy',
  'indigo',
  'charcoal',
  'slate',
  'olive',
  'sage',
  'sand',
  'ivory',
  'cream',
  'beige',
  'oatmeal',
  'terracotta',
  'tan',
  'jute',
];

function scoreCandidate(
  product: Product,
  allowedCategories: Product['category'][],
  preferredIds: string[],
  rule: EventTaxonomyRule,
  queryLower: string,
  prefersWomen: boolean,
  excludedIds: Set<string>,
  chosenUpper?: Product
): number {
  if (excludedIds.has(product.id)) return Number.NEGATIVE_INFINITY;

  let score = 0;

  // 1. Category / slot suitability
  const catRank = allowedCategories.indexOf(product.category);
  if (catRank === 0) score += 45;
  else if (catRank > 0) score += 32 - catRank * 4;
  else score -= 40;

  // 2. Curated preference anchor boost
  const prefIdx = preferredIds.indexOf(product.id);
  if (prefIdx !== -1) score += 30 - prefIdx * 6;

  // 3. Gender cue responsiveness (e.g., "women wedding outfit")
  if (prefersWomen) {
    if (product.gender === 'Women') score += 26;
    else if (product.gender === 'Unisex') score += 12;
    else score -= 12;
  }

  // 4. Event styleTag compatibility
  for (let i = 0; i < rule.preferredStyleTags.length; i++) {
    if (product.styleTags.includes(rule.preferredStyleTags[i])) {
      score += 14 - i * 4;
    }
  }

  // 5. Color-matching rules: balance Neutrals with Earthy/Bold and avoid clashing Bold+Bold
  if (product.colorFamily === rule.preferredColorFamily) score += 12;
  else if (product.colorFamily === rule.secondaryColorFamily) score += 9;
  else if (product.colorFamily === 'Neutral') score += 6;

  if (chosenUpper) {
    if (chosenUpper.colorFamily === 'Bold' && product.colorFamily === 'Bold') {
      // Avoid pairing two competing Bold items unless explicitly matched (e.g. Navy + Charcoal)
      const isClassicNavyCharcoal =
        (chosenUpper.id.includes('oxford') && product.id.includes('blazer')) ||
        (chosenUpper.id.includes('blazer') && product.id.includes('oxford'));
      score += isClassicNavyCharcoal ? 6 : -10;
    } else if (
      (chosenUpper.colorFamily === 'Bold' || chosenUpper.colorFamily === 'Earthy') &&
      (product.colorFamily === 'Neutral' || product.colorFamily === 'Earthy')
    ) {
      score += 8;
    }
  }

  // 6. Palette token & user color keyword affinity
  const productText = `${product.name} ${product.colors.map((c) => c.name).join(' ')}`.toLowerCase();
  for (const token of rule.paletteTokens) {
    if (productText.includes(token)) score += 4;
  }
  for (const colorWord of COLOR_QUERY_TOKENS) {
    if (queryLower.includes(colorWord) && productText.includes(colorWord)) {
      score += 22;
    }
  }

  // 7. Stock & quality tie-breakers
  const stock = getTotalStock(product);
  score += stock > 0 ? 5 : -25;
  score += product.rating * 1.5;

  return score;
}

function pickBestForSlot(
  catalog: Product[],
  allowedCategories: Product['category'][],
  preferredIds: string[],
  rule: EventTaxonomyRule,
  queryLower: string,
  prefersWomen: boolean,
  excludedIds: Set<string>,
  chosenUpper?: Product
): Product {
  let bestProduct = catalog[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const candidate of catalog) {
    const s = scoreCandidate(
      candidate,
      allowedCategories,
      preferredIds,
      rule,
      queryLower,
      prefersWomen,
      excludedIds,
      chosenUpper
    );
    if (s > bestScore) {
      bestScore = s;
      bestProduct = candidate;
    }
  }

  excludedIds.add(bestProduct.id);
  return bestProduct;
}

export function buildCompleteLooks(catalog: Product[] = PRODUCTS): BundledLook[] {
  const urbanUpper = findById(catalog, 'selvedge-denim-jacket', 3);
  const urbanLower = findById(catalog, 'olive-pleated-trousers', 11);
  const urbanFootwear = findById(catalog, 'tan-punjabi-jutti', 7);
  const urbanAcc = findById(catalog, 'braided-jute-tote', 5);

  const minimalUpper = findById(catalog, 'flax-wrap-blouse', 2);
  const minimalLower = findById(catalog, 'sand-chino-trousers', 6);
  const minimalFootwear = findById(catalog, 'tan-punjabi-jutti', 7);
  const minimalAcc = findById(catalog, 'braided-jute-tote', 5);

  const blazerUpper = findById(catalog, 'charcoal-wool-blazer', 9);
  const blazerLower = findById(catalog, 'sand-chino-trousers', 6);
  const blazerFootwear = findById(catalog, 'tan-punjabi-jutti', 7);
  const blazerAcc = findById(catalog, 'aura-oxford-shirt', 0);

  return [
    {
      id: 'urban-casual',
      title: 'Urban Casual',
      subtitle: 'Model Town Coffee & Campus Run',
      eventLabel: 'College / Weekend',
      colorRule: 'Raw Indigo + Sage Olive + Saddle Tan',
      colorFamily: 'Earthy',
      styleTag: 'Casual',
      rating: 4.9,
      items: {
        upper: urbanUpper,
        lower: urbanLower,
        footwear: urbanFootwear,
        accessory: urbanAcc,
      },
      totalINR:
        urbanUpper.priceINR +
        urbanLower.priceINR +
        urbanFootwear.priceINR +
        urbanAcc.priceINR,
      reason:
        'Deep indigo denim anchors earthy olive linen trousers while golden jute and tan leather warm up the palette.',
      stylistReplyHinglish:
        'College fest ya Model Town hangout ke liye best combo! Indigo denim jacket ke neeche olive pleated trousers aur tan jutti bilkul effortless street-luxe vibe degi.',
    },
    {
      id: 'minimalist-chic',
      title: 'Minimalist Chic',
      subtitle: 'Sunday Brunch & Gallery Stroll',
      eventLabel: 'Date / Brunch',
      colorRule: 'Warm Cream + Sand Beige + Golden Husk',
      colorFamily: 'Neutral',
      styleTag: 'Minimal',
      rating: 4.8,
      items: {
        upper: minimalUpper,
        lower: minimalLower,
        footwear: minimalFootwear,
        accessory: minimalAcc,
      },
      totalINR:
        minimalUpper.priceINR +
        minimalLower.priceINR +
        minimalFootwear.priceINR +
        minimalAcc.priceINR,
      reason:
        'Monochromatic cream-to-sand layering elongates the silhouette and lets pure European flax texture lead.',
      stylistReplyHinglish:
        'Date ya brunch ke liye tonal cream-sand palette sabse zyada refined lagta hai. Soft flax linen blouse ke saath braided jute tote bilkul clean editorial look banata hai.',
    },
    {
      id: 'smart-blazer',
      title: 'Smart Blazer',
      subtitle: 'Boardroom to Evening Reception',
      eventLabel: 'Office Party / Formal',
      colorRule: 'Charcoal Slate + Midnight Navy + Warm Sand',
      colorFamily: 'Bold',
      styleTag: 'Formal',
      rating: 4.9,
      items: {
        upper: blazerUpper,
        lower: blazerLower,
        footwear: blazerFootwear,
        accessory: blazerAcc,
      },
      totalINR:
        blazerUpper.priceINR +
        blazerLower.priceINR +
        blazerFootwear.priceINR +
        blazerAcc.priceINR,
      reason:
        'Charcoal hopsack blazer layered over Supima navy Oxford and sand chinos balances authority with breathable Punjab tailoring.',
      stylistReplyHinglish:
        'Office party ya client dinner hai? Charcoal wool-linen blazer ke andar Aura Navy Oxford Shirt aur sand chinos pehno — sharp bhi lagega aur AC me thanda-garam balance rahega.',
    },
  ];
}

/**
 * Event-to-outfit stylist engine combining the curated event taxonomy,
 * gender/palette intent detection, and color-harmony scoring rules across
 * the live catalog to return a deduplicated 4-piece BundledLook.
 */
export function getLookForEvent(
  eventInput: string,
  catalog: Product[] = PRODUCTS
): BundledLook {
  const safeCatalog = catalog.length > 0 ? catalog : PRODUCTS;
  const queryLower = eventInput.trim().toLowerCase();
  const rule = matchEventRule(queryLower);

  const prefersWomen =
    queryLower.includes('women') ||
    queryLower.includes('woman') ||
    queryLower.includes('ladies') ||
    queryLower.includes('girl') ||
    queryLower.includes('blouse') ||
    queryLower.includes('dress');

  const usedIds = new Set<string>();

  const upper = pickBestForSlot(
    safeCatalog,
    rule.upperCategories,
    rule.preferredIds.upper,
    rule,
    queryLower,
    prefersWomen,
    usedIds
  );

  const lower = pickBestForSlot(
    safeCatalog,
    ['Trousers'],
    rule.preferredIds.lower,
    rule,
    queryLower,
    prefersWomen,
    usedIds,
    upper
  );

  const footwear = pickBestForSlot(
    safeCatalog,
    ['Footwear'],
    rule.preferredIds.footwear,
    rule,
    queryLower,
    prefersWomen,
    usedIds,
    upper
  );

  const accessory = pickBestForSlot(
    safeCatalog,
    rule.accessoryCategories,
    rule.preferredIds.accessory,
    rule,
    queryLower,
    prefersWomen,
    usedIds,
    upper
  );

  const items: LookItems = { upper, lower, footwear, accessory };
  const totalINR =
    upper.priceINR + lower.priceINR + footwear.priceINR + accessory.priceINR;

  const avgRating = Number(
    ((upper.rating + lower.rating + footwear.rating + accessory.rating) / 4).toFixed(1)
  );

  return {
    id: rule.id,
    title: rule.title,
    subtitle: rule.subtitle,
    eventLabel: rule.eventLabel,
    colorRule: rule.colorRule,
    colorFamily: rule.preferredColorFamily,
    styleTag: rule.preferredStyleTags[0],
    rating: avgRating,
    items,
    totalINR,
    reason: rule.reason,
    stylistReplyHinglish: rule.stylistReplyHinglish,
  };
}
