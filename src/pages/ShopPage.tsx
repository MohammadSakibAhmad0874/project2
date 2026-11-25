import React, { useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { ColorFamily, FitType, Product, SIZE_ORDER, SizeKey } from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { ProductCard } from '@/src/components/ProductCard';
import { Reveal } from '@/src/components/Reveal';
import { StoryCanvas3D, StoryScrollState } from '@/src/components/StoryCanvas3D';
import { PromiseBar } from '@/src/components/PromiseBar';

interface ShopPageProps {
  initialGender?: string;
  initialCategory?: string;
  initialSustainable?: boolean;
  onOpenProduct: (productId: string) => void;
}

const CATEGORIES: ('All' | Product['category'])[] = [
  'All',
  'Shirts',
  'Kurtas',
  'Tops & Dresses',
  'Outerwear',
  'Trousers',
  'Footwear',
  'Accessories',
];

const FABRICS = ['All', 'Supima Cotton', 'Linen', 'Denim', 'Natural Jute', 'Wool-Linen', 'Cotton'];
const FITS: ('All' | FitType)[] = ['All', 'Slim', 'Classic', 'Tailored'];
const COLORS: ('All' | ColorFamily)[] = ['All', 'Neutral', 'Earthy', 'Bold'];

export function ShopPage({
  initialGender = 'All',
  initialCategory = 'All',
  initialSustainable = false,
  onOpenProduct,
}: ShopPageProps) {
  const { catalog } = useStore();
  const scrollStateRef = useRef<StoryScrollState>({ progress: 0.2, chapter: 1 });

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<string>(initialGender);
  const [category, setCategory] = useState<string>(initialCategory);
  const [fabricFilter, setFabricFilter] = useState<string>('All');
  const [fitFilter, setFitFilter] = useState<'All' | FitType>('All');
  const [colorFamily, setColorFamily] = useState<'All' | ColorFamily>('All');
  const [selectedSize, setSelectedSize] = useState<'All' | SizeKey>('All');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [onlySustainable, setOnlySustainable] = useState<boolean>(initialSustainable);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>(
    'featured'
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = catalog.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.shopName} ${p.fabric} ${p.category} ${p.locality}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (gender !== 'All' && p.gender !== gender && p.gender !== 'Unisex') return false;
      if (category !== 'All' && p.category !== category) return false;
      if (colorFamily !== 'All' && p.colorFamily !== colorFamily) return false;
      if (fitFilter !== 'All' && (p.fitType ?? 'Tailored') !== fitFilter) return false;
      if (selectedSize !== 'All' && (p.stockBySize[selectedSize] ?? 0) <= 0) return false;
      if (p.priceINR > maxPrice) return false;
      if (onlySustainable && !p.sustainable) return false;
      if (fabricFilter !== 'All') {
        if (!p.fabric.toLowerCase().includes(fabricFilter.toLowerCase())) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.priceINR - b.priceINR);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.priceINR - a.priceINR);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [
    catalog,
    search,
    gender,
    category,
    fabricFilter,
    fitFilter,
    colorFamily,
    selectedSize,
    maxPrice,
    onlySustainable,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch('');
    setGender('All');
    setCategory('All');
    setFabricFilter('All');
    setFitFilter('All');
    setColorFamily('All');
    setSelectedSize('All');
    setMaxPrice(6000);
    setOnlySustainable(false);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      {/* Subtle Silk Drapery Atmospheric Banner */}
      <section className="relative h-48 sm:h-56 overflow-hidden bg-[#121316] text-[#F7F4EE] border-b border-[#2A2C32]">
        <div className="absolute inset-0">
          <StoryCanvas3D scrollStateRef={scrollStateRef} variant="banner" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#121316]/90 via-[#121316]/60 to-transparent"
          />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-8 h-full flex flex-col justify-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[#C4B494]">
            The Archive · {filteredProducts.length} Garments
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-normal tracking-wide text-[#F7F4EE]">
            Tailoring Collection
          </h1>
        </div>
      </section>

      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-10 space-y-8">
        <Reveal y={16}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E4DED2] pb-5">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-[#16171A]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kurta, oxford shirt, jute tote..."
              aria-label="Search collection"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E4DED2] text-xs focus:outline-none focus:border-[#16171A]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-mono text-xs text-[#16171A]/55 tabular-nums">
              {filteredProducts.length} pieces
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort products"
              className="px-3.5 py-2.5 bg-white border border-[#E4DED2] text-xs font-medium text-[#16171A] cursor-pointer"
            >
              <option value="featured">Sort: Curated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <aside className="w-full lg:w-52 shrink-0 space-y-6 text-xs">
            <div className="pb-4 border-b border-[#E4DED2]">
              <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2.5">
                Category
              </p>
              <ul className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-left transition-colors cursor-pointer ${
                        category === cat
                          ? 'text-[#16171A] font-semibold underline underline-offset-4'
                          : 'text-[#16171A]/65 hover:text-[#16171A]'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pb-4 border-b border-[#E4DED2]">
              <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2.5">
                Fabric
              </p>
              <ul className="space-y-1.5">
                {FABRICS.map((fab) => (
                  <li key={fab}>
                    <button
                      type="button"
                      onClick={() => setFabricFilter(fab)}
                      className={`text-left transition-colors cursor-pointer ${
                        fabricFilter === fab
                          ? 'text-[#16171A] font-semibold underline underline-offset-4'
                          : 'text-[#16171A]/65 hover:text-[#16171A]'
                      }`}
                    >
                      {fab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pb-4 border-b border-[#E4DED2]">
              <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2.5">
                Fit
              </p>
              <ul className="space-y-1.5">
                {FITS.map((f) => (
                  <li key={f}>
                    <button
                      type="button"
                      onClick={() => setFitFilter(f)}
                      className={`text-left transition-colors cursor-pointer ${
                        fitFilter === f
                          ? 'text-[#16171A] font-semibold underline underline-offset-4'
                          : 'text-[#16171A]/65 hover:text-[#16171A]'
                      }`}
                    >
                      {f}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pb-4 border-b border-[#E4DED2] space-y-3">
              <div>
                <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2">
                  Color Palette
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorFamily(c)}
                      className={`px-2 py-1 border text-[11px] cursor-pointer ${
                        colorFamily === c
                          ? 'bg-[#121316] text-white border-[#121316]'
                          : 'bg-white text-[#16171A]/75 border-[#E4DED2]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2">
                  Size
                </p>
                <div className="flex flex-wrap gap-1">
                  {(['All', ...SIZE_ORDER] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2 py-1 border text-[11px] cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#121316] text-white border-[#121316]'
                          : 'bg-white text-[#16171A]/75 border-[#E4DED2]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-[#16171A] uppercase tracking-wider text-[11px] mb-2">
                  Department
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`px-2 py-1 border text-[11px] cursor-pointer ${
                        gender === g
                          ? 'bg-[#121316] text-white border-[#121316]'
                          : 'bg-white text-[#16171A]/75 border-[#E4DED2]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-semibold uppercase tracking-wider">Max Price</span>
                  <span className="font-mono tabular-nums">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={6000}
                  step={250}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#121316] cursor-pointer"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-[11px] text-[#16171A]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySustainable}
                  onChange={(e) => setOnlySustainable(e.target.checked)}
                  className="accent-[#121316]"
                />
                <span>Sustainable Looms Only</span>
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="block text-[11px] uppercase tracking-wider text-[#9A8357] hover:underline cursor-pointer pt-1"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E4DED2] p-12 text-center space-y-3">
                <p className="font-display text-2xl font-medium text-[#16171A]">
                  No garments match these exact filters
                </p>
                <p className="text-xs text-[#16171A]/60">
                  Adjust fabric, category, or price ceiling to explore our full Jalandhar atelier stock.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#121316] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    revealDelay={(idx % 4) * 0.06}
                    onOpenProduct={onOpenProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <PromiseBar />
    </div>
  );
}
