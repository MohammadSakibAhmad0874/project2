import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { Check, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/src/data/products';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { ResilientImage } from '@/src/components/ResilientImage';
import { EDITORIAL_EASE } from '@/src/components/Reveal';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (productId: string) => void;
  variant?: 'light' | 'dark';
  revealDelay?: number;
}

export function ProductCard({
  product,
  onOpenProduct,
  revealDelay = 0,
}: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist, showToast } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const isWishlisted = wishlist.includes(product.id);

  // Normalized mouse coordinates [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawGlareAlpha = useMotionValue(0);

  // Map mouse position directly to subtle 3D X/Y rotations
  const targetRotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const targetRotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const targetGlareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const targetGlareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const springConfig = { stiffness: 240, damping: 24, mass: 0.6 };
  const rotateX = useSpring(targetRotateX, springConfig);
  const rotateY = useSpring(targetRotateY, springConfig);
  const glareX = useSpring(targetGlareX, springConfig);
  const glareY = useSpring(targetGlareY, springConfig);
  const glareAlpha = useSpring(rawGlareAlpha, { stiffness: 200, damping: 24 });

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 251, 242, 0.72), transparent 62%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(Math.min(0.5, Math.max(-0.5, nx)));
    mouseY.set(Math.min(0.5, Math.max(-0.5, ny)));
    rawGlareAlpha.set(0.14);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    rawGlareAlpha.set(0);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      shopName: product.shopName,
      image: product.media.front,
      priceINR: product.priceINR,
      size: 'M',
      colorName: product.colors[0]?.name ?? 'Classic',
    });
    setJustAdded(true);
    showToast(`${product.name} (Size M) added to bag`);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const handleOpenProduct = () => {
    mouseX.set(0);
    mouseY.set(0);
    rawGlareAlpha.set(0);
    onOpenProduct(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: revealDelay,
        ease: EDITORIAL_EASE,
      }}
      className="perspective-stage h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformPerspective: 1000,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.015 }}
        className="group relative flex flex-col h-full will-change-transform"
      >
        <motion.div
          layoutId={`product-media-${product.id}`}
          transition={{ layout: { duration: 0.55, ease: EDITORIAL_EASE } }}
          onClick={handleOpenProduct}
          className="relative aspect-[3/4] bg-[#EFEAE0] border border-[#E4DED2] cursor-pointer overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-[#C4B494] group-hover:shadow-editorial"
        >
          <ResilientImage
            src={product.media.front}
            alt={`${product.name} by ${product.shopName}`}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: glareAlpha,
              background: glareBackground,
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/92 border border-[#E4DED2] flex items-center justify-center text-[#16171A] opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-[#16171A] text-[#16171A]' : 'text-[#16171A]/70'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`absolute inset-x-3 bottom-3 py-2.5 px-3 text-[11px] font-medium tracking-[0.14em] uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              justAdded
                ? 'bg-[#121316] text-[#EFEAE0] opacity-100'
                : 'bg-white/96 text-[#16171A] border border-[#16171A]/15 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </motion.div>

        <div className="pt-3.5 flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleOpenProduct}
              className="text-[13px] font-medium text-[#16171A] hover:text-[#9A8357] transition-colors truncate block text-left cursor-pointer"
            >
              {product.name}
            </button>
            <p className="text-[11px] text-[#16171A]/55 truncate">
              {product.shopName}
            </p>
          </div>
          <p className="text-xs font-mono tabular-nums text-[#16171A]/85 shrink-0">
            {formatINR(product.priceINR)}
          </p>
        </div>
      </motion.article>
    </motion.div>
  );
}
