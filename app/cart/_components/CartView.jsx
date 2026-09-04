"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateQuantityDiscount, calculateBundleDiscount, nonBundleCartQuantity } from "@/lib/constants";
import { splitVariantName } from "@/lib/variantDisplay";

export default function CartView({ quantityDiscount, bundleSettings }) {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const nonBundleQty = nonBundleCartQuantity(cart);
  const qtyDiscount = calculateQuantityDiscount(nonBundleQty, quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-20 text-center px-4">
        <p className="font-display text-xl sm:text-2xl font-bold text-ink/70">Your bag is empty</p>
        <Link href="/shop" className="btn-gold mt-6 inline-flex px-8 py-3.5 text-base sm:text-lg font-bold">
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {cart.map((item) => {
          const { color, size } = splitVariantName(item.variantName);
          return (
          <li key={item.variantId} className="flex gap-3.5 sm:gap-4 py-5">
            <div className="relative h-24 w-20 sm:h-26 sm:w-22 shrink-0 overflow-hidden rounded-xl bg-ivory-deep border border-gold-400/25">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="90px" className="object-cover object-top" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/shop/${item.slug}`} className="font-display text-base sm:text-xl font-bold text-ink hover:text-gold-700 leading-snug line-clamp-2">
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-base text-ink/60 font-semibold mt-1">
                      {item.colorHex && (
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      )}
                      {color && <span>{color}</span>}
                      {color && size && <span className="text-ink/30">·</span>}
                      {size && <span>{size}</span>}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="p-1 text-ink/40 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 gap-2">
                <div className="flex items-center gap-3 rounded-full border border-ink/20 px-3.5 py-1.5">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Decrease" className="p-0.5">
                    <Minus className="h-4 w-4 text-ink/70 hover:text-ink" />
                  </button>
                  <span className="w-5 text-center text-base sm:text-lg font-bold text-ink">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Increase" className="p-0.5">
                    <Plus className="h-4 w-4 text-ink/70 hover:text-ink" />
                  </button>
                </div>
                <span className="font-black text-base sm:text-xl text-ink">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-base sm:text-lg text-ink/70 font-semibold uppercase tracking-wider">Subtotal</span>
        <span className="font-display text-2xl sm:text-3xl font-black text-ink">
          ₹{cartSubtotal.toLocaleString("en-IN")}
        </span>
      </div>
      {qtyDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between text-base sm:text-lg font-bold text-emerald-600">
          <span>Bulk Discount ({nonBundleQty} items)</span>
          <span>-₹{qtyDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}
      {bundleDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between text-base sm:text-lg font-bold text-emerald-600">
          <span>Bundle Discount</span>
          <span>-₹{bundleDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}
      <p className="mt-3 text-sm sm:text-base text-ink/60 font-medium">Shipping and any COD fee calculated at checkout.</p>

      <Link href="/checkout" className="btn-gold mt-8 w-full block text-center py-4 text-base sm:text-lg font-bold uppercase tracking-widest shadow-xl">
        Proceed to Checkout
      </Link>
    </>
  );
}
