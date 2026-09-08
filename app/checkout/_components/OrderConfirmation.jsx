"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation({ orderNumber, paymentId }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gold-400/40 bg-white p-5 sm:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl"
    >
      {/* Shimmer hairline sheen & glowing Orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent z-20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-ink/5 blur-3xl" />

      {/* Animated Checkmark Badge */}
      <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gold-400/40 blur-md"
        />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold-300 shadow-xl ring-2 ring-gold-400/30"
        >
          <CheckCircle2 className="h-7 w-7 text-gold-300" strokeWidth={2} />
        </motion.div>
      </div>

      {/* Pill Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/15 px-3.5 py-1 text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-gold-700 shadow-sm">
        Order Placed &amp; Confirmed
      </span>

      <h2 className="mt-2.5 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-ink leading-tight">
        Thank You <span className="text-transparent bg-clip-text bg-gold-gradient-text">For Your Order!</span>
      </h2>

      {/* Order Number Box */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-gold-400/35 bg-ivory/60 px-4 py-2.5 sm:px-5 sm:py-2.5 shadow-inner">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-ink/50">Ref:</span>
        <span className="font-mono text-base sm:text-lg font-black text-gold-700 tracking-wider select-all">
          {orderNumber}
        </span>
        {paymentId && (
          <span className="text-xs sm:text-sm font-bold text-ink/70 border-t sm:border-t-0 sm:border-l border-gold-400/30 pt-1 sm:pt-0 sm:pl-3 w-full sm:w-auto">
            PID: <span className="font-mono text-ink font-bold">{paymentId}</span>
          </span>
        )}
      </div>

      <p className="mt-3.5 text-base sm:text-lg text-ink/70 font-semibold max-w-sm mx-auto leading-relaxed">
        Order preparing for express dispatch. Live tracking updates sent via SMS &amp; WhatsApp.
      </p>

      {/* Compact Live Delivery Timeline */}
      <div className="mt-5 rounded-2xl border border-gold-400/25 bg-white/90 p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2 relative">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-ink font-black text-xs sm:text-sm shadow-sm mb-1">
              ✓
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-ink">Order Placed</span>
            <span className="text-xs sm:text-sm text-emerald-600 font-bold">Confirmed</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-90">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-gold-300 font-black text-xs sm:text-sm shadow-sm mb-1 animate-pulse">
              2
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">Packing</span>
            <span className="text-xs sm:text-sm text-gold-700 font-bold">In Progress</span>
          </div>

          <div className="flex flex-col items-center text-center opacity-60">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 bg-ivory text-ink/50 font-bold text-xs sm:text-sm mb-1">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink/70">Delivery</span>
            <span className="text-xs sm:text-sm text-ink/50 font-medium">5-7 Days</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/shop" className="w-full sm:w-auto rounded-full bg-ink px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-gold-300 shadow-md hover:bg-gold-400 hover:text-ink transition-all whitespace-nowrap">
          Continue Shopping
        </Link>
        <Link href="/account" className="w-full sm:w-auto rounded-full border border-gold-400/40 bg-white px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-ink hover:border-gold-400 hover:bg-gold-400/10 transition-all whitespace-nowrap">
          Track Order Status
        </Link>
      </div>
    </motion.div>
  );
}
