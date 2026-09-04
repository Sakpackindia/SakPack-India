"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export default function NotFoundContent() {
  return (
    <main className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory px-6 py-20 text-center">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-300/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-xl">
        {/* Animated 404 Watermark Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/40 bg-white shadow-[0_15px_40px_rgba(202,161,75,0.15)]"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-dashed border-gold-400/50"
          />
          <Compass className="h-10 w-10 text-gold-600 stroke-[1.5]" />
        </motion.div>

        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" /> Error 404 — Page Not Found
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-ink leading-tight"
        >
          Looking For <span className="text-transparent bg-clip-text bg-gold-gradient-text">Luxury?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 text-base sm:text-lg text-ink/70 font-medium leading-relaxed max-w-md mx-auto"
        >
          The page you are trying to reach might have been moved or no longer exists. Let&apos;s guide you back to our luxury collection.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-base font-black uppercase tracking-widest text-gold-300 shadow-xl transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:scale-105"
          >
            Explore Shop Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-gold-400/40 bg-white px-9 py-4 text-base font-black uppercase tracking-widest text-ink transition-all duration-300 hover:border-gold-400 hover:bg-gold-400/10 hover:scale-105"
          >
            Back To Homepage
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
