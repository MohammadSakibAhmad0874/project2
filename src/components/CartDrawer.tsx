import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { ResilientImage } from '@/src/components/ResilientImage';
import { EDITORIAL_EASE } from '@/src/components/Reveal';

interface CartDrawerProps {
  onOpenProduct: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onOpenProduct, onProceedToCheckout }: CartDrawerProps) {
  const {
    catalog,
    cart,
    wishlist,
    isCartOpen,
    drawerTab,
    openCart,
    closeCart,
    updateQty,
    removeFromCart,
    toggleWishlist,
    addToCart,
    cartSubtotal,
  } = useStore();

  const freeDeliveryThreshold = 1999;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const wishlistProducts = catalog.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#121316]/60 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: EDITORIAL_EASE }}
            role="dialog"
            aria-label="Shopping Bag and Wishlist"
            className="relative z-10 w-full max-w-md bg-[#F7F4EE] text-[#16171A] h-full border-l border-[#E4DED2] flex flex-col shadow-atelier"
          >
            <div className="p-5 border-b border-[#2A2C32] flex items-center justify-between gap-4 bg-[#121316] text-[#F7F4EE]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCart('bag')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    drawerTab === 'bag'
                      ? 'bg-[#C4B494] text-[#121316] font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  Bag ({cart.reduce((s, i) => s + i.qty, 0)})
                </button>
                <button
                  type="button"
                  onClick={() => openCart('wishlist')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    drawerTab === 'wishlist'
                      ? 'bg-[#C4B494] text-[#121316] font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  Wishlist ({wishlistProducts.length})
                </button>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close drawer"
                className="p-2 text-white/75 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

        <div className="flex-1 overflow-y-auto p-5">
          {drawerTab === 'wishlist' ? (
            wishlistProducts.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Heart className="w-8 h-8 text-[#1C1E22]/30 mx-auto" />
                <p className="font-display text-xl font-medium text-[#1C1E22]">
                  Your Wishlist is empty
                </p>
                <p className="text-xs text-[#1C1E22]/60">
                  Save tailored pieces from Model Town & Sadar Bazaar here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-white border border-[#E4E0D8]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                        onOpenProduct(item.id);
                      }}
                      className="w-16 h-20 bg-[#EFECE6] shrink-0 cursor-pointer overflow-hidden"
                    >
                      <ResilientImage
                        src={item.media.front}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#1C1E22]/55 truncate">
                          {item.shopName}
                        </p>
                        <p className="text-sm font-medium text-[#1C1E22] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs font-mono tabular-nums mt-0.5">
                          {formatINR(item.priceINR)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              productId: item.id,
                              name: item.name,
                              shopName: item.shopName,
                              image: item.media.front,
                              priceINR: item.priceINR,
                              size: 'M',
                              colorName: item.colors[0]?.name ?? 'Classic',
                            });
                            openCart('bag');
                          }}
                          className="px-3 py-1.5 bg-[#1D2025] text-white text-xs font-medium cursor-pointer"
                        >
                          Move to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item.id)}
                          className="p-1.5 border border-[#E4E0D8] text-[#1C1E22]/60 hover:text-[#1C1E22] cursor-pointer"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#1C1E22]/30 mx-auto" />
              <p className="font-display text-xl font-medium text-[#1C1E22]">
                Your Atelier Bag is empty
              </p>
              <p className="text-xs text-[#1C1E22]/60">
                Select garments from the Collection or Create Look studio.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#EFECE6] border border-[#E4E0D8] text-xs text-[#1C1E22]">
                {remainingForFree === 0 ? (
                  <span className="font-medium">
                    Complimentary same-day Jalandhar courier unlocked.
                  </span>
                ) : (
                  <span>
                    Add <strong className="tabular-nums">{formatINR(remainingForFree)}</strong> more
                    for complimentary same-day Jalandhar courier.
                  </span>
                )}
              </div>

              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.colorName}`}
                  className="flex gap-3 p-3 bg-white border border-[#E4E0D8]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      onOpenProduct(item.productId);
                    }}
                    className="w-16 h-20 bg-[#EFECE6] shrink-0 cursor-pointer overflow-hidden"
                  >
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1C1E22] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#1C1E22]/60">
                          Size {item.size} · {item.colorName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.size, item.colorName)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="text-[#1C1E22]/45 hover:text-[#1C1E22] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-[#E4E0D8] bg-[#FAF9F6]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.size, item.colorName, -1)
                          }
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#1C1E22] hover:bg-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.size, item.colorName, 1)
                          }
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#1C1E22] hover:bg-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-mono font-semibold tabular-nums">
                        {formatINR(item.priceINR * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {drawerTab === 'bag' && cart.length > 0 && (
          <div className="p-5 border-t border-[#E4E0D8] bg-white space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1C1E22]/70">Subtotal (incl. GST)</span>
              <span className="font-mono font-semibold text-base tabular-nums">
                {formatINR(cartSubtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                closeCart();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-[#121316] text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#1E2028] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C4B494]" />
            </button>
          </div>
        )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
