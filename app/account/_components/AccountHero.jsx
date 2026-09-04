"use client";

import { motion } from "framer-motion";
import { LogOut, Package, Sparkles, Crown } from "lucide-react";

function getInitials(name) {
  if (!name) return "SC";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "SC";
}

export default function AccountHero({ profile, orderCount, logoutAction }) {
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="card-panel relative mb-6 sm:mb-8 overflow-hidden p-5 sm:p-8"
    >
      {/* Decorative gradient wash + glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-400/[0.08] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/15 blur-[80px]"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-ink/10 blur-[90px]"
      />

      <div className="relative flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative shrink-0">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-full bg-gold-gradient opacity-70 blur-[2px]"
            />
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-2 rounded-full bg-gold-400/40 blur-lg"
            />
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-ink text-lg sm:text-2xl font-black text-gold-300 shadow-xl ring-2 ring-white">
              {getInitials(profile?.full_name)}
            </div>
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-1 -right-1 flex h-5.5 w-5.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gold-gradient shadow-md ring-2 ring-white"
            >
              <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ink" />
            </motion.span>
          </div>

          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold uppercase tracking-[0.18em] text-gold-600">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Welcome Back
            </p>
            <h1 className="mt-0.5 font-display text-2xl sm:text-3xl font-black text-ink leading-tight break-words">
              {profile?.full_name || "Sakpack Customer"}
            </h1>
            <p className="mt-1 text-sm sm:text-base font-semibold text-ink/75 break-all">{profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3.5 sm:shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-gold-400/15">
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/15 to-gold-400/5 px-4 py-2.5 sm:px-4.5 sm:py-3 shadow-sm"
          >
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-md">
              <Package className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg sm:text-xl font-black text-ink">{orderCount}</p>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/60">Orders</p>
            </div>
          </motion.div>

          <form action={logoutAction}>
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="group flex items-center justify-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-red-500 shadow-sm transition-all duration-300 hover:border-red-400/50 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span>Log Out</span>
            </motion.button>
          </form>
        </div>
      </div>

      {memberSince && (
        <p className="relative mt-4 sm:mt-5 border-t border-gold-400/10 pt-3.5 sm:pt-4 text-sm sm:text-base text-ink/70 font-semibold">
          Member since {memberSince}
        </p>
      )}
    </motion.div>
  );
}
