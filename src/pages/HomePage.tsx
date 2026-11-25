import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { ArrowRight, Eye } from 'lucide-react';
import {
  EVENT_BOARDS,
  HERO_EDITORIAL_IMAGE,
  LUXURY_HERO_IMAGE,
  STYLIST_AVATAR_IMAGE,
} from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { ResilientImage } from '@/src/components/ResilientImage';
import { StoryCanvas3D, StoryScrollState } from '@/src/components/StoryCanvas3D';
import { TiltCard3D } from '@/src/components/TiltCard3D';
import { ProductCard } from '@/src/components/ProductCard';
import { EDITORIAL_EASE } from '@/src/components/Reveal';
import { MagneticButton } from '@/src/components/MagneticButton';
import { MagneticScrollSection } from '@/src/components/MagneticScrollSection';
import { PromiseBar } from '@/src/components/PromiseBar';
import { AppRoute } from '@/src/components/Navbar';

const CHAPTERS = [
  { id: 'act-hero', label: '01 Showcase' },
  { id: 'act-categories', label: '02 Departments' },
  { id: 'act-craft', label: '03 Ateliers' },
  { id: 'act-archive', label: '04 Materiality' },
  { id: 'act-signatures', label: '05 Signatures' },
  { id: 'act-occasions', label: '06 Occasions' },
];

const categoryGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const categoryCardVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: EDITORIAL_EASE,
    },
  },
};

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

const HOUSES = [
  {
    name: 'Model Town Looms',
    detail: 'Double-twisted Supima Oxford shirting & 310 GSM organic cavalry twill.',
    productId: 'aura-oxford-shirt',
  },
  {
    name: 'Rainak Bazaar Drapers',
    detail: 'Belgian flax handloom kurtas, Phulkari cotton-silk stoles & leather juttis.',
    productId: 'doaba-linen-kurta',
  },
  {
    name: 'Sadar Studio',
    detail: 'Yarn-dyed knit silhouettes, relaxed linen wrap blouses & pleated trousers.',
    productId: 'flax-wrap-blouse',
  },
  {
    name: 'GT Road Tailors',
    detail: 'Half-canvas tropical wool hopsack blazers & 13.5oz selvedge outerwear.',
    productId: 'charcoal-wool-blazer',
  },
];

