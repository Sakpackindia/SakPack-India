"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Sparkles, Lock, ArrowRight, Tag, Check, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import HangerGlyph from "@/components/HangerGlyph";
import { calculateQuantityDiscount, calculateBundleDiscount, nonBundleCartQuantity } from "@/lib/constants";

const FREE_SHIPPING_THRESHOLD = 999;

const COLOR_MAP = {
  black: "#18181b",
  maroon: "#581c87",
  red: "#dc2626",
  white: "#f8fafc",
  nude: "#e0a96d",
  pink: "#f472b6",
  blue: "#2563eb",
  navy: "#1e3a8a",
  green: "#16a34a",
  yellow: "#eab308",
  beige: "#f5f5dc",
  brown: "#78350f",
};

function getColorHex(variantName) {
  if (!variantName) return null;
  const str = variantName.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (str.includes(key)) return hex;
  }
  return null;
}

export default function CartDrawer({ quantityDiscount, bundleSettings }) {
  const { cart, drawerOpen, setDrawerOpen, updateQuantity, removeFromCart, addToCart, cartSubtotal, appliedCoupon, applyCouponCode, removeCoupon } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const qtyDiscount = calculateQuantityDiscount(nonBundleCartQuantity(cart), quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);

  const codeDiscount = appliedCoupon?.discountAmount || 0;
  const totalDiscount = qtyDiscount + bundleDiscount + codeDiscount;
  const finalSubtotal = Math.max(0, cartSubtotal - totalDiscount);

  const freeShippingProgress = Math.min(100, (finalSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - finalSubtotal);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    setPromoError("");
    const result = await applyCouponCode(promoCode);
    setApplyingPromo(false);
    if (!result.success) {
      setPromoError(result.error);
    } else {
      setPromoCode("");
      setPromoError("");
    }
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Side Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-gold-400/40 bg-ivory shadow-2xl text-ink overflow-hidden"
          >
            {/* Top Shimmer Sheen */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient bg-[length:200%_200%] animate-shimmer z-20" />

            {/* Ambient Background Glow Spheres */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-ink/10 blur-3xl"
              />
            </div>

            {/* Drawer Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-gold-400/20 bg-white/95 px-4 sm:px-6 py-4 sm:py-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-gold-400/15 text-gold-600 shadow-inner">
                  <ShoppingBag className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-lg sm:text-xl font-black tracking-wide text-ink truncate">
                    Your Shopping Bag
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-600">
                      {totalCount} {totalCount === 1 ? "Item" : "Items"}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gold-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-700">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDrawerOpen(false)}
                aria-label="Close bag"
                className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-ivory text-ink/70 shadow-sm transition-colors hover:border-gold-500 hover:bg-gold-500/10 hover:text-ink"
              >
                <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </motion.button>
            </div>

            {/* Free Shipping & Deal Banner */}
            {cart.length > 0 && (
              <div className="relative z-10 border-b border-gold-400/20 bg-gradient-to-r from-gold-50 via-white to-gold-50 px-4 sm:px-6 py-3.5 shadow-sm">
                <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-ink gap-2">
                  <span className="flex items-center gap-1.5 text-gold-700 leading-tight">
                    <Truck className="h-4 w-4 shrink-0 text-gold-600" />
                    {freeShippingProgress >= 100
                      ? "🎉 You've unlocked FREE Express Shipping!"
                      : `Add ₹${amountLeftForFreeShipping.toLocaleString("en-IN")} more for FREE Shipping`}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-gold-700 shrink-0">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-gold-200/50 p-0.5 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full bg-gold-gradient shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Drawer Body / Items List */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-gold-400/40 bg-gradient-to-br from-white via-ivory to-ivory-deep shadow-2xl ring-4 ring-gold-400/15"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-2 rounded-full bg-gold-400/30 blur-md"
                    />
                    <ShoppingBag className="relative h-12 w-12 text-gold-600 stroke-[1.5]" />
                  </motion.div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wide text-ink">
                    Your Bag is Empty
                  </h3>
                  <p className="mt-2 max-w-[280px] text-base sm:text-lg font-semibold leading-relaxed text-ink/70">
                    Discover luxury styles crafted for everyday comfort and confidence.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="mt-8">
                    <Link
                      href="/shop"
                      onClick={() => setDrawerOpen(false)}
                      className="btn-gold group px-8 py-3.5 sm:px-9 sm:py-4 text-base sm:text-lg font-bold uppercase tracking-widest shadow-2xl"
                    >
                      Start Shopping
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Item List */}
                  <ul className="space-y-3.5 sm:space-y-4">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => (
                        <motion.li
                          key={item.variantId}
                          initial={{ opacity: 0, height: 0, y: 15 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -15 }}
                          transition={{ duration: 0.35 }}
                          className="group relative flex gap-3.5 sm:gap-4 rounded-3xl border border-gold-400/30 bg-white/95 p-3.5 sm:p-4 shadow-md backdrop-blur-md transition-all duration-300 hover:border-gold-500 hover:shadow-gold"
                        >
                          {/* Product Image */}
                          <div className="relative h-24 w-20 sm:h-26 sm:w-22 shrink-0 overflow-hidden rounded-2xl border border-gold-400/25 bg-ivory-deep shadow-inner">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="90px"
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <HangerGlyph className="h-8 w-auto text-gold-600/40" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-display text-base sm:text-lg font-bold leading-snug text-ink transition-colors group-hover:text-gold-600 line-clamp-2">
                                  {item.name}
                                </h4>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromCart(item.variantId)}
                                  aria-label="Remove item"
                                  className="shrink-0 rounded-xl p-1.5 text-ink/40 transition-all hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                </motion.button>
                              </div>
                              {item.variantName && (
                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 border border-gold-400/30 px-2.5 py-0.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-700">
                                    {(item.colorHex || getColorHex(item.variantName)) && (
                                      <span
                                        className="h-5 w-5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                                        style={{ backgroundColor: item.colorHex || getColorHex(item.variantName) }}
                                      />
                                    )}
                                    {item.variantName.includes("/")
                                      ? item.variantName.replace(/\/\s*([^\/]+)$/, "/ Size - $1")
                                      : item.variantName.match(/^(S|M|L|XL|2XL|3XL|XS)$/i)
                                      ? `Size - ${item.variantName}`
                                      : item.variantName}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2.5 sm:gap-3 rounded-full border border-gold-400/35 bg-ivory px-3 py-1.5 shadow-inner">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                  className="p-1 text-ink/70 transition-colors hover:text-ink"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </motion.button>
                                <span className="w-4 text-center text-base sm:text-lg font-bold text-ink">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                  className="p-1 text-ink/70 transition-colors hover:text-ink"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </motion.button>
                              </div>

                              {/* Product Price */}
                              <span className="text-base sm:text-lg font-black text-ink">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}
            </div>

            {/* Drawer Footer Summary */}
            {cart.length > 0 && (
              <div className="relative z-10 border-t border-gold-400/30 bg-white/95 px-4 sm:px-6 py-5 sm:py-6 shadow-2xl backdrop-blur-md space-y-3.5 sm:space-y-4">
                {/* Promo Code Input */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50/80 px-4 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-emerald-700 truncate">
                        Coupon {appliedCoupon.code} (-₹{appliedCoupon.discountAmount.toLocaleString("en-IN")})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 underline ml-2 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon Code"
                        className="w-full rounded-2xl border border-gold-400/30 bg-ivory pl-9 pr-3 py-2.5 text-sm sm:text-base font-bold text-ink placeholder:text-ink/40 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={applyingPromo || !promoCode}
                      className="shrink-0 rounded-2xl border border-gold-400/30 bg-ivory px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink transition-colors hover:border-gold-500 hover:bg-gold-500/10 disabled:opacity-50"
                    >
                      {applyingPromo ? "Checking…" : "Apply"}
                    </button>
                  </form>
                )}
                {promoError && <p className="text-xs sm:text-sm font-bold text-red-500">{promoError}</p>}

                {/* Subtotal & Discounts */}
                <div className="space-y-2 border-t border-gold-400/20 pt-3">
                  <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-ink/75">
                    <span className="uppercase tracking-wider font-extrabold">Subtotal</span>
                    <span className="text-base sm:text-lg font-bold text-ink">
                      ₹{cartSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {qtyDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-emerald-700">
                      <span className="uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Bulk Discount
                      </span>
                      <span>-₹{qtyDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {bundleDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-emerald-700">
                      <span className="uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Bundle Savings
                      </span>
                      <span>-₹{bundleDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {codeDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-emerald-700">
                      <span className="uppercase tracking-wider">Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{codeDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gold-400/20 pt-2.5 text-lg sm:text-xl font-black text-ink">
                    <span>Total Payable</span>
                    <span className="font-display text-xl sm:text-2xl font-black text-ink">
                      ₹{finalSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/checkout"
                    onClick={() => setDrawerOpen(false)}
                    className="btn-gold group block w-full text-center py-4 text-base sm:text-lg font-bold uppercase tracking-widest shadow-2xl"
                  >
                    Proceed to Checkout
                    <ArrowRight className="inline-block h-4 w-4 sm:h-5 sm:w-5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                {/* Security Badge Strip */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink/70">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-gold-600" /> 100% Safe
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-600" /> Easy Returns
                  </span>
                  <span>•</span>
                  <span>Fast Shipping</span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


