import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, Check, Heart, Ruler, Star } from 'lucide-react';
import { SIZE_ORDER, SizeKey } from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { SizeRecommendation, suggestSize } from '@/src/lib/size-engine';
import { AngleKey, Photo360Viewer } from '@/src/components/Photo360Viewer';
import { MacroFabricZoom } from '@/src/components/MacroFabricZoom';
import { ResilientImage } from '@/src/components/ResilientImage';
import { TiltCard3D } from '@/src/components/TiltCard3D';
import { Reveal } from '@/src/components/Reveal';
import { MagneticButton } from '@/src/components/MagneticButton';
import { PromiseBar } from '@/src/components/PromiseBar';

interface ProductDetailPageProps {
  productId: string;
  onBackToShop: () => void;
  onOpenProduct: (productId: string) => void;
}

export function ProductDetailPage({
  productId,
  onBackToShop,
  onOpenProduct,
}: ProductDetailPageProps) {
  const { catalog, addToCart, wishlist, toggleWishlist, showToast } = useStore();
  const stageRef = useRef<HTMLDivElement | null>(null);

  const product = catalog.find((p) => p.id === productId) ?? catalog[0];

  const [viewMode, setViewMode] = useState<'360' | 'macro'>('360');
  const [activeAngle, setActiveAngle] = useState<AngleKey>('front');
  const [selectedSize, setSelectedSize] = useState<SizeKey>('M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [showSizeFinder, setShowSizeFinder] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [chestIn, setChestIn] = useState<number>(39);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [sizeSuggestion, setSizeSuggestion] = useState<SizeRecommendation | null>(null);

  const { scrollYProgress: pdpScroll } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  });

  const breadcrumbY = useTransform(pdpScroll, [0, 1], [0, -10]);
  const headerTitleY = useTransform(pdpScroll, [0, 1], [0, -16]);
  const headerOpacity = useTransform(pdpScroll, [0, 0.8], [1, 0.88]);
  const stageParallaxY = useTransform(pdpScroll, [0, 1], [0, -28]);

  useEffect(() => {
    setViewMode('360');
    setActiveAngle('front');
    setSelectedColorIndex(0);
    setSizeSuggestion(null);
    setAddedFeedback(false);
  }, [product.id]);

  const activeColor = product.colors[selectedColorIndex] ?? product.colors[0];
  const isWishlisted = wishlist.includes(product.id);
  const crossSellProducts = catalog.filter((p) => product.crossSellIds.includes(p.id)).slice(0, 3);
  const stockCount = product.stockBySize[selectedSize] ?? 0;

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const result = suggestSize(chestIn, heightCm, weightKg, product.sizeRun);
    setSizeSuggestion(result);
    setSelectedSize(result.size);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      shopName: product.shopName,
      image: product.media.front,
      priceINR: product.priceINR,
      size: selectedSize,
      colorName: activeColor?.name ?? 'Default',
    });
    setAddedFeedback(true);
    showToast(`${product.name} (Size ${selectedSize}) added to bag`);
    window.setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      <div
        ref={stageRef}
        className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12"
      >
        <motion.div
          style={{ y: breadcrumbY }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4DED2] pb-4 will-change-transform"
        >
          <MagneticButton
            strength={0.25}
            maxOffset={5}
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#16171A]/75 hover:text-[#16171A] cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </MagneticButton>

          <p className="text-xs text-[#16171A]/60">
            {product.shopName} · {product.locality} ·{' '}
            <span className="font-mono">{product.sku}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Real Photo 360° Studio Viewer & 10x Macro Fabric Lens */}
          <motion.div
            style={{ y: stageParallaxY }}
            className="lg:col-span-6 lg:sticky lg:top-24 space-y-4 will-change-transform"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex border border-[#DED7C8] bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('360')}
                  className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    viewMode === '360'
                      ? 'bg-[#0B0C10] text-white'
                      : 'text-[#16181D]/70 hover:text-[#16181D]'
                  }`}
                >
                  360° Studio Photos
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('macro')}
                  className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    viewMode === 'macro'
                      ? 'bg-[#0B0C10] text-white'
                      : 'text-[#16181D]/70 hover:text-[#16181D]'
                  }`}
                >
                  10x Macro Weave
                </button>
              </div>

              <span className="text-[11px] text-[#16181D]/55">
                {viewMode === '360' ? 'Drag photo to rotate' : 'Hover weave for 10x lens'}
              </span>
            </div>

            {viewMode === '360' ? (
              <Photo360Viewer
                product={product}
                activeAngle={activeAngle}
                onSelectAngle={(angle) => {
                  setActiveAngle(angle);
                  setViewMode('360');
                }}
                onFocusMacro={() => setViewMode('macro')}
              />
            ) : (
              <div className="space-y-3">
                <MacroFabricZoom
                  product={product}
                  selectedColorHex={activeColor?.hex}
                  highlighted={false}
                />
                <button
                  type="button"
                  onClick={() => setViewMode('360')}
                  className="text-xs uppercase tracking-wider text-[#16181D] underline underline-offset-4 cursor-pointer"
                >
                  ← Return to 360° Garment Views
                </button>
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Tailor's Story & Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              style={{ y: headerTitleY, opacity: headerOpacity }}
              className="space-y-1.5 border-b border-[#DED7C8] pb-5 will-change-transform"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9A8357] font-medium">
                {product.shopName} · {product.category}
              </p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#16181D]">
                  {product.name}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to Wishlist"
                  className="p-2 border border-[#DED7C8] bg-white hover:border-[#0B0C10] cursor-pointer shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#0B0C10] text-[#0B0C10]' : 'text-[#16181D]'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-3 tabular-nums">
                  <span className="text-xl font-mono font-medium text-[#16181D]">
                    {formatINR(product.priceINR)}
                  </span>
                  {product.mrpINR > product.priceINR && (
                    <span className="text-sm font-mono text-[#16181D]/45 line-through">
                      {formatINR(product.mrpINR)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-[#16181D]/75 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#9C8456] text-[#9C8456]" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[#16181D]/45">({product.reviewCount})</span>
                </div>
              </div>
            </motion.div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-xs font-semibold text-[#16181D]/65">Fabric</span>
                  <span className="col-span-2 text-xs sm:text-sm text-[#16181D]">
                    {product.fabric} · {product.weave}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-xs font-semibold text-[#16181D]/65">Color</span>
                  <div className="col-span-2 space-y-2">
                    <span className="text-xs sm:text-sm text-[#16181D] block">
                      {activeColor?.name}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c, idx) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIndex(idx)}
                          aria-label={`Select color ${c.name}`}
                          className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                            idx === selectedColorIndex
                              ? 'ring-2 ring-[#0B0C10] ring-offset-2 border-[#0B0C10]'
                              : 'border-[#C9B382]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-xs font-semibold text-[#16181D]/65">Tailor’s Note</span>
                  <span className="col-span-2 text-xs sm:text-sm text-[#16181D]">
                    {product.fitType ?? 'Tailored'} Fit ·{' '}
                    <span className="text-[#7D6B48]">“{product.shopkeeperNote}”</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-xs font-semibold text-[#16181D]/65">Story</span>
                  <p className="col-span-2 text-xs sm:text-sm leading-relaxed text-[#16181D]/80">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#DED7C8]">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#16181D]/65 block">
                      Size Selector
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart((p) => !p)}
                      className="text-[11px] text-[#7D6B48] underline underline-offset-2 cursor-pointer"
                    >
                      {showSizeChart ? 'Hide Chart' : 'Size Chart'}
                    </button>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div className="grid grid-cols-5 gap-2">
                      {SIZE_ORDER.map((sz) => {
                        const isSelected = selectedSize === sz;
                        const available = (product.stockBySize[sz] ?? 0) > 0;
                        return (
                          <button
                            key={sz}
                            type="button"
                            disabled={!available}
                            onClick={() => setSelectedSize(sz)}
                            className={`py-2 text-xs font-medium border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#0B0C10] text-white border-[#0B0C10]'
                                : available
                                  ? 'bg-white text-[#16181D] border-[#DED7C8] hover:border-[#0B0C10]'
                                  : 'bg-[#EBE5D9] text-[#16181D]/30 border-[#DED7C8] line-through cursor-not-allowed'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#16181D]/55 tabular-nums">
                      {stockCount > 0
                        ? `${stockCount} pieces ready in ${product.locality}`
                        : `Out of stock in ${selectedSize}`}
                    </p>
                  </div>
                </div>
              </div>

              {showSizeChart && (
                <div className="border border-[#DED7C8] bg-white overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono tabular-nums">
                    <thead className="bg-[#EBE5D9] text-[#16181D]/70 border-b border-[#DED7C8]">
                      <tr>
                        <th className="py-2 px-3">Size</th>
                        <th className="py-2 px-3">Chest (in)</th>
                        <th className="py-2 px-3">Shoulder</th>
                        <th className="py-2 px-3">Length</th>
                        <th className="py-2 px-3">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DED7C8]">
                      {SIZE_ORDER.map((sz) => {
                        const m = product.sizeRun[sz];
                        return (
                          <tr
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`cursor-pointer ${
                              selectedSize === sz ? 'bg-[#EBE5D9]/70 font-semibold' : ''
                            }`}
                          >
                            <td className="py-1.5 px-3">{sz}</td>
                            <td className="py-1.5 px-3">{m.chest.toFixed(1)}</td>
                            <td className="py-1.5 px-3">{m.shoulder.toFixed(1)}</td>
                            <td className="py-1.5 px-3">{m.length.toFixed(1)}</td>
                            <td className="py-1.5 px-3">{m.sleeve.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="space-y-2.5 pt-2">
                <MagneticButton
                  strength={0.14}
                  maxOffset={6}
                  disabled={stockCount <= 0}
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-5 bg-[#121316] text-white text-xs sm:text-sm font-medium tracking-wider uppercase hover:bg-[#1E2028] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-[#D8C294]" />
                      <span>Added to Bag ✓</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </MagneticButton>

                <MagneticButton
                  strength={0.14}
                  maxOffset={6}
                  onClick={() => setShowSizeFinder((p) => !p)}
                  className="w-full py-3 px-5 bg-white border border-[#121316] text-[#16181D] text-xs sm:text-sm font-medium tracking-wider uppercase hover:bg-[#EBE5D9] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showSizeFinder ? 'Close AI Size Fitting' : 'Find My Size / AI Fit Match'}</span>
                </MagneticButton>
              </div>

              {showSizeFinder && (
                <form
                  onSubmit={handleCalculateSize}
                  className="p-4 bg-[#EBE5D9] border border-[#DED7C8] space-y-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#16181D]">
                    AI Bespoke Size Recommendation
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] uppercase text-[#16181D]/65 mb-1">
                        Chest (in)
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={54}
                        value={chestIn}
                        onChange={(e) => setChestIn(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#DED7C8] text-xs font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#16181D]/65 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        min={140}
                        max={210}
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#DED7C8] text-xs font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#16181D]/65 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min={40}
                        max={140}
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#DED7C8] text-xs font-mono tabular-nums"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0B0C10] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                  >
                    Compute My Fit
                  </button>
                  {sizeSuggestion && (
                    <div className="p-3 bg-white border border-[#C9B382] space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>
                          Suggested: Size {sizeSuggestion.size} ({sizeSuggestion.fit} Fit)
                        </span>
                        <span className="font-mono text-[#7D6B48]">
                          {sizeSuggestion.confidence}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-[#16181D]/75">{sizeSuggestion.note}</p>
                    </div>
                  )}
                </form>
              )}

            {crossSellProducts.length > 0 && (
              <Reveal y={18} className="pt-4 border-t border-[#DED7C8] space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#16181D]">
                  Complete the Look
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {crossSellProducts.map((item, cIdx) => (
                    <Reveal key={item.id} delay={cIdx * 0.07} y={16}>
                      <TiltCard3D intensity={5} glareOpacity={0.12}>
                        <button
                          type="button"
                          onClick={() => onOpenProduct(item.id)}
                          className="w-full group text-left bg-[#EBE5D9] border border-[#DED7C8] hover:border-[#C9B382] p-1.5 cursor-pointer transition-colors"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-[#DFDCD4]">
                            <ResilientImage
                              src={item.media.front}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="text-[11px] font-medium text-[#16181D] truncate mt-1.5">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-mono tabular-nums text-[#7D6B48]">
                            {formatINR(item.priceINR)}
                          </p>
                        </button>
                      </TiltCard3D>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            )}
            </div>
          </div>
        </div>

      <PromiseBar />
    </div>
  );
}
