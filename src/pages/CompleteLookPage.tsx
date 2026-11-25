import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Send, ShoppingBag, Sparkles } from 'lucide-react';
import {
  EVENT_BOARDS,
  LUXURY_HERO_IMAGE,
  Product,
  SIZE_ORDER,
  STYLIST_AVATAR_IMAGE,
  SizeKey,
} from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { buildCompleteLooks, getLookForEvent } from '@/src/lib/stylist-engine';
import { ResilientImage } from '@/src/components/ResilientImage';
import { StoryCanvas3D, StoryScrollState } from '@/src/components/StoryCanvas3D';
import { TiltCard3D } from '@/src/components/TiltCard3D';
import { Reveal } from '@/src/components/Reveal';
import { PromiseBar } from '@/src/components/PromiseBar';

interface CompleteLookPageProps {
  onOpenProduct: (productId: string) => void;
  initialEventQuery?: string;
}

type SlotKey = 'upper' | 'lower' | 'footwear' | 'accessory';

export function CompleteLookPage({
  onOpenProduct,
  initialEventQuery = 'Office ke liye',
}: CompleteLookPageProps) {
  const { catalog, addBundleToCart, addToCart, saveOutfit, showToast } = useStore();
  const scrollStateRef = useRef<StoryScrollState>({
    progress: 0.35,
    chapter: 2,
  });

  const [eventInput, setEventInput] = useState('');
  const [activeLook, setActiveLook] = useState(() =>
    getLookForEvent(initialEventQuery, catalog)
  );
  const [focusedSlot, setFocusedSlot] = useState<SlotKey>('upper');
  const [selectedSize, setSelectedSize] = useState<SizeKey>('M');
  const [assistantMessage, setAssistantMessage] = useState(
    () => getLookForEvent(initialEventQuery, catalog).stylistReplyHinglish
  );

  const curatedLooks = useMemo(() => buildCompleteLooks(catalog), [catalog]);

  const slotEntries: { slot: SlotKey; label: string; product: Product }[] = [
    { slot: 'upper', label: 'Upper', product: activeLook.items.upper },
    { slot: 'lower', label: 'Lower', product: activeLook.items.lower },
    { slot: 'footwear', label: 'Footwear', product: activeLook.items.footwear },
    { slot: 'accessory', label: 'Accessory', product: activeLook.items.accessory },
  ];

  const focusedProduct = activeLook.items[focusedSlot];

  const handleApplyEvent = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const nextLook = getLookForEvent(trimmed, catalog);
    setActiveLook(nextLook);
    setAssistantMessage(nextLook.stylistReplyHinglish);
    scrollStateRef.current.progress = (scrollStateRef.current.progress + 0.25) % 1;
    setEventInput('');
  };

  return (
    <div className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      {/* 3-Panel Atelier Studio layered over Sculptural Silk Backdrop */}
      <section className="relative overflow-hidden bg-[#121316] text-[#F7F4EE] border-b border-[#2A2C32] py-8 sm:py-10">
        <div className="absolute inset-0 z-0">
          <StoryCanvas3D scrollStateRef={scrollStateRef} variant="banner" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#121316]/72" />
        </div>
        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Quick Occasion Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#D8C294] font-semibold">
                Create Look · 3D Styling Atelier
              </p>
              <h1 className="font-display text-2xl sm:text-4xl font-normal tracking-wide text-[#F6F2EA]">
                {activeLook.title} — {activeLook.eventLabel}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {EVENT_BOARDS.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => handleApplyEvent(ev.queryTrigger)}
                  className={`px-3.5 py-1.5 text-xs border transition-colors cursor-pointer whitespace-nowrap ${
                    activeLook.eventLabel.toLowerCase().includes(ev.title.split(' ')[0].toLowerCase()) ||
                    assistantMessage.includes(ev.title)
                      ? 'bg-[#D8C294] text-[#0B0C10] border-[#D8C294] font-semibold'
                      : 'bg-[#14161C] text-[#F6F2EA] border-[#C9B382]/35 hover:border-[#D8C294]'
                  }`}
                >
                  {ev.title}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Panel Grid matching Image 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT DARK PANEL: AI Personalization Assistant (#22252A) */}
            <aside className="lg:col-span-4 bg-[#22252A] text-[#F8F7F4] rounded-[12px] p-5 flex flex-col justify-between gap-4 shadow-atelier">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-medium tracking-wide">
                    AI Personalization Assistant
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C8BFA8]" />
                </div>

                {/* Stylist Prompt Bubble + Avatar */}
                <div className="flex gap-3 items-start bg-white/5 border border-white/10 rounded-[10px] p-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C8BFA8]/50 shrink-0">
                    <ResilientImage
                      src={STYLIST_AVATAR_IMAGE}
                      alt="Stylist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs leading-relaxed text-[#F8F7F4]/90">
                      {assistantMessage}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[#C8BFA8] text-[#1D2025] font-semibold rounded">
                      {activeLook.colorRule}
                    </span>
                  </div>
                </div>

                {/* 4 Outfit Slots List */}
                <div className="space-y-2">
                  {slotEntries.map(({ slot, label, product }) => {
                    const isActive = focusedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFocusedSlot(slot)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-[10px] border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white/12 border-[#C8BFA8]'
                            : 'bg-white/4 border-white/10 hover:bg-white/8'
                        }`}
                      >
                        <div className="w-11 h-12 rounded bg-[#1D2025] overflow-hidden shrink-0">
                          <ResilientImage
                            src={product.media.front}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-[#C8BFA8]">
                            {label}
                          </p>
                          <p className="text-xs font-medium text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] font-mono tabular-nums text-white/65">
                            {formatINR(product.priceINR)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/45 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hinglish Query Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyEvent(eventInput);
                }}
                className="flex gap-2 pt-2 border-t border-white/10"
              >
                <input
                  type="text"
                  value={eventInput}
                  onChange={(e) => setEventInput(e.target.value)}
                  placeholder="Ask e.g. Shaadi hai, Office party..."
                  aria-label="Ask styling assistant"
                  className="flex-1 px-3 py-2 rounded-[8px] bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#C8BFA8]"
                />
                <button
                  type="submit"
                  aria-label="Send styling query"
                  className="px-3 py-2 rounded-[8px] bg-[#C8BFA8] text-[#1D2025] hover:bg-[#d8d0bc] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </aside>

            {/* CENTER STAGE: Editorial Showcase + Outfit Callout Breakdown (Image 1 Center) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <div className="relative flex-1 min-h-[430px] rounded-[12px] overflow-hidden border border-[#C8BFA8] bg-[#1D2025]">
                <ResilientImage
                  src={LUXURY_HERO_IMAGE}
                  alt="Studio look visualization"
                  className="w-full h-full object-cover opacity-90"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#1D2025] via-transparent to-transparent"
                />

                {/* Interactive Callout Overlay displaying the active 4 pieces */}
                <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2">
                  {slotEntries.map(({ slot, label, product }) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFocusedSlot(slot)}
                      className={`p-2 rounded-[8px] border text-left transition-all cursor-pointer ${
                        focusedSlot === slot
                          ? 'bg-[#FAF9F6] text-[#1D2025] border-[#C8BFA8]'
                          : 'bg-[#1D2025]/85 text-white border-white/15 hover:bg-[#1D2025]'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider opacity-70 block">
                        {label}
                      </span>
                      <span className="text-[11px] font-medium line-clamp-1 block">
                        {product.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Switcher Bar */}
              <div className="bg-[#22252A] text-white rounded-[10px] px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="text-white/70">Outfit Total</span>
                <span className="font-mono tabular-nums font-semibold text-[#C8BFA8]">
                  {formatINR(activeLook.totalINR)}
                </span>
              </div>
            </div>

            {/* RIGHT DARK PANEL: Product Panel + Macro Fabric Zoom Swatch (Image 1 Right) */}
            <aside className="lg:col-span-4 bg-[#22252A] text-[#F8F7F4] rounded-[12px] p-5 flex flex-col justify-between gap-4 shadow-atelier">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C8BFA8] block">
                      Product Panel
                    </span>
                    <h2 className="font-display text-xl font-medium text-white">
                      {focusedProduct.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenProduct(focusedProduct.id)}
                    className="text-[11px] text-[#C8BFA8] underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    Full 360° PDP
                  </button>
                </div>

                {/* Selected Item Card */}
                <div className="flex gap-3.5 items-center bg-white/5 border border-white/10 rounded-[10px] p-3">
                  <div className="w-16 h-20 rounded overflow-hidden bg-[#1D2025] shrink-0">
                    <ResilientImage
                      src={focusedProduct.media.front}
                      alt={focusedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-white/75">{focusedProduct.shopName}</p>
                    <p className="text-sm font-mono tabular-nums font-semibold text-[#C8BFA8]">
                      {formatINR(focusedProduct.priceINR)}
                    </p>
                    <p className="text-[11px] text-white/60 line-clamp-2">
                      {focusedProduct.fabric}
                    </p>
                  </div>
                </div>

                {/* Live Macro Fabric Swatch (Matching Image 1 Right Panel "Macro Zoom") */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="uppercase tracking-wider text-white/70">
                      Macro Fabric Weave
                    </span>
                    <span className="text-[#C8BFA8]">{focusedProduct.weave}</span>
                  </div>
                  <div
                    className="h-24 rounded-[10px] border border-white/15 relative overflow-hidden"
                    style={{
                      backgroundImage: `url("${focusedProduct.macroTexture || focusedProduct.media.front}")`,
                      backgroundSize: '260%',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div
                      className="absolute inset-0 mix-blend-multiply opacity-20"
                      style={{ backgroundColor: focusedProduct.macroTintHex }}
                    />
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Select Size for Bundle
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SIZE_ORDER.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`py-1.5 text-xs font-medium rounded border cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#C8BFA8] text-[#1D2025] border-[#C8BFA8] font-semibold'
                            : 'bg-white/5 text-white border-white/15 hover:border-white/40'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bundle CTAs */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    addBundleToCart(
                      [
                        activeLook.items.upper,
                        activeLook.items.lower,
                        activeLook.items.footwear,
                        activeLook.items.accessory,
                      ],
                      selectedSize
                    )
                  }
                  className="w-full py-3 px-4 rounded-[8px] bg-[#C8BFA8] text-[#1D2025] text-xs uppercase tracking-[0.14em] font-semibold hover:bg-[#d8d0bc] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Look · {formatINR(activeLook.totalINR)}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        productId: focusedProduct.id,
                        name: focusedProduct.name,
                        shopName: focusedProduct.shopName,
                        image: focusedProduct.media.front,
                        priceINR: focusedProduct.priceINR,
                        size: selectedSize,
                        colorName: focusedProduct.colors[0]?.name ?? 'Classic',
                      });
                      showToast(`${focusedProduct.name} added to bag`);
                    }}
                    className="py-2 rounded-[8px] border border-white/20 text-[11px] text-white hover:bg-white/10 cursor-pointer"
                  >
                    Add This Piece
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      saveOutfit({
                        id: `${activeLook.id}-${Date.now()}`,
                        title: activeLook.title,
                        colorRule: activeLook.colorRule,
                        totalINR: activeLook.totalINR,
                        itemIds: slotEntries.map((s) => s.product.id),
                      })
                    }
                    className="py-2 rounded-[8px] border border-white/20 text-[11px] text-white hover:bg-white/10 cursor-pointer"
                  >
                    Save to Wardrobe
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Curated 3-Look Combinations Strip */}
      <section className="bg-[#F7F4EE] text-[#16171A] py-14">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal y={18}>
            <p className="text-xs uppercase tracking-[0.18em] text-[#9A8357] font-semibold">
              Ready-To-Wear Combinations
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#16171A] mt-1">
              Signature Jalandhar Lookbooks
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedLooks.map((look, lIdx) => (
              <Reveal key={look.id} delay={lIdx * 0.08} y={24} className="h-full">
                <TiltCard3D intensity={5} glareOpacity={0.11} className="h-full">
                  <div className="bg-white border border-[#E4DED2] hover:border-[#C4B494] transition-colors p-5 flex flex-col justify-between gap-4 h-full shadow-editorial">
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-display text-xl font-medium text-[#16171A]">
                          {look.title}
                        </h3>
                        <span className="font-mono text-xs tabular-nums text-[#9A8357]">
                          {formatINR(look.totalINR)}
                        </span>
                      </div>
                      <p className="text-xs text-[#16171A]/65">{look.reason}</p>

                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {[look.items.upper, look.items.lower, look.items.footwear, look.items.accessory].map(
                          (item, idx) => (
                            <button
                              key={`${look.id}-${idx}`}
                              type="button"
                              onClick={() => onOpenProduct(item.id)}
                              className="aspect-[3/4] bg-[#EFEAE0] border border-[#E4DED2] overflow-hidden cursor-pointer"
                            >
                              <ResilientImage
                                src={item.media.front}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4DED2]">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLook(look);
                          setAssistantMessage(look.stylistReplyHinglish);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2 border border-[#121316] text-xs font-medium text-[#16171A] hover:bg-[#EFEAE0] cursor-pointer"
                      >
                        Load in Studio
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addBundleToCart([
                            look.items.upper,
                            look.items.lower,
                            look.items.footwear,
                            look.items.accessory,
                          ])
                        }
                        className="py-2 bg-[#121316] text-white text-xs font-medium hover:bg-[#23252C] cursor-pointer"
                      >
                        Add Bundle
                      </button>
                    </div>
                  </div>
                </TiltCard3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PromiseBar />
    </div>
  );
}
