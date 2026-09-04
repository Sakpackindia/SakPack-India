"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Sparkles } from "lucide-react";
import HangerGlyph from "./HangerGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product.variantId || !product.inStock) return;
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: [product.variantColor, product.variantName].filter(Boolean).join(" / "),
      colorHex: product.variantColorHex || null,
      price: product.price,
      image: product.image,
    });
    showToast(`${product.name} added to your bag.`);
  };

  const discountPct =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const reviewCount = product.reviewCount || 245;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/60 p-2.5 sm:p-3.5 shadow-sm transition-all duration-500 hover:border-gold-400 hover:shadow-[0_15px_35px_-10px_rgba(202,161,75,0.3)]"
      >
        {/* Product Image Box */}
        <div className="relative aspect-square shrink-0 w-full overflow-hidden rounded-xl bg-[#f9f5ed] border border-gold-400/20 shadow-inner">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ivory-deep to-white">
              <HangerGlyph className="h-14 w-auto text-gold-600/40" />
            </div>
          )}

          {/* Hover Image Overlay with Quick View pill */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 flex items-end justify-center pb-3">
            <span className="rounded-full border border-gold-300/40 bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-ink shadow-md backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
              View Product
            </span>
          </div>

          {/* Badge Tag */}
          {product.badge && (
            <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-20 flex items-center gap-1 rounded-full border border-gold-400/40 bg-ink/95 px-2 py-0.5 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gold-300 shadow-md backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5 text-gold-400" />
              {product.badge}
            </span>
          )}

          {/* Quick Add Button */}
          {product.variantId && product.inStock && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to bag`}
              className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gold-400/40 bg-ink text-gold-300 shadow-lg transition-all duration-300 hover:border-gold-300 hover:bg-gold-400 hover:text-ink hover:shadow-[0_0_22px_rgba(202,161,75,0.6)]"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
            </motion.button>
          )}
        </div>

        {/* Content Box */}
        <div className="flex flex-1 flex-col pt-2.5 px-0.5">
          <h3 className="line-clamp-2 font-display text-xs sm:text-sm font-bold uppercase tracking-tight text-ink leading-snug transition-colors duration-300 group-hover:text-gold-600">
            {product.name}
          </h3>

          {/* 5 Stars Rating & Count */}
          <div className="mt-1 flex items-center gap-1 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-ink/50 text-[10px] sm:text-[11px] font-semibold">({reviewCount})</span>
          </div>

          {/* Price & Discount Row */}
          <div className="mt-auto flex items-center gap-1.5 pt-1.5 flex-wrap">
            <span className="font-display font-extrabold text-ink text-xs sm:text-base tracking-tight">
              {product.price != null ? `₹${product.price.toLocaleString("en-IN")}` : "—"}
            </span>
            
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-ink/40 line-through font-medium">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}

            {discountPct && (
              <span className="rounded-full bg-amber-400/15 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider text-amber-700 border border-amber-400/25">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {!product.inStock && (
            <p className="mt-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-rose-600">
              Out of stock
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}


