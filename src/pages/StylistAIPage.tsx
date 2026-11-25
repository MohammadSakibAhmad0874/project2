import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Sparkles } from 'lucide-react';
import { Product, STYLIST_AVATAR_IMAGE } from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { suggestSize } from '@/src/lib/size-engine';
import { getLookForEvent } from '@/src/lib/stylist-engine';
import { ResilientImage } from '@/src/components/ResilientImage';
import { Reveal } from '@/src/components/Reveal';
import { TiltCard3D } from '@/src/components/TiltCard3D';
import { PromiseBar } from '@/src/components/PromiseBar';

interface StylistAIPageProps {
  onOpenProduct: (productId: string) => void;
  onOpenCreateLook: (query: string) => void;
}

const PALETTE_SWATCHES = [
  { name: 'Charcoal', hex: '#2E3238' },
  { name: 'Midnight Navy', hex: '#1E2A4A' },
  { name: 'Warm Sand', hex: '#CBB799' },
  { name: 'Raw Ivory', hex: '#F3EFE6' },
  { name: 'Slate Indigo', hex: '#5D6E7E' },
];

const QUICK_CHIPS = [
  'Shaadi ke liye',
  'Office ke liye',
  'Date ke liye',
  'College fest',
];

export function StylistAIPage({ onOpenProduct, onOpenCreateLook }: StylistAIPageProps) {
  const { catalog, addBundleToCart } = useStore();

  // Body Metrics & Color Profile state (Col 1)
  const [selectedSwatch, setSelectedSwatch] = useState(PALETTE_SWATCHES[1].name);
  const [chestIn, setChestIn] = useState(39);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);

  const fitSummary = useMemo(
    () => suggestSize(chestIn, heightCm, weightKg, catalog[0].sizeRun),
    [chestIn, heightCm, weightKg, catalog]
  );

  // Hinglish Stylist Chat state
  const [activeQuery, setActiveQuery] = useState('Office ke liye');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; sender: 'ai' | 'user'; text: string }[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Sat Sri Akal! Main hoon aapka Personal Style Guide. Niche body metrics update karein ya occasion batayein — Shaadi, Office, Date, ya College fest!',
    },
  ]);

  const currentLook = useMemo(
    () => getLookForEvent(activeQuery, catalog),
    [activeQuery, catalog]
  );

  // Col 2: 2x2 Key Wardrobe Gaps & Recommendations
  const wardrobeGaps: { role: string; product: Product; rationale: string }[] = [
    {
      role: 'Refined Blazer',
      product: catalog.find((p) => p.id === 'charcoal-wool-blazer') ?? catalog[9],
      rationale: 'The foundation piece for day-to-evening elegance.',
    },
    {
      role: 'Essential Shirt',
      product: catalog.find((p) => p.id === 'aura-oxford-shirt') ?? catalog[0],
      rationale: 'Double-twisted Supima cotton staple for any occasion.',
    },
    {
      role: 'Tailored Chinos',
      product: catalog.find((p) => p.id === 'sand-chino-trousers') ?? catalog[6],
      rationale: 'Effortless comfort meets pleated Jalandhar tailoring.',
    },
    {
      role: 'Statement Layer',
      product: catalog.find((p) => p.id === 'ivory-utility-overshirt') ?? catalog[10],
      rationale: 'Structured 310 GSM twill for warm-to-breezy evenings.',
    },
  ];

  // Col 3: Interactive Build an Outfit slots
  const [topIdx, setTopIdx] = useState(0);
  const [bottomIdx, setBottomIdx] = useState(0);
  const [outerIdx, setOuterIdx] = useState(0);
  const [shoeIdx, setShoeIdx] = useState(0);

  const topOptions = catalog.filter((p) => p.category === 'Shirts' || p.category === 'Kurtas' || p.category === 'Tops & Dresses');
  const bottomOptions = catalog.filter((p) => p.category === 'Trousers');
  const outerOptions = catalog.filter((p) => p.category === 'Outerwear');
  const shoeOptions = catalog.filter((p) => p.category === 'Footwear' || p.category === 'Accessories');

  const chosenTop = topOptions[topIdx % Math.max(1, topOptions.length)] ?? catalog[0];
  const chosenBottom = bottomOptions[bottomIdx % Math.max(1, bottomOptions.length)] ?? catalog[6];
  const chosenOuter = outerOptions[outerIdx % Math.max(1, outerOptions.length)] ?? catalog[9];
  const chosenShoe = shoeOptions[shoeIdx % Math.max(1, shoeOptions.length)] ?? catalog[7];

  const handleSendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
    const look = getLookForEvent(trimmed, catalog);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: trimmed },
      {
        id: `a-${Date.now() + 1}`,
        sender: 'ai',
        text: `${look.stylistReplyHinglish} (Color Rule: ${look.colorRule})`,
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
        <Reveal className="text-center space-y-2" y={18}>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] uppercase tracking-[0.14em] font-normal text-[#16171A]">
            Your Personal Wardrobe Analysis
          </h1>
          <p className="text-xs text-[#16171A]/60 tracking-wide">
            Style Archetype · Body Fit Telemetry · Hinglish Occasion Stylist
          </p>
        </Reveal>

        {/* 3-Column Studio Grid matching Image 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: 1. Your Style Profile */}
          <section className="lg:col-span-3 space-y-6 bg-white border border-[#E4E0D8] p-5">
            <h2 className="text-sm font-semibold text-[#1C1E22]">
              1. Your Style Profile
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C8BFA8] shrink-0">
                <ResilientImage
                  src={STYLIST_AVATAR_IMAGE}
                  alt="Style profile avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C1E22]">
                  Welcome, Atelier Guest
                </p>
                <p className="text-[11px] text-[#7D6B48]">Jalandhar Member</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-[#1C1E22]">
                Style Archetype: The Modern Minimalist
              </p>
              <p className="text-[#1C1E22]/70 leading-relaxed">
                Clean lines, breathable Supima & European flax, and versatile tailored separates
                define your wardrobe.
              </p>
            </div>

            {/* Color Palette Swatches */}
            <div className="space-y-2 pt-2 border-t border-[#E4E0D8]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1C1E22]">Color Palette</span>
                <span className="text-[11px] text-[#7D6B48]">{selectedSwatch}</span>
              </div>
              <div className="flex items-center gap-2">
                {PALETTE_SWATCHES.map((sw) => (
                  <button
                    key={sw.name}
                    type="button"
                    onClick={() => setSelectedSwatch(sw.name)}
                    aria-label={`Choose palette ${sw.name}`}
                    className={`w-7 h-7 rounded-full border cursor-pointer transition-transform ${
                      selectedSwatch === sw.name
                        ? 'ring-2 ring-[#1D2025] ring-offset-2 scale-105'
                        : 'border-[#C8BFA8]'
                    }`}
                    style={{ backgroundColor: sw.hex }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-[#1C1E22]/65">
                Colors calibrated for warm daylight & evening courtyard lighting.
              </p>
            </div>

            {/* Body Metrics Summary (Interactive size-engine.ts) */}
            <div className="space-y-3 pt-2 border-t border-[#E4E0D8]">
              <p className="text-xs font-semibold text-[#1C1E22]">
                Body Metrics Summary
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] uppercase text-[#1C1E22]/55 mb-1">
                    Chest (in)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={54}
                    value={chestIn}
                    onChange={(e) => setChestIn(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-[#E4E0D8] text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#1C1E22]/55 mb-1">
                    Ht (cm)
                  </label>
                  <input
                    type="number"
                    min={140}
                    max={210}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-[#E4E0D8] text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#1C1E22]/55 mb-1">
                    Wt (kg)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={140}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-[#E4E0D8] text-xs font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#EFECE6] border border-[#E4E0D8] text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Fit Focus: Size {fitSummary.size}</span>
                  <span className="font-mono text-[#7D6B48]">
                    {fitSummary.confidence}%
                  </span>
                </div>
                <p className="text-[11px] text-[#1C1E22]/75">
                  {fitSummary.fit} Fit · {fitSummary.note}
                </p>
              </div>
            </div>
          </section>

          {/* COLUMN 2: 2. Key Wardrobe Gaps & Recommendations */}
          <section className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1C1E22]">
              2. Key Wardrobe Gaps & Recommendations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wardrobeGaps.map((gap, idx) => (
                <Reveal key={gap.role} delay={idx * 0.07} y={20} className="h-full">
                  <TiltCard3D intensity={5} glareOpacity={0.11} className="h-full">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(gap.product.id)}
                      className="w-full h-full group text-left bg-white border border-[#E4DED2] hover:border-[#C4B494] p-4 space-y-3 transition-colors cursor-pointer shadow-editorial"
                    >
                      <div className="aspect-[4/3] bg-[#EFEAE0] overflow-hidden">
                        <ResilientImage
                          src={gap.product.media.front}
                          alt={gap.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#16171A]">
                          {gap.role}
                        </p>
                        <p className="text-[11px] text-[#16171A]/65 mt-0.5 leading-relaxed">
                          {gap.rationale}
                        </p>
                        <p className="text-xs font-mono tabular-nums text-[#9A8357] mt-1.5">
                          {formatINR(gap.product.priceINR)}
                        </p>
                      </div>
                    </button>
                  </TiltCard3D>
                </Reveal>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addBundleToCart(wardrobeGaps.map((g) => g.product), fitSummary.size)}
              className="w-full py-3 bg-[#23262B] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#14161A] transition-colors cursor-pointer"
            >
              Shop Recommendations (Size {fitSummary.size})
            </button>
          </section>

          {/* COLUMN 3: 3. Build an Outfit (Image 5 Right) */}
          <section className="lg:col-span-4 space-y-4 bg-white border border-[#E4E0D8] p-5">
            <h2 className="text-sm font-semibold text-[#1C1E22]">
              3. Build an Outfit
            </h2>

            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Slot Pickers */}
              <div className="col-span-5 space-y-3">
                {[
                  { label: 'Tops', item: chosenTop, onNext: () => setTopIdx((i) => i + 1) },
                  { label: 'Bottoms', item: chosenBottom, onNext: () => setBottomIdx((i) => i + 1) },
                  { label: 'Outerwear', item: chosenOuter, onNext: () => setOuterIdx((i) => i + 1) },
                  { label: 'Shoes', item: chosenShoe, onNext: () => setShoeIdx((i) => i + 1) },
                ].map((slot) => (
                  <div key={slot.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#1C1E22]/75">{slot.label}</span>
                      <button
                        type="button"
                        onClick={slot.onNext}
                        className="text-[#7D6B48] hover:underline cursor-pointer"
                      >
                        Swap
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenProduct(slot.item.id)}
                      className="w-full flex items-center gap-2 p-1.5 border border-[#E4E0D8] bg-[#FAF9F6] hover:border-[#1D2025] cursor-pointer"
                    >
                      <div className="w-9 h-10 bg-[#EFECE6] overflow-hidden shrink-0">
                        <ResilientImage
                          src={slot.item.media.front}
                          alt={slot.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[#1C1E22] line-clamp-2 text-left">
                        {slot.item.name}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Outfit Preview Card with Rotate Hint */}
              <div className="col-span-7 space-y-3">
                <div className="relative aspect-[3/4] bg-[#EFECE6] border border-[#C8BFA8] overflow-hidden">
                  <ResilientImage
                    src={chosenOuter.media.front}
                    alt="Built outfit preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-2 bottom-2 bg-[#FAF9F6]/92 border border-[#E4E0D8] px-2.5 py-1.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOuterIdx((i) => Math.max(0, i - 1))}
                      aria-label="Previous look"
                      className="p-0.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono tabular-nums uppercase tracking-wider">
                      {formatINR(
                        chosenTop.priceINR +
                          chosenBottom.priceINR +
                          chosenOuter.priceINR +
                          chosenShoe.priceINR
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOuterIdx((i) => i + 1)}
                      aria-label="Next look"
                      className="p-0.5 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCreateLook(activeQuery)}
                  className="w-full py-2.5 bg-[#23262B] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#14161A] cursor-pointer"
                >
                  Open in Create Look Studio
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Hinglish Conversational StylistAI Section */}
        <Reveal y={24}>
          <section className="bg-[#121316] text-[#F7F4EE] rounded-[12px] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#C8BFA8]">
              <Sparkles className="w-4 h-4" />
              <span>Hinglish StylistAI Concierge</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-[10px] text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C8BFA8] text-[#1D2025] ml-10 font-medium'
                      : 'bg-white/8 text-[#F8F7F4] mr-10 border border-white/10'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChat(chip)}
                  className="px-3 py-1.5 rounded-full border border-[#C8BFA8]/40 text-xs text-[#C8BFA8] hover:bg-[#C8BFA8] hover:text-[#1D2025] transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type event (e.g. Shaadi hai, Office party)..."
                className="flex-1 px-4 py-2.5 rounded-[8px] bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#C8BFA8]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-[8px] bg-[#C8BFA8] text-[#1D2025] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>

          {/* Right Mini Recommendation Summary */}
          <div className="lg:col-span-5 bg-white/6 border border-white/10 rounded-[10px] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#C8BFA8]">
                {currentLook.title}
              </span>
              <span className="font-mono text-sm tabular-nums font-semibold">
                {formatINR(currentLook.totalINR)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                currentLook.items.upper,
                currentLook.items.lower,
                currentLook.items.footwear,
                currentLook.items.accessory,
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenProduct(item.id)}
                  className="aspect-[3/4] overflow-hidden bg-[#141619] border border-white/10 cursor-pointer"
                >
                  <ResilientImage
                    src={item.media.front}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                addBundleToCart(
                  [
                    currentLook.items.upper,
                    currentLook.items.lower,
                    currentLook.items.footwear,
                    currentLook.items.accessory,
                  ],
                  fitSummary.size
                )
              }
              className="w-full py-2.5 rounded-[8px] bg-[#F5F2EB] text-[#1D2025] text-xs uppercase tracking-wider font-semibold hover:bg-white cursor-pointer"
            >
              Shop Event Look (Size {fitSummary.size})
            </button>
          </div>
        </section>
        </Reveal>
      </div>

      <PromiseBar />
    </div>
  );
}