const SHOP_CATEGORIES: {
  title: string;
  subtitle: string;
  image: string;
  route: AppRoute;
}[] = [
  {
    title: 'Women',
    subtitle: 'Flax Linen & Knit Silhouettes',
    image: '/src/assets/images/prod_linen_blouse_1794869262783.jpg',
    route: { page: 'shop', initialGender: 'Women' },
  },
  {
    title: 'Men',
    subtitle: 'Supima Oxford, Kurtas & Blazers',
    image: '/src/assets/images/oxford_shirt_front_1794869259031.jpg',
    route: { page: 'shop', initialGender: 'Men' },
  },
  {
    title: 'Accessories',
    subtitle: 'Bengal Jute Totes & Phulkari Stoles',
    image: '/src/assets/images/prod_jute_tote_1794869263353.jpg',
    route: { page: 'shop', initialCategory: 'Accessories' },
  },
  {
    title: 'Sustainable',
    subtitle: 'Handloom Flax & Organic Khadi',
    image: '/src/assets/images/prod_beige_kurta_1794869261317.jpg',
    route: { page: 'shop', initialSustainable: true },
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { catalog } = useStore();
  const [activeChapter, setActiveChapter] = useState(0);

  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const scrollStateRef = useRef<StoryScrollState>({
    progress: 0,
    chapter: 0,
  });

  const { scrollYProgress: pageScroll } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(pageScroll, 'change', (v) => {
    const idx = Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length));
    setActiveChapter(idx);
  });

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 42,
    stiffness: 300,
    mass: 0.7,
  });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(heroScroll, 'change', (v) => {
    scrollStateRef.current.progress = v;
  });

  // Differential scroll & scroll-velocity parallax:
  // Background responds fastest; text moves noticeably slower for cinematic depth
  const heroBgScrollY = useTransform(heroScroll, [0, 1], [0, -108]);
  const velocityBgOffset = useTransform(smoothVelocity, [-1800, 0, 1800], [26, 0, -26]);

  const heroCopyY = useTransform(heroScroll, [0, 1], [0, -28]);
  const velocityCopyLag = useTransform(smoothVelocity, [-1800, 0, 1800], [-10, 0, 10]);

  const heroPrimaryModelY = useTransform(heroScroll, [0, 1], [0, -82]);
  const heroPrimaryModelScale = useTransform(heroScroll, [0, 1], [1, 1.05]);
  const velocityModelShift = useTransform(smoothVelocity, [-1800, 0, 1800], [18, 0, -18]);
  const heroSecondaryModelY = useTransform(heroScroll, [0, 1], [16, -128]);

  const { scrollYProgress: spreadScroll } = useScroll({
    target: spreadRef,
    offset: ['start end', 'end start'],
  });

  const tallPlateY = useTransform(spreadScroll, [0, 1], [32, -32]);
  const insetPlateY = useTransform(spreadScroll, [0, 1], [-24, 24]);

  const macroSpecimens = [
    catalog.find((p) => p.id === 'aura-oxford-shirt') ?? catalog[0],
    catalog.find((p) => p.id === 'doaba-linen-kurta') ?? catalog[1],
    catalog.find((p) => p.id === 'braided-jute-tote') ?? catalog[5],
  ];

  const featuredGarments = catalog.slice(0, 4);

  const jumpToChapter = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={pageRef} className="relative bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      {/* Desktop Editorial Chapter Rail */}
      <aside
        aria-label="Editorial Chapters"
        className="hidden 2xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5 bg-[#F7F4EE]/85 backdrop-blur-sm border border-[#E4DED2] px-2.5 py-3 shadow-editorial"
      >
        {CHAPTERS.map((ch, idx) => {
          const active = activeChapter === idx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => jumpToChapter(ch.id)}
              title={ch.label}
              className={`group flex items-center gap-2 text-right transition-colors cursor-pointer ${
                active ? 'text-[#16171A]' : 'text-[#16171A]/35 hover:text-[#16171A]/80'
              }`}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.14em]">
                {ch.label.split(' ')[0]}
              </span>
              <span
                className={`block h-[1px] transition-all duration-300 ${
                  active ? 'w-5 bg-[#9A8357]' : 'w-2 bg-[#16171A]/25 group-hover:w-3.5'
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* =========================================================
          ACT I: ARCHITECTURAL ATELIER HERO STAGE (Scroll-Velocity Parallax)
         ========================================================= */}
      <section
        id="act-hero"
        ref={heroRef}
        className="snap-start scroll-mt-16 relative bg-[#111215] text-[#F7F4EE] overflow-hidden border-b border-[#2A2C32]"
      >
        <div className="relative max-w-[1440px] mx-auto min-h-[580px] lg:min-h-[630px] grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Live Architectural 3D Atelier Backdrop (Fastest Parallax Plane) */}
          <motion.div
            style={{ y: heroBgScrollY }}
            className="absolute -inset-y-12 inset-x-0 z-0 will-change-transform"
          >
            <motion.div
              style={{ y: velocityBgOffset }}
              className="w-full h-full will-change-transform"
            >
              <StoryCanvas3D scrollStateRef={scrollStateRef} variant="hero" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#121316]/90 via-[#121316]/55 to-[#121316]/45"
              />
            </motion.div>
          </motion.div>

          {/* Left Editorial Typography (Moves Slower Than Background for Deep Immersion) */}
          <motion.div
            style={{ y: heroCopyY }}
            className="relative z-10 lg:col-span-6 px-6 sm:px-12 lg:px-16 py-16 lg:py-20 will-change-transform"
          >
            <motion.div style={{ y: velocityCopyLag }} className="will-change-transform">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
                className="space-y-6"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#C4B494]">
                  Autumn / Winter & Summer Linen · Jalandhar Collective
                </p>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-[62px] font-normal leading-[1.03] tracking-[0.02em] text-[#F7F4EE]">
                  Woven in Jalandhar.
                  <span className="block italic text-[#D9C8A6] font-normal mt-1">
                    Tailored for Every Hour.
                  </span>
                </h1>

                <p className="text-sm sm:text-[15px] leading-relaxed text-[#F7F4EE]/75 max-w-md font-light">
                  Four independent tailoring ateliers across Model Town, Rainak Bazaar,
                  Sadar Studio, and GT Road — presented with real 360° photography and
                  10x optical fabric inspection.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <MagneticButton
                    strength={0.2}
                    maxOffset={7}
                    onClick={() => onNavigate({ page: 'shop' })}
                    className="px-7 py-3.5 bg-[#F7F4EE] text-[#121316] text-xs uppercase tracking-[0.18em] font-medium hover:bg-white transition-colors inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </MagneticButton>

                  <MagneticButton
                    strength={0.2}
                    maxOffset={7}
                    onClick={() => onNavigate({ page: 'looks' })}
                    className="px-6 py-3.5 border border-[#F7F4EE]/30 text-[#F7F4EE] text-xs uppercase tracking-[0.18em] font-normal hover:border-[#F7F4EE] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Look Studio
                  </MagneticButton>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Layered Featured Model Portraits with Scroll-Velocity Parallax */}
          <div className="relative z-10 lg:col-span-6 px-6 sm:px-12 lg:px-14 pb-14 lg:py-12 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] flex justify-end">
              {/* Secondary Featured Model Layer (Deeper Parallax Plane) */}
              <motion.div
                style={{ y: heroSecondaryModelY }}
                className="hidden sm:block absolute left-0 -bottom-4 w-[180px] lg:w-[200px] z-0 will-change-transform"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, delay: 0.24, ease: EDITORIAL_EASE }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({ page: 'product', productId: 'doaba-linen-kurta' })
                    }
                    className="w-full text-left bg-[#191A1F]/95 border border-[#C4B494]/30 p-2 shadow-atelier cursor-pointer block group"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-[#121316]">
                      <ResilientImage
                        src={HERO_EDITORIAL_IMAGE}
                        alt="Rainak Bazaar Doaba Linen Lookbook Model"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="pt-2 px-1 flex items-center justify-between text-[11px]">
                      <span className="text-[#F7F4EE]/85 truncate pr-2">
                        Doaba Linen Edit
                      </span>
                      <span className="font-mono text-[#C4B494] shrink-0">02</span>
                    </div>
                  </button>
                </motion.div>
              </motion.div>

              {/* Primary Featured Model Layer (Scroll-Velocity Parallax + Shared layoutId Morph) */}
              <motion.div
                style={{ y: heroPrimaryModelY, scale: heroPrimaryModelScale }}
                className="relative z-10 w-full max-w-[325px] xl:max-w-[345px] will-change-transform"
              >
                <motion.div style={{ y: velocityModelShift }} className="will-change-transform">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.85, delay: 0.14, ease: EDITORIAL_EASE }}
                  >
                    <TiltCard3D intensity={5} glareOpacity={0.14} hoverScale={1.018} className="w-full">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate({ page: 'product', productId: 'charcoal-wool-blazer' })
                        }
                        className="w-full text-left bg-[#191A1F] border border-[#C4B494]/40 p-2.5 shadow-atelier cursor-pointer block group"
                      >
                        <motion.div
                          layoutId="product-media-charcoal-wool-blazer"
                          transition={{ layout: { duration: 0.55, ease: EDITORIAL_EASE } }}
                          className="aspect-[3/4] overflow-hidden bg-[#121316]"
                        >
                          <ResilientImage
                            src={LUXURY_HERO_IMAGE}
                            alt="Sutlej Tropical Wool Blazer at Local Threads Jalandhar"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </motion.div>
                        <div className="pt-2.5 px-1 flex items-center justify-between text-xs">
                          <span className="font-display text-base text-[#F7F4EE]">
                            Sutlej Wool-Linen Blazer
                          </span>
                          <span className="font-mono text-[11px] text-[#C4B494]">
                            {formatINR(5499)}
                          </span>
                        </div>
                      </button>
                    </TiltCard3D>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ACT II: SHOP BY CATEGORY (Staggered Variants Reveal + Magnetic Dwell)
         ========================================================= */}
      <MagneticScrollSection id="act-categories">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
          className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-20 pb-8 space-y-8"
        >
          <div className="flex items-end justify-between gap-4 border-b border-[#E4DED2] pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
                Collections by Department
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#16171A] mt-1">
                Trending Categories
              </h2>
            </div>
            <MagneticButton
              strength={0.24}
              maxOffset={5}
              onClick={() => onNavigate({ page: 'shop' })}
              className="text-xs uppercase tracking-[0.16em] font-medium text-[#16171A] hover:text-[#9A8357] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              All Categories →
            </MagneticButton>
          </div>

          <motion.div
            variants={categoryGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SHOP_CATEGORIES.map((cat) => (
              <motion.div key={cat.title} variants={categoryCardVariants}>
                <TiltCard3D intensity={5} glareOpacity={0.12}>
                  <button
                    type="button"
                    onClick={() => onNavigate(cat.route)}
                    className="w-full group text-left bg-white border border-[#E4DED2] hover:border-[#C4B494] overflow-hidden shadow-editorial transition-colors cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-[#EFEAE0] overflow-hidden">
                      <ResilientImage
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-display text-2xl font-normal text-[#16171A] group-hover:text-[#9A8357] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-[11px] text-[#16171A]/60">{cat.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#16171A]/40 group-hover:text-[#9A8357] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </button>
                </TiltCard3D>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </MagneticScrollSection>

      {/* =========================================================
          ACT III: THE STORY & SCROLL-PARALLAX LOOKBOOK SPREAD
         ========================================================= */}
      <MagneticScrollSection id="act-craft">
        <motion.div
          ref={spreadRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
          className="max-w-[1380px] mx-auto px-4 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
        {/* Left Scroll-Parallax Lookbook Plates */}
        <div className="lg:col-span-6 relative grid grid-cols-12 gap-4 items-center">
          <motion.div
            style={{ y: tallPlateY }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
            className="col-span-8"
          >
            <div className="aspect-[3/4] bg-[#EFEAE0] border border-[#E4DED2] overflow-hidden shadow-editorial">
              <ResilientImage
                src={HERO_EDITORIAL_IMAGE}
                alt="Doaba Linen and Supima editorial portrait in Jalandhar"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            style={{ y: insetPlateY }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.14, ease: EDITORIAL_EASE }}
            className="col-span-4 -ml-10 z-10"
          >
            <TiltCard3D intensity={5} glareOpacity={0.12}>
              <button
                type="button"
                onClick={() =>
                  onNavigate({ page: 'product', productId: 'doaba-linen-kurta' })
                }
                className="w-full text-left bg-white border border-[#E4DED2] p-2 shadow-editorial hover:border-[#9A8357] transition-colors cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#EFEAE0]">
                  <ResilientImage
                    src={
                      catalog.find((p) => p.id === 'doaba-linen-kurta')?.media.front ??
                      HERO_EDITORIAL_IMAGE
                    }
                    alt="Doaba Handloom Linen Kurta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="pt-2 text-[11px] font-medium text-[#16171A] truncate">
                  Doaba Linen Kurta
                </p>
                <p className="text-[10px] font-mono text-[#9A8357]">
                  Rainak Bazaar
                </p>
              </button>
            </TiltCard3D>
          </motion.div>
        </div>

        {/* Right Editorial Narrative & Partner Houses */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
            className="space-y-4"
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
              Our Craft · Four Neighbourhood Houses
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-normal leading-[1.1] text-[#16171A]">
              Local craft deserves the patience of haute tailoring.
            </h2>
            <p className="text-sm leading-relaxed text-[#16171A]/70 max-w-lg">
              Every garment in our archive comes directly from Jalandhar’s family-run
              cutting tables — double-checked under natural courtyard light, steam-pressed,
              and delivered across the city the same day.
            </p>
          </motion.div>

          <div className="divide-y divide-[#E4DED2] border-y border-[#E4DED2]">
            {HOUSES.map((house, idx) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EDITORIAL_EASE }}
              >
                <button
                  type="button"
                  onClick={() =>
                    onNavigate({ page: 'product', productId: house.productId })
                  }
                  className="w-full py-4 flex items-center justify-between gap-4 text-left group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="font-display text-xl text-[#16171A] group-hover:text-[#9A8357] transition-colors">
                      {house.name}
                    </p>
                    <p className="text-xs text-[#16171A]/60">{house.detail}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#16171A]/35 group-hover:text-[#9A8357] group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        </motion.div>
      </MagneticScrollSection>

      {/* =========================================================
          ACT IV: THE CLOTH ARCHIVE (10X MACRO MATERIALITY + MAGNETIC DWELL)
         ========================================================= */}
      <MagneticScrollSection id="act-archive" className="bg-[#EFEAE0]/60 border-y border-[#E4DED2]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
          className="py-20 sm:py-24"
        >
          <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
                  Materiality · Inspect Before You Wear
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#16171A]">
                  Supima Cotton, Belgian Flax & Bengal Jute
                </h2>
              </div>
              <MagneticButton
                strength={0.24}
                maxOffset={5}
                onClick={() =>
                  onNavigate({ page: 'product', productId: 'aura-oxford-shirt' })
                }
                className="text-xs uppercase tracking-[0.16em] font-medium text-[#16171A] hover:text-[#9A8357] transition-colors cursor-pointer self-start sm:self-end py-1"
              >
                Open 10x Macro Lens →
              </MagneticButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {macroSpecimens.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.65, delay: idx * 0.09, ease: EDITORIAL_EASE }}
                  className="h-full"
                >
                  <TiltCard3D intensity={5} glareOpacity={0.11} className="h-full">
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: 'product', productId: item.id })}
                      className="w-full h-full text-left bg-white border border-[#E4DED2] hover:border-[#C4B494] p-5 space-y-4 transition-colors cursor-pointer flex flex-col justify-between shadow-editorial"
                    >
                      <div className="space-y-4">
                        <div
                          className="h-44 border border-[#E4DED2] relative overflow-hidden"
                          style={{
                            backgroundImage: `url("${item.macroTexture || item.media.front}")`,
                            backgroundSize: '210%',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div
                            className="absolute inset-0 mix-blend-multiply opacity-20"
                            style={{ backgroundColor: item.macroTintHex }}
                          />
                          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/95 border border-[#E4DED2] text-[10px] uppercase tracking-[0.14em] text-[#16171A] inline-flex items-center gap-1.5">
                            <Eye className="w-3 h-3 text-[#9A8357]" />
                            <span>10x Weave</span>
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-display text-2xl font-normal text-[#16171A]">
                            {item.fabric}
                          </h3>
                          <p className="text-xs text-[#9A8357]">{item.weave}</p>
                          <p className="text-xs leading-relaxed text-[#16171A]/65 pt-1">
                            “{item.shopkeeperNote}”
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E4DED2] flex items-center justify-between text-xs">
                        <span className="font-medium text-[#16171A] truncate pr-2">
                          {item.name}
                        </span>
                        <span className="font-mono text-[#9A8357] shrink-0">
                          {formatINR(item.priceINR)}
                        </span>
                      </div>
                    </button>
                  </TiltCard3D>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </MagneticScrollSection>

      {/* =========================================================
          ACT V: CURATED SEASONAL PRODUCT GRID (Magnetic Scroll Dwell + whileInView)
         ========================================================= */}
      <MagneticScrollSection id="act-signatures">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
          className="max-w-[1380px] mx-auto px-4 sm:px-8 py-20 sm:py-24 space-y-10"
        >
          <div className="flex items-end justify-between gap-4 border-b border-[#E4DED2] pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
                The Archive
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#16171A] mt-1">
                Curated Signatures
              </h2>
            </div>
            <MagneticButton
              strength={0.24}
              maxOffset={5}
              onClick={() => onNavigate({ page: 'shop' })}
              className="text-xs uppercase tracking-[0.16em] font-medium text-[#16171A] hover:text-[#9A8357] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              View All ({catalog.length}) →
            </MagneticButton>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGarments.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                revealDelay={idx * 0.08}
                onOpenProduct={(id) => onNavigate({ page: 'product', productId: id })}
              />
            ))}
          </div>
        </motion.div>
      </MagneticScrollSection>

      {/* =========================================================
          ACT VI: OCCASIONS & PERSONAL STYLING CONCIERGE
         ========================================================= */}
      <MagneticScrollSection id="act-occasions">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
          className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-20 sm:pb-24 space-y-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DED2] pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
                Dressed for the Moment
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#16171A] mt-1">
                Occasion Lookbooks
              </h2>
            </div>
            <MagneticButton
              strength={0.24}
              maxOffset={5}
              onClick={() => onNavigate({ page: 'events' })}
              className="text-xs uppercase tracking-[0.16em] font-medium text-[#16171A] hover:text-[#9A8357] transition-colors cursor-pointer py-1"
            >
              All Occasions →
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_BOARDS.map((ev, idx) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: EDITORIAL_EASE }}
                className="h-full"
              >
                <TiltCard3D intensity={5} glareOpacity={0.11} className="h-full">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({ page: 'looks', initialEventId: ev.queryTrigger })
                    }
                    className="w-full h-full text-left bg-white border border-[#E4DED2] hover:border-[#C4B494] overflow-hidden shadow-editorial transition-colors cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
                      <ResilientImage
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A8357]">
                          {ev.dressCode}
                        </p>
                        <h3 className="font-display text-2xl font-normal text-[#16171A]">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#16171A]/65 leading-relaxed">
                          {ev.subtitle}
                        </p>
                      </div>
                      <span className="pt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#16171A] group-hover:text-[#9A8357]">
                        <span>Build This Look</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>

          {/* Calm Editorial Invitation to AI Stylist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
            className="bg-[#121316] text-[#F7F4EE] border border-[#2A2C32] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C4B494]/50 shrink-0">
                <ResilientImage
                  src={STYLIST_AVATAR_IMAGE}
                  alt="Local Threads Personal Stylist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#C4B494]">
                  Bespoke Guidance
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-normal">
                  Not sure what pairs best for your occasion?
                </h3>
                <p className="text-xs text-[#F7F4EE]/70">
                  Consult our Hinglish StylistAI for color pairing and exact size matching.
                </p>
              </div>
            </div>

            <MagneticButton
              strength={0.2}
              maxOffset={7}
              onClick={() => onNavigate({ page: 'stylist' })}
              className="px-7 py-3.5 bg-[#F7F4EE] text-[#121316] text-xs uppercase tracking-[0.18em] font-medium hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Consult StylistAI
            </MagneticButton>
          </motion.div>
        </motion.div>
      </MagneticScrollSection>

      <PromiseBar />
    </div>
  );
}
