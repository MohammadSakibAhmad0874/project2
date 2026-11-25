import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Home, Layers, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '@/src/lib/cart-store';
import { MagneticButton } from '@/src/components/MagneticButton';

export type AppRoute =
  | { page: 'home' }
  | { page: 'shop'; initialGender?: string; initialCategory?: string; initialSustainable?: boolean }
  | { page: 'product'; productId: string }
  | { page: 'looks'; initialEventId?: string }
  | { page: 'events' }
  | { page: 'stylist' }
  | { page: 'seller' }
  | { page: 'checkout' }
  | {
      page: 'order-confirmed';
      orderId: string;
      customerName: string;
      locality: string;
      pincode: string;
      paymentMethod: string;
      items: { name: string; priceINR: number; qty: number; size: string }[];
      totalINR: number;
    };

interface NavbarProps {
  route: AppRoute;
  onNavigate: (next: AppRoute) => void;
}

const NAV_ITEMS: { label: string; page: AppRoute['page']; route: AppRoute }[] = [
  { label: 'Collection', page: 'shop', route: { page: 'shop' } },
  { label: 'Create Look', page: 'looks', route: { page: 'looks' } },
  { label: 'Occasions', page: 'events', route: { page: 'events' } },
  { label: 'AI Stylist', page: 'stylist', route: { page: 'stylist' } },
  { label: 'Atelier', page: 'seller', route: { page: 'seller' } },
];

export function Navbar({ route, onNavigate }: NavbarProps) {
  const { cartCount, openCart } = useStore();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F7F4EE]/96 backdrop-blur-md text-[#16171A] border-b border-[#E4DED2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
          {/* Left: Clean Editorial Brand Cluster */}
          <div className="flex items-center gap-3.5 shrink-0">
            <MagneticButton
              strength={0.22}
              maxOffset={4}
              onClick={() => onNavigate({ page: 'home' })}
              ariaLabel="Local Threads Home"
              className="flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer group"
            >
              <span className="font-display text-lg sm:text-xl tracking-[0.06em] font-semibold text-[#16171A] group-hover:text-[#9A8357] transition-colors">
                LT
              </span>
              <span className="h-4 w-[1px] bg-[#E4DED2]" aria-hidden="true" />
              <span className="font-display text-lg sm:text-xl lg:text-2xl tracking-[0.22em] uppercase font-normal text-[#16171A] group-hover:text-[#9A8357] transition-colors">
                LOCAL THREADS
              </span>
            </MagneticButton>
            <span className="hidden 2xl:inline-block pl-2 text-[10px] uppercase tracking-[0.24em] text-[#16171A]/45 whitespace-nowrap">
              Jalandhar · Est. 1986
            </span>
          </div>

          {/* Right: 5 Clean Magnetic Links + Bag */}
          <div className="flex items-center justify-end gap-4 xl:gap-6 shrink-0">
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-3 xl:gap-5 text-[12px] tracking-[0.04em] text-[#16171A]/75"
            >
              {NAV_ITEMS.map((item) => {
                const active = route.page === item.page;
                return (
                  <MagneticButton
                    key={item.page}
                    strength={0.22}
                    maxOffset={3.5}
                    onClick={() => onNavigate(item.route)}
                    className={`relative px-2 py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active ? 'text-[#16171A] font-medium' : 'hover:text-[#16171A]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="navbar-active-tab"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        aria-hidden="true"
                        className="absolute inset-x-2 -bottom-0.5 h-[1.5px] bg-[#16171A]"
                      />
                    )}
                  </MagneticButton>
                );
              })}
            </nav>

            <MagneticButton
              strength={0.22}
              maxOffset={4}
              onClick={() => openCart('bag')}
              ariaLabel={`Open shopping bag with ${cartCount} items`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#16171A]/20 bg-white hover:border-[#16171A] text-[#16171A] text-[12px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#16171A]" />
              <span>Bag</span>
              <span className="tabular-nums font-mono text-[11px] text-[#9A8357]">
                {cartCount}
              </span>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#F7F4EE] border-t border-[#E4DED2] grid grid-cols-5 text-[#16171A]"
      >
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            route.page === 'home' ? 'text-[#16171A] font-semibold' : 'text-[#16171A]/55'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'shop' })}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            route.page === 'shop' ? 'text-[#16171A] font-semibold' : 'text-[#16171A]/55'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Collection</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'looks' })}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            route.page === 'looks' ? 'text-[#16171A] font-semibold' : 'text-[#16171A]/55'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Look</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'events' })}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            route.page === 'events' ? 'text-[#16171A] font-semibold' : 'text-[#16171A]/55'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'stylist' })}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            route.page === 'stylist' ? 'text-[#16171A] font-semibold' : 'text-[#16171A]/55'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Stylist</span>
        </button>
      </nav>
    </>
  );
}
