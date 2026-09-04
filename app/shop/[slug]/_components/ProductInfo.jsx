"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";
import StarRating from "@/components/StarRating";

export default function ProductInfo({ color, name, reviewCount, averageRating, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Badges Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {color && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/15 px-3.5 py-1 text-base font-extrabold uppercase tracking-[0.2em] text-gold-700 shadow-sm">
            <Sparkles className="h-3 w-3 text-gold-600 animate-pulse" />
            {color}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-white/90 px-3 py-1 text-base font-extrabold uppercase tracking-[0.2em] text-ink/80 shadow-sm backdrop-blur-sm">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          100% Authentic
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-ink leading-tight">
        {name}
      </h1>

      {/* Gold Divider Sheen Line */}
      <div className="mt-4 flex items-center gap-2">
        <span className="h-[2px] w-12 bg-gradient-to-r from-transparent via-gold-400 to-gold-500 rounded-full" />
        <span className="h-[2px] w-2 bg-gold-400 rounded-full" />
      </div>

      {/* Ratings Pill */}
      <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gold-400/30 bg-white/90 px-3.5 sm:px-4 py-1.5 shadow-sm backdrop-blur-sm">
        <StarRating rating={reviewCount > 0 ? averageRating : 0} showValue />
        <span className="h-3 w-[1px] bg-gold-400/35 shrink-0" />
        <span className="text-base sm:text-base text-ink/80 font-bold uppercase tracking-wider whitespace-nowrap truncate">
          {reviewCount > 0
            ? `${reviewCount} Verified review${reviewCount === 1 ? "" : "s"}`
            : "0 Reviews • Be First to Review"}
        </span>
      </div>

      {description && (
        <p className="mt-5 text-lg sm:text-lg leading-relaxed text-ink/80 font-medium whitespace-pre-wrap">
          {description}
        </p>
      )}
    </motion.div>
  );
}
