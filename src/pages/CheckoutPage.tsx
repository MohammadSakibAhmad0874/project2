import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { formatINR, useStore } from '@/src/lib/cart-store';
import { PromiseBar } from '@/src/components/PromiseBar';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOpenStylist: () => void;
  onOrderSuccess: (details: {
    orderId: string;
    customerName: string;
    locality: string;
    pincode: string;
    paymentMethod: string;
    items: { name: string; priceINR: number; qty: number; size: string }[];
    totalINR: number;
  }) => void;
}

export function CheckoutPage({
  onBackToShop,
  onOpenStylist,
  onOrderSuccess,
}: CheckoutPageProps) {
  const { cart, cartSubtotal, clearCart } = useStore();

  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('express');
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('Model Town, Jalandhar');
  const [stateName, setStateName] = useState('Punjab');
  const [pincode, setPincode] = useState('144003');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / Card' | 'Cash on Delivery'>('UPI / Card');
  const [cardNumber, setCardNumber] = useState('');
  const [sameBilling, setSameBilling] = useState(true);
  const [billingNote, setBillingNote] = useState('');

  const shippingCost =
    cartSubtotal >= 1999 || cartSubtotal === 0
      ? 0
      : shippingMethod === 'express'
        ? 149
        : 79;
  const totalINR = cartSubtotal + shippingCost;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || cart.length === 0) return;
    const orderId = `LT-${Math.floor(10000 + Math.random() * 89999)}`;
    const snapshot = cart.map((c) => ({
      name: c.name,
      priceINR: c.priceINR,
      qty: c.qty,
      size: c.size,
    }));
    clearCart();
    onOrderSuccess({
      orderId,
      customerName: fullName.trim(),
      locality: locality.trim() || 'Jalandhar',
      pincode: pincode.trim() || '144001',
      paymentMethod,
      items: snapshot,
      totalINR,
    });
  };

  return (
    <div className="bg-[#F6F2EA] text-[#16181D] pb-14 lg:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-[0.16em] font-normal text-[#1C1E22]">
            Checkout & Jalandhar Delivery
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#E4E0D8] p-12 text-center space-y-4 max-w-lg mx-auto">
            <p className="font-display text-2xl text-[#1C1E22]">Your Bag is Empty</p>
            <p className="text-xs text-[#1C1E22]/65">
              Add curated garments from our Jalandhar tailoring collection before checking out.
            </p>
            <button
              type="button"
              onClick={onBackToShop}
              className="px-6 py-3 bg-[#23262B] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleConfirm}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Column 1: SECURE CHECKOUT Summary & Shipping Method */}
            <section className="lg:col-span-4 space-y-6">
              <div className="space-y-3 border-b border-[#E4E0D8] pb-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1E22]">
                  Secure Checkout
                </h2>
                <div className="space-y-2 text-xs">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.colorName}`}
                      className="flex justify-between gap-2"
                    >
                      <span className="text-[#1C1E22]/85">
                        {item.qty}x {item.name} ({item.size})
                      </span>
                      <span className="font-mono tabular-nums font-medium">
                        {formatINR(item.priceINR * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E4E0D8] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#1C1E22]/70">Subtotal</span>
                    <span className="font-mono tabular-nums">{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1C1E22]/70">Shipping</span>
                    <span className="font-mono tabular-nums">
                      {shippingCost === 0 ? 'Complimentary' : formatINR(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E4E0D8] text-sm font-semibold">
                    <span>Total</span>
                    <span className="font-mono tabular-nums">{formatINR(totalINR)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1E22]">
                  Shipping Method
                </h3>
                <label className="flex items-start gap-2.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-0.5 accent-[#1D2025]"
                  />
                  <span>
                    Same-Day Jalandhar Express (Model Town / Sadar · 4 hrs)
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-0.5 accent-[#1D2025]"
                  />
                  <span>
                    Standard Boutique Courier (Punjab · 1–2 business days)
                  </span>
                </label>
              </div>
            </section>

            {/* Column 2: Shipping Address */}
            <section className="lg:col-span-4 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1E22]">
                Shipping Address
              </h2>

              <input
                required
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs focus:outline-none focus:border-[#1D2025]"
              />
              <input
                required
                type="text"
                placeholder="Street Address / House No."
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs focus:outline-none focus:border-[#1D2025]"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  required
                  type="text"
                  placeholder="Locality / City"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs focus:outline-none focus:border-[#1D2025]"
                />
                <input
                  required
                  type="text"
                  placeholder="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs focus:outline-none focus:border-[#1D2025]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  required
                  type="text"
                  placeholder="PIN Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs font-mono focus:outline-none focus:border-[#1D2025]"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone (+91)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-[#E4E0D8] text-xs font-mono focus:outline-none focus:border-[#1D2025]"
                />
              </div>
            </section>

            {/* Column 3: Payment Method & Place Order */}
            <section className="lg:col-span-4 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1E22]">
                Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {(['UPI / Card', 'Cash on Delivery'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2.5 px-3 border text-xs font-medium cursor-pointer ${
                      paymentMethod === m
                        ? 'bg-[#1D2025] text-white border-[#1D2025]'
                        : 'bg-white text-[#1C1E22] border-[#E4E0D8]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {paymentMethod === 'UPI / Card' && (
                <div className="bg-white border border-[#E4E0D8] p-3.5 space-y-2.5">
                  <input
                    type="text"
                    placeholder="UPI ID (e.g. name@okaxis) or Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D8] text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY (optional for UPI)"
                      className="px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D8] text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D8] text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-[#1C1E22]">Billing Address</p>
                <label className="inline-flex items-center gap-2 text-xs text-[#1C1E22]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameBilling}
                    onChange={(e) => setSameBilling(e.target.checked)}
                    className="accent-[#1D2025]"
                  />
                  <span>Same as Shipping Address</span>
                </label>
                {!sameBilling && (
                  <input
                    type="text"
                    placeholder="Enter Billing Address"
                    value={billingNote}
                    onChange={(e) => setBillingNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E4E0D8] text-xs"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#23262B] text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#14161A] transition-colors cursor-pointer"
              >
                Confirm & Place Order
              </button>

              <div className="flex items-start gap-2 text-[11px] text-[#1C1E22]/65">
                <Lock className="w-3.5 h-3.5 text-[#9C8456] shrink-0 mt-0.5" />
                <span>
                  Your order details are encrypted and dispatched directly from our Jalandhar partner ateliers.
                </span>
              </div>
            </section>
          </form>
        )}

        {/* Bottom Help Links matching Image 6 */}
        <div className="pt-6 border-t border-[#E4E0D8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-[#1C1E22]">Order Tracking Link</p>
            <button
              type="button"
              onClick={onBackToShop}
              className="text-[#7D6B48] underline underline-offset-2 cursor-pointer mt-0.5"
            >
              Continue Browsing Collection
            </button>
          </div>
          <div>
            <p className="font-semibold text-[#1C1E22]">Need Assistance?</p>
            <button
              type="button"
              onClick={onOpenStylist}
              className="text-[#7D6B48] underline underline-offset-2 cursor-pointer mt-0.5"
            >
              Live Chat with a Stylist
            </button>
          </div>
        </div>
      </div>

      <PromiseBar />
    </div>
  );
}
