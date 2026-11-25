import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, Product, SizeKey } from '@/src/data/products';

export interface CartItem {
  productId: string;
  name: string;
  shopName: string;
  image: string;
  priceINR: number;
  size: SizeKey;
  colorName: string;
  qty: number;
}

export interface SavedOutfit {
  id: string;
  title: string;
  colorRule: string;
  totalINR: number;
  itemIds: string[];
  savedAt: string;
}

interface StoreContextValue {
  catalog: Product[];
  isCatalogLoading: boolean;
  cart: CartItem[];
  wishlist: string[];
  savedOutfits: SavedOutfit[];
  isCartOpen: boolean;
  drawerTab: 'bag' | 'wishlist';
  toastMessage: string | null;
  cartCount: number;
  cartSubtotal: number;
  openCart: (tab?: 'bag' | 'wishlist') => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  addBundleToCart: (products: Product[], defaultSize?: SizeKey) => void;
  removeFromCart: (productId: string, size: SizeKey, colorName: string) => void;
  updateQty: (productId: string, size: SizeKey, colorName: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  saveOutfit: (outfit: Omit<SavedOutfit, 'savedAt'>) => void;
  addSellerProduct: (product: Product) => void;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = 'lt_jalandhar_cart_v1';
const WISHLIST_KEY = 'lt_jalandhar_wishlist_v1';
const OUTFITS_KEY = 'lt_jalandhar_outfits_v1';
const SELLER_PRODUCTS_KEY = 'lt_jalandhar_seller_products_v1';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(WISHLIST_KEY, []));
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() =>
    readStorage(OUTFITS_KEY, [])
  );
  const [sellerProducts, setSellerProducts] = useState<Product[]>(() =>
    readStorage(SELLER_PRODUCTS_KEY, [])
  );
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'bag' | 'wishlist'>('bag');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsCatalogLoading(false);
    }, 360);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(OUTFITS_KEY, JSON.stringify(savedOutfits));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedOutfits]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(sellerProducts));
    } catch {
      // Ignore storage quota errors
    }
  }, [sellerProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const openCart = (tab: 'bag' | 'wishlist' = 'bag') => {
    setDrawerTab(tab);
    setIsCartOpen(true);
  };

  const closeCart = () => setIsCartOpen(false);

  const addToCart = (incoming: Omit<CartItem, 'qty'> & { qty?: number }) => {
    const qtyToAdd = incoming.qty ?? 1;
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === incoming.productId &&
          i.size === incoming.size &&
          i.colorName === incoming.colorName
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qtyToAdd };
        return next;
      }
      return [...prev, { ...incoming, qty: qtyToAdd }];
    });
  };

  const addBundleToCart = (items: Product[], defaultSize: SizeKey = 'M') => {
    items.forEach((p) => {
      addToCart({
        productId: p.id,
        name: p.name,
        shopName: p.shopName,
        image: p.media.front,
        priceINR: p.priceINR,
        size: defaultSize,
        colorName: p.colors[0]?.name ?? 'Default',
        qty: 1,
      });
    });
    showToast(`${items.length} curated pieces added to your bag`);
    openCart('bag');
  };

  const removeFromCart = (productId: string, size: SizeKey, colorName: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.size === size && i.colorName === colorName)
      )
    );
  };

  const updateQty = (
    productId: string,
    size: SizeKey,
    colorName: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId === productId && i.size === size && i.colorName === colorName) {
            return { ...i, qty: i.qty + delta };
          }
          return i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  };

  const saveOutfit = (outfit: Omit<SavedOutfit, 'savedAt'>) => {
    setSavedOutfits((prev) => {
      const exists = prev.some((o) => o.id === outfit.id);
      if (exists) {
        showToast('Outfit already saved in your lookbook');
        return prev;
      }
      showToast(`Saved "${outfit.title}" to your lookbook`);
      return [{ ...outfit, savedAt: new Date().toLocaleDateString('en-IN') }, ...prev];
    });
  };

  const addSellerProduct = (product: Product) => {
    setSellerProducts((prev) => [product, ...prev]);
    showToast(`"${product.name}" published to Local Threads`);
  };

  const catalog = useMemo(() => [...sellerProducts, ...PRODUCTS], [sellerProducts]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.priceINR * item.qty, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        catalog,
        isCatalogLoading,
        cart,
        wishlist,
        savedOutfits,
        isCartOpen,
        drawerTab,
        toastMessage,
        cartCount,
        cartSubtotal,
        openCart,
        closeCart,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        saveOutfit,
        addSellerProduct,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
