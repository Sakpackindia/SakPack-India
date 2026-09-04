"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { validateCoupon } from "@/actions/checkout";

const CartContext = createContext(undefined);
const STORAGE_KEY = "amairah-cart";
const COUPON_STORAGE_KEY = "amairah-coupon";

// Merges any entries that share a variantId (e.g. from stale carts saved
// before add-to-cart de-duplication existed) so React list keys stay unique.
function dedupeCart(items) {
  if (!Array.isArray(items)) return [];
  const merged = [];
  const indexByVariantId = new Map();
  for (const item of items) {
    const existingIndex = indexByVariantId.get(item.variantId);
    if (existingIndex === undefined) {
      indexByVariantId.set(item.variantId, merged.length);
      merged.push({ ...item });
    } else {
      merged[existingIndex].quantity += item.quantity;
    }
  }
  return merged;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(dedupeCart(JSON.parse(saved)));
      const savedCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      // ignore corrupt cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (appliedCoupon) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon, hydrated]);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setDrawerOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) return removeFromCart(variantId);
    setCart((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
  };

  const applyCouponCode = async (code) => {
    if (!code || !code.trim()) return { success: false, error: "Please enter a coupon code." };
    const cleanCode = code.trim().toUpperCase();
    const currentSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const result = await validateCoupon(cleanCode, currentSubtotal);
    if (!result.valid) {
      return { success: false, error: result.error || "Invalid coupon code." };
    }
    const couponData = { code: cleanCode, discountAmount: result.discountAmount };
    setAppliedCoupon(couponData);
    return { success: true, discountAmount: result.discountAmount, code: cleanCode };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        drawerOpen,
        setDrawerOpen,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
