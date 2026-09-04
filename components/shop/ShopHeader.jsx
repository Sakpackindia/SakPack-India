"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Filter } from "lucide-react";

export default function ShopHeader({ heading, productCount, categoryLinks, children }) {
  return (
    <section className="relative bg-[#fcf9f2] py-8 sm:py-12 border-b border-gold-400/25">
      {/* Background Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(202,161,75,0.15)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-base font-semibold uppercase tracking-wider text-ink/50"
        >
          <Link href="/" className="transition-colors hover:text-gold-600">Home</Link>
          <ChevronRight className="h-3 w-3 text-gold-500/70" />
          <span className="text-gold-700 font-bold">Shop</span>
        </motion.nav>

        {/* Top Header Banner Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-white/90 px-3 py-0.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] text-gold-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold-600 animate-pulse" />
              Luxury Everyday Collection
            </div>
            
            <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl md:text-5xl leading-none">
              {heading}
            </h1>

            <p className="mt-2.5 text-base sm:text-base font-medium text-ink/70">
              Showing <span className="font-extrabold text-gold-700">{productCount}</span> curated item{productCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="shrink-0">
            {children}
          </div>
        </motion.div>

        {/* Horizontal Category Pill Selector (Mobile & Tablet only) */}
        {categoryLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="no-scrollbar mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden snap-x snap-mandatory"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-700">
              <Filter className="h-3.5 w-3.5" />
            </div>

            {categoryLinks.map((cat) => (
              <div key={cat.id ?? "all"} className="shrink-0 snap-start">
                <Link
                  href={cat.href}
                  scroll={false}
                  className={`block rounded-full border px-4 py-1.5 text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${
                    cat.active
                      ? "border-gold-400/80 bg-ink text-gold-300 shadow-md shadow-ink/20"
                      : "border-gold-400/25 bg-white/90 text-ink/75 shadow-sm backdrop-blur-sm active:scale-95"
                  }`}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Shimmering Bottom Edge Sheen */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
    </section>
  );
}
