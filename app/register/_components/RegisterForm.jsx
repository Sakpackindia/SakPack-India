"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";
import { registerDirect } from "@/actions/auth";
import { LogoMark } from "@/components/Logo";

const inputClass =
  "w-full rounded-xl sm:rounded-2xl border border-gold-400/35 bg-ivory/50 py-3.5 pl-11 sm:pl-12 pr-4 text-base font-semibold text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20 hover:border-gold-400/60 shadow-sm";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, pending] = useActionState(registerDirect, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/35 bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl"
    >
      {/* Top Gold Hairline Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent z-20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-ink/5 blur-3xl" />

      {/* Brand Icon Header */}
      <div className="relative mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gold-400/40 blur-md"
        />
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
          className="relative h-14 w-14 sm:h-16 sm:w-16 drop-shadow-xl"
        >
          <LogoMark className="h-full w-full" />
        </motion.div>
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-gold-400/15 px-3.5 sm:px-4 py-1 text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-gold-700">
          <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse shrink-0" /> Join Sakpack
        </span>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink leading-tight">
          Create an <span className="text-transparent bg-clip-text bg-gold-gradient-text">Account</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-ink/75 font-medium leading-relaxed">Faster checkout and order tracking, every visit.</p>
      </div>

      <form action={formAction} className="relative mt-6 space-y-3.5 sm:space-y-4">
        <input type="hidden" name="redirect_to" value={redirectTo} />
        {state.error && (
          <div className="flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 sm:p-4 text-sm font-bold text-red-600 animate-fadeUp">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            {state.error}
          </div>
        )}

        {/* Name Input */}
        <div className="relative group">
          <User className="absolute left-3.5 sm:left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gold-600/80 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input required name="full_name" placeholder="Full Name" className={inputClass} />
        </div>

        {/* Email Input */}
        <div className="relative group">
          <Mail className="absolute left-3.5 sm:left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gold-600/80 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
        </div>

        {/* Phone Input */}
        <div className="relative group">
          <Phone className="absolute left-3.5 sm:left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gold-600/80 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input name="phone" type="tel" placeholder="Phone Number" className={inputClass} />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <Lock className="absolute left-3.5 sm:left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gold-600/80 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input
            required
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password (min. 6 chars)"
            className={`${inputClass} pr-11 sm:pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-gold-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ink py-4 text-sm sm:text-base font-black uppercase tracking-widest text-gold-300 shadow-xl transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:shadow-[0_0_25px_rgba(202,161,75,0.4)] disabled:opacity-50 active:scale-95"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-300 border-t-transparent" />
              Creating account…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-gold-300 shrink-0" />
              Create Account
            </span>
          )}
        </motion.button>
      </form>

      <p className="relative mt-6 sm:mt-7 text-center text-sm sm:text-base text-ink/80 font-medium">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-gold-700 hover:text-gold-600 font-extrabold uppercase tracking-wider transition-colors underline underline-offset-4 decoration-gold-400/40"
        >
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
