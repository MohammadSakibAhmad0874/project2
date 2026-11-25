/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { StoreProvider, useStore } from '@/src/lib/cart-store';
import { AppRoute, Navbar } from '@/src/components/Navbar';
import { CartDrawer } from '@/src/components/CartDrawer';
import { HomePageSkeleton, ProductDetailSkeleton } from '@/src/components/PageSkeletons';
import { HomePage } from '@/src/pages/HomePage';
import { ShopPage } from '@/src/pages/ShopPage';
import { ProductDetailPage } from '@/src/pages/ProductDetailPage';
import { StylistAIPage } from '@/src/pages/StylistAIPage';
import { CompleteLookPage } from '@/src/pages/CompleteLookPage';
import { EventsPage } from '@/src/pages/EventsPage';
import { SellerPage } from '@/src/pages/SellerPage';
import { CheckoutPage } from '@/src/pages/CheckoutPage';
import { OrderConfirmedPage } from '@/src/pages/OrderConfirmedPage';

function AppShell() {
  const [route, setRoute] = useState<AppRoute>({ page: 'home' });
  const { toastMessage, isCatalogLoading } = useStore();

  const navigate = (next: AppRoute) => {
    setRoute(next);
    window.scrollTo({
      top: 0,
      behavior: next.page === 'product' ? 'auto' : 'smooth',
    });
  };

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h.startsWith('/product/')) {
        const id = h.replace('/product/', '');
        if (id) setRoute({ page: 'product', productId: id });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const routeKey = isCatalogLoading
    ? `skeleton-${route.page}`
    : route.page === 'product'
      ? `product-${route.productId}`
      : route.page === 'shop'
        ? `shop-${route.initialGender ?? 'all'}-${route.initialCategory ?? 'all'}-${route.initialSustainable ?? false}`
        : route.page === 'looks'
          ? `looks-${route.initialEventId ?? 'default'}`
          : route.page === 'order-confirmed'
            ? `confirmed-${route.orderId}`
            : route.page;

  return (
    <LayoutGroup>
      <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#16171A]">
        <Navbar route={route} onNavigate={navigate} />

        <main className="flex-1 relative overflow-x-clip">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={routeKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
            {isCatalogLoading && route.page === 'product' && <ProductDetailSkeleton />}
            {isCatalogLoading && route.page !== 'product' && <HomePageSkeleton />}

            {!isCatalogLoading && route.page === 'home' && (
              <HomePage onNavigate={navigate} />
            )}

            {!isCatalogLoading && route.page === 'shop' && (
              <ShopPage
                initialGender={route.initialGender}
                initialCategory={route.initialCategory}
                initialSustainable={route.initialSustainable}
                onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
              />
            )}

            {!isCatalogLoading && route.page === 'product' && (
              <ProductDetailPage
                productId={route.productId}
                onBackToShop={() => navigate({ page: 'shop' })}
                onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
              />
            )}

            {!isCatalogLoading && route.page === 'looks' && (
              <CompleteLookPage
                initialEventQuery={route.initialEventId}
                onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
              />
            )}

            {!isCatalogLoading && route.page === 'events' && (
              <EventsPage
                onSelectEvent={(queryTrigger) =>
                  navigate({ page: 'looks', initialEventId: queryTrigger })
                }
                onOpenStylist={() => navigate({ page: 'stylist' })}
              />
            )}

            {!isCatalogLoading && route.page === 'stylist' && (
              <StylistAIPage
                onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
                onOpenCreateLook={(query) =>
                  navigate({ page: 'looks', initialEventId: query })
                }
              />
            )}

            {!isCatalogLoading && route.page === 'seller' && (
              <SellerPage
                onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
                onGoToShop={() => navigate({ page: 'shop' })}
              />
            )}

            {!isCatalogLoading && route.page === 'checkout' && (
              <CheckoutPage
                onBackToShop={() => navigate({ page: 'shop' })}
                onOpenStylist={() => navigate({ page: 'stylist' })}
                onOrderSuccess={(details) =>
                  navigate({ page: 'order-confirmed', ...details })
                }
              />
            )}

            {!isCatalogLoading && route.page === 'order-confirmed' && (
              <OrderConfirmedPage
                orderId={route.orderId}
                customerName={route.customerName}
                locality={route.locality}
                pincode={route.pincode}
                paymentMethod={route.paymentMethod}
                items={route.items}
                totalINR={route.totalINR}
                onMessageStylist={() => navigate({ page: 'stylist' })}
                onViewWardrobe={() => navigate({ page: 'shop' })}
                onCreateNextLook={() => navigate({ page: 'looks' })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Nocturnal Atelier Footer */}
      <footer className="bg-[#0B0C10] text-[#F6F2EA] border-t border-[#C9B382]/20 pb-20 lg:pb-8">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-xl tracking-[0.22em] uppercase font-medium text-[#F6F2EA]">
              LOCAL THREADS
            </p>
            <p className="text-xs leading-relaxed text-[#F6F2EA]/65 max-w-sm">
              Jalandhar’s independent clothing studios brought online with real 360° studio
              photography, 10x macro weave inspection, and same-day local dispatch.
            </p>
          </div>

          <div className="md:col-span-4 space-y-1.5 text-xs text-[#F6F2EA]/70">
            <p className="font-semibold text-[#D8C294] uppercase tracking-wider text-[11px]">
              Partner Ateliers
            </p>
            <p>Model Town Looms · Rainak Bazaar Drapers</p>
            <p>Sadar Studio · GT Road Tailors, Jalandhar (144001–144003)</p>
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#D8C294] md:justify-end">
            <button type="button" onClick={() => navigate({ page: 'shop' })} className="hover:underline cursor-pointer">
              Shop
            </button>
            <button type="button" onClick={() => navigate({ page: 'looks' })} className="hover:underline cursor-pointer">
              Create Look
            </button>
            <button type="button" onClick={() => navigate({ page: 'events' })} className="hover:underline cursor-pointer">
              Events
            </button>
            <button type="button" onClick={() => navigate({ page: 'stylist' })} className="hover:underline cursor-pointer">
              AI Guide
            </button>
            <button type="button" onClick={() => navigate({ page: 'seller' })} className="hover:underline cursor-pointer">
              Seller
            </button>
          </div>
        </div>
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#F6F2EA]/45">
          <span>© 2026 LOCAL THREADS · Jalandhar, Punjab</span>
          <span>Cash on Delivery & UPI · Complimentary Alterations</span>
        </div>
      </footer>

      <CartDrawer
        onOpenProduct={(id) => navigate({ page: 'product', productId: id })}
        onProceedToCheckout={() => navigate({ page: 'checkout' })}
      />

        {/* Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-16 lg:bottom-6 left-6 z-50 px-4 py-2.5 bg-[#14161C] border border-[#D8C294]/60 text-[#F6F2EA] text-xs font-medium shadow-atelier"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}

