"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Minus, Plus, ShoppingBag, Truck, MessageSquare, Check, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { whatsappLink } from "@/lib/constants";
import { useProductVariant } from "./ProductVariantContext";
import PincodeChecker from "./PincodeChecker";
import ShareButton from "./ShareButton";

function getEstimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getViewerCount() {
  return Math.floor(Math.random() * 91) + 10;
}

export default function ProductPurchasePanel({ product, variants }) {
  const router = useRouter();
  const ctx = useProductVariant();
  const defaultVariant = variants[0];
  const [localSelectedId, setLocalSelectedId] = useState(defaultVariant?.id);
  const selectedId = ctx ? ctx.selectedId : localSelectedId;
  const setSelectedId = ctx ? ctx.setSelectedId : setLocalSelectedId;
  const [quantity, setQuantity] = useState(1);
  const [viewerCount, setViewerCount] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const { addToCart, setDrawerOpen } = useCart();

  const selected = variants.find((v) => v.id === selectedId) || defaultVariant;
  const inStock = selected && selected.stock_quantity > 0;

  useEffect(() => {
    setViewerCount(getViewerCount());
    setDeliveryDate(getEstimatedDeliveryDate());
  }, []);

  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-ink/15 p-6 text-base text-ink/50">
        This product is currently unavailable. Message us on WhatsApp for availability.
      </div>
    );
  }

  // One "Select Size" button per distinct size name, one swatch per distinct
  // color. Colors are optional — a single-color product simply has no color
  // values on its variants, so colorNames stays empty and no picker renders.
  const sizeNames = Array.from(new Set(variants.map((v) => v.variant_name)));
  const colorNames = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));

  const selectSize = (name) => {
    // Prefer keeping the currently selected color, falling back to any
    // in-stock option for that size, then any option at all.
    const sameColor = selected?.color
      ? variants.find((v) => v.variant_name === name && v.color === selected.color)
      : null;
    const inStockMatch = variants.find((v) => v.variant_name === name && v.stock_quantity > 0);
    const any = variants.find((v) => v.variant_name === name);
    const match = (sameColor?.stock_quantity > 0 && sameColor) || inStockMatch || sameColor || any;
    if (match) setSelectedId(match.id);
  };

  const selectColor = (color) => {
    // Prefer keeping the currently selected size, falling back to any
    // in-stock option for that color, then any option at all.
    const sameSize = selected?.variant_name
      ? variants.find((v) => v.color === color && v.variant_name === selected.variant_name)
      : null;
    const inStockMatch = variants.find((v) => v.color === color && v.stock_quantity > 0);
    const any = variants.find((v) => v.color === color);
    const match = (sameSize?.stock_quantity > 0 && sameSize) || inStockMatch || sameSize || any;
    if (match) setSelectedId(match.id);
  };

  const buildCartItem = () => ({
    variantId: selected.id,
    productId: product.id,
    name: product.name,
    variantName: [selected.color, selected.variant_name].filter(Boolean).join(" / "),
    colorHex: selected.color_hex || null,
    price: selected.price,
    image: selected.image_url || product.featured_image_url || product.images?.[0] || "/placeholder.jpg",
    slug: product.slug,
  });

  const handleAdd = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!selected || !inStock) return;
    addToCart(buildCartItem(), quantity);
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Price Display */}
      <div className="flex flex-wrap items-baseline gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={selected.price}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight"
          >
            ₹{selected.price?.toLocaleString("en-IN")}
          </motion.span>
        </AnimatePresence>

        {selected.original_price && selected.original_price > selected.price && (
          <span className="text-lg sm:text-lg text-ink/40 line-through font-semibold">
            ₹{selected.original_price?.toLocaleString("en-IN")}
          </span>
        )}
        {selected.original_price && selected.original_price > selected.price && (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-base font-black uppercase tracking-wider text-amber-700 border border-amber-400/30">
            {Math.round(((selected.original_price - selected.price) / selected.original_price) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Color swatches */}


      {colorNames.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-base sm:text-lg font-extrabold uppercase tracking-[0.2em] text-gold-700 flex items-center gap-1.5">
              Select Color
            </p>
            {selected?.color && (
              <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-wider">
                {selected.color}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3.5">
            {colorNames.map((color) => {
              const optionsForColor = variants.filter((v) => v.color === color);
              const colorInStock = optionsForColor.some((v) => v.stock_quantity > 0);
              const isSelected = selected.color === color;
              const colorHex = optionsForColor[0]?.color_hex;
              return (
                <motion.button
                  key={color}
                  whileHover={colorInStock ? { scale: 1.08 } : undefined}
                  whileTap={colorInStock ? { scale: 0.94 } : undefined}
                  disabled={!colorInStock}
                  onClick={() => selectColor(color)}
                  title={color}
                  aria-label={color}
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-ivory" : ""
                  }`}
                >
                  {colorHex ? (
                    <span
                      className="h-full w-full rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
                      style={{ backgroundColor: colorHex }}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full border border-gold-400/40 bg-white/95 text-sm font-extrabold uppercase text-ink/70 shadow-sm">
                      {color.slice(0, 2)}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="absolute inset-0 m-auto h-4.5 w-4.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] stroke-[3]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size buttons */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base sm:text-lg font-extrabold uppercase tracking-[0.2em] text-gold-700">
            Select Size
          </p>
          {selected?.variant_name && (
            <span className="font-display text-base sm:text-lg font-extrabold text-ink uppercase tracking-wider">
              Selected: {selected.variant_name}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {sizeNames.map((name) => {
            const optionsForSize = variants.filter(
              (v) => v.variant_name === name && (!selected?.color || v.color === selected.color)
            );
            const sizeInStock = optionsForSize.some((v) => v.stock_quantity > 0);
            const isSelected = selected.variant_name === name;
            return (
              <div key={name} className="flex flex-col items-stretch gap-1">
                <motion.button
                  whileHover={sizeInStock ? { scale: 1.06 } : undefined}
                  whileTap={sizeInStock ? { scale: 0.95 } : undefined}
                  disabled={!sizeInStock}
                  onClick={() => selectSize(name)}
                  className={`flex h-12 sm:h-13 min-w-[56px] items-center justify-center gap-2 rounded-2xl border px-5 sm:px-6 text-base sm:text-lg font-black uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? "border-gold-400 bg-ink text-gold-300 shadow-md shadow-ink/25 ring-2 ring-gold-400/40"
                      : "border-gold-400/30 bg-white/95 text-ink/80 shadow-sm backdrop-blur-sm hover:border-gold-400 hover:text-ink hover:shadow"
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4 text-gold-300 stroke-[2.5]" />}
                  <span>{name}</span>
                </motion.button>
                {!sizeInStock && (
                  <span className="w-full rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-600">
                    Sold out
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {!inStock && <p className="mt-3 text-base sm:text-lg text-rose-600 font-extrabold uppercase tracking-wider">This size is currently out of stock.</p>}
      </div>

      {/* Action Buttons: Quantity + Add to Bag side-by-side on mobile row 1, Buy Now row 2; 1 single straight row on desktop */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3.5">
        {/* Mobile Row 1: Quantity + Add to Bag */}
        <div className="flex items-center gap-2.5 sm:contents">
          {/* Quantity Selector */}
          <div className="flex h-12 sm:h-14 w-[110px] sm:w-auto shrink-0 items-center justify-between rounded-full border border-gold-400/40 bg-white px-3 sm:px-6 shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-ink/60 hover:text-ink transition-colors p-1"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 sm:w-7 text-center font-display text-base sm:text-xl font-extrabold text-ink">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-ink/60 hover:text-ink transition-colors p-1"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Bag CTA */}
          <motion.button
            whileHover={inStock ? { scale: 1.02 } : undefined}
            whileTap={inStock ? { scale: 0.98 } : undefined}
            onClick={handleAdd}
            disabled={!inStock}
            className="flex-1 h-12 sm:h-14 rounded-full bg-ink px-4 sm:px-8 text-sm sm:text-lg font-black uppercase tracking-widest text-gold-300 shadow-lg transition-all duration-300 hover:bg-gold-400 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> Add to Bag
          </motion.button>
        </div>

        {/* Buy Now CTA */}
        <motion.button
          whileHover={inStock ? { scale: 1.02 } : undefined}
          whileTap={inStock ? { scale: 0.98 } : undefined}
          onClick={handleBuyNow}
          disabled={!inStock}
          className="w-full sm:flex-1 h-12 sm:h-14 rounded-full border border-gold-400/80 bg-gold-gradient px-4 sm:px-8 text-sm sm:text-lg font-black uppercase tracking-widest text-ink shadow-[0_0_20px_rgba(202,161,75,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(202,161,75,0.5)] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-ink" fill="currentColor" /> Buy Now
        </motion.button>
      </div>


      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3.5 border-t border-gold-400/15 bg-white/95 px-4.5 py-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg sm:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base text-ink/60 font-semibold">{product.name}</p>
          <p className="font-display text-lg font-black text-ink">₹{selected.price.toLocaleString("en-IN")}</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="btn-gold shrink-0 px-7 py-3.5 text-base sm:text-lg font-extrabold disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2"
        >
          <ShoppingBag className="h-4.5 w-4.5" /> {inStock ? "Add to Bag" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}


