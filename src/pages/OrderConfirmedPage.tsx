import React from 'react';
import { STYLIST_AVATAR_IMAGE } from '@/src/data/products';
import { formatINR } from '@/src/lib/cart-store';
import { ResilientImage } from '@/src/components/ResilientImage';
import { PromiseBar } from '@/src/components/PromiseBar';

interface OrderConfirmedPageProps {
  orderId: string;
  customerName: string;
  locality: string;
  pincode: string;
  paymentMethod: string;
  items: { name: string; priceINR: number; qty: number; size: string }[];
  totalINR: number;
  onMessageStylist: () => void;
  onViewWardrobe: () => void;
  onCreateNextLook: () => void;
}

const STEPS = [
  { label: 'Order Placed', sub: '(Today)', active: true },
  { label: 'Tailoring & Preparation', sub: '(1-3 hrs)', active: true },
  { label: 'Quality Assurance', sub: '(Atelier Check)', active: false },
  { label: 'Local Dispatch', sub: '(Jalandhar Courier)', active: false },
  { label: 'Delivery', sub: '(Doorstep)', active: false },
];

export function OrderConfirmedPage({
  orderId,
  customerName,
  locality,
  pincode,
  paymentMethod,
  items,
  totalINR,
  onMessageStylist,
  onViewWardrobe,
  onCreateNextLook,
}: OrderConfirmedPageProps) {
  return (
    <div className="bg-[#F6F2EA] text-[#16181D] pb-14 lg:pb-0">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Centered Confirmation Heading matching Image 7 */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[#7D6B48] font-semibold">
            Thank You For Your Order
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#1C1E22] leading-snug">
            Your Local Threads journey has begun, {customerName}. Confirmation details
            (Order #{orderId}) are ready for {locality} ({pincode}).
          </h1>
        </div>

        {/* Order Summary + 5-Step Progress Tracker (Image 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E4E0D8] p-6 sm:p-8">
          <div className="lg:col-span-4 space-y-2.5 border-b lg:border-b-0 lg:border-r border-[#E4E0D8] pb-5 lg:pb-0 lg:pr-6">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1C1E22]">
              <span>Order Summary</span>
              <span className="font-mono text-[#7D6B48]">#{orderId}</span>
            </div>

            <div className="space-y-1.5 text-xs text-[#1C1E22]/80">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-2">
                  <span className="truncate">
                    {item.qty}x {item.name} ({item.size})
                  </span>
                  <span className="font-mono tabular-nums">
                    {formatINR(item.priceINR * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E4E0D8] flex justify-between text-xs font-semibold">
              <span>Paid via {paymentMethod}</span>
              <span className="font-mono tabular-nums">{formatINR(totalINR)}</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-5 gap-2 relative">
              <div
                aria-hidden="true"
                className="hidden sm:block absolute top-2.5 left-[10%] right-[10%] h-[1px] bg-[#E4E0D8]"
              />
              {STEPS.map((st, idx) => (
                <div key={st.label} className="relative flex flex-col items-center text-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 z-10 ${
                      st.active
                        ? 'bg-[#1D2025] border-[#1D2025]'
                        : 'bg-[#FAF9F6] border-[#C8BFA8]'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-medium text-[#1C1E22] leading-tight">
                      {idx + 1}. {st.label}
                    </p>
                    <p className="text-[10px] text-[#1C1E22]/55">{st.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YOUR STYLE JOURNEY CONTINUES (3 Cards matching Image 7) */}
        <section className="space-y-6">
          <h2 className="text-center font-display text-2xl uppercase tracking-[0.16em] font-normal text-[#1C1E22]">
            Your Style Journey Continues
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E4E0D8] p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C8BFA8] shrink-0">
                  <ResilientImage
                    src={STYLIST_AVATAR_IMAGE}
                    alt="Dedicated stylist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#1C1E22]/80">
                  Your dedicated Jalandhar stylist is curating complementary pieces based
                  on your order. Connect anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={onMessageStylist}
                className="w-full py-2.5 bg-[#23262B] text-white text-xs font-medium hover:bg-[#14161A] cursor-pointer"
              >
                Message Stylist
              </button>
            </div>

            <div className="bg-white border border-[#E4E0D8] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1.5 h-20">
                  <img
                    src="/src/assets/images/oxford_shirt_front_1794869259031.jpg"
                    alt="Wardrobe shirt"
                    className="w-full h-full object-cover bg-[#EFECE6]"
                  />
                  <img
                    src="/src/assets/images/prod_beige_kurta_1794869261317.jpg"
                    alt="Wardrobe kurta"
                    className="w-full h-full object-cover bg-[#EFECE6]"
                  />
                  <img
                    src="/src/assets/images/prod_sand_chinos_1794869263518.jpg"
                    alt="Wardrobe chinos"
                    className="w-full h-full object-cover bg-[#EFECE6]"
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#1C1E22]/80">
                  Access your personal wardrobe analysis and track your fit preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={onViewWardrobe}
                className="w-full py-2.5 bg-[#23262B] text-white text-xs font-medium hover:bg-[#14161A] cursor-pointer"
              >
                View My Wardrobe
              </button>
            </div>

            <div className="bg-white border border-[#E4E0D8] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="h-20 overflow-hidden bg-[#1D2025]">
                  <img
                    src="/src/assets/images/hero_luxury_atelier_1794871841277.jpg"
                    alt="Create next look studio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#1C1E22]/80">
                  Start conceptualizing your next bespoke pairing inside our Atelier Look
                  Studio.
                </p>
              </div>
              <button
                type="button"
                onClick={onCreateNextLook}
                className="w-full py-2.5 bg-[#23262B] text-white text-xs font-medium hover:bg-[#14161A] cursor-pointer"
              >
                Create Your Next Look
              </button>
            </div>
          </div>
        </section>
      </div>

      <PromiseBar />
    </div>
  );
}
