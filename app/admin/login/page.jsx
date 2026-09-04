"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { adminLogin } from "@/actions/auth";
import { Mail, Lock, ShieldCheck, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ivory px-6 overflow-hidden">

      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gold-400/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute -bottom-[10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-ink/5 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="card-panel relative z-10 w-full max-w-md p-8 sm:p-12"
      >
        {/* Decorative Top Border Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer rounded-t-2xl" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/10 blur-3xl" />

        {/* Header Section */}
        <div className="relative mb-8 flex flex-col items-center text-center">
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gold-400/40 blur-md"
            />
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
              className="relative flex h-20 w-20 items-center justify-center drop-shadow-xl"
            >
              <LogoMark className="h-full w-full" />
            </motion.div>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink tracking-wide">
            Admin <span className="text-transparent bg-clip-text bg-gold-gradient-text">Login</span>
          </h1>
          <p className="mt-2 text-base text-ink/50 font-light flex items-center gap-1.5 justify-center">
            <ShieldCheck className="h-4 w-4 text-gold-600/80" /> Authorized users only
          </p>

          <div className="w-16 h-px bg-gold-gradient mt-5" />
        </div>

        {/* Form Section */}
        <form action={formAction} className="relative space-y-4">
          {state.error && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-base text-red-500 flex items-center gap-2 animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {state.error}
            </div>
          )}

          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600/70 group-focus-within:text-gold-600 transition-colors duration-300" />
            <input
              required
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full rounded-2xl border border-ink/10 bg-ivory-deep/60 pl-12 pr-5 py-4 text-base text-ink placeholder:text-ink/30 transition-all duration-300 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/25"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600/70 group-focus-within:text-gold-600 transition-colors duration-300" />
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-2xl border border-ink/10 bg-ivory-deep/60 pl-12 pr-12 py-4 text-base text-ink placeholder:text-ink/30 transition-all duration-300 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-gold-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className="btn-gold w-full py-4 text-base disabled:opacity-60"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                Checking Details...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Sign In
              </span>
            )}
          </motion.button>
        </form>

        {/* Back to Shop Link */}
        <div className="relative mt-8 text-center border-t border-ink/10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-semibold tracking-widest text-ink/40 hover:text-gold-600 transition-colors uppercase duration-300 group/btn"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Shop
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
