"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, SendHorizonal } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { requestPasswordReset } from "@/actions/auth";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-ivory-deep/60 py-4 pl-12 pr-4 text-lg text-ink placeholder:text-ink/30 transition-all duration-300 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/25";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="card-panel relative w-full max-w-md p-8 sm:p-12"
    >
      {/* Top Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer rounded-t-2xl" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/10 blur-3xl" />

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
        className="relative mx-auto mb-6 h-20 w-20 drop-shadow-xl"
      >
        <LogoMark className="h-full w-full" />
      </motion.div>

      <span className="eyebrow relative flex justify-center text-base font-semibold uppercase tracking-widest text-gold-600">
        Forgot Password
      </span>
      <h1 className="relative mt-3 whitespace-nowrap text-center font-display text-2xl sm:text-3xl text-ink font-bold">Reset Your Password</h1>
      <p className="relative mt-3 text-center text-lg text-ink/50 font-light">
        Enter your account email and we&apos;ll send you a reset link.
      </p>

      {state.success ? (
        <div className="relative mt-9 flex items-center gap-2 rounded-2xl border border-green-500/25 bg-green-500/10 p-4 text-base text-green-600 animate-fadeUp">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="relative mt-9 space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-base text-red-500 animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {state.error}
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600/70 group-focus-within:text-gold-600 transition-colors duration-300" />
            <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className="btn-gold w-full py-4 text-base disabled:opacity-60"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory border-t-transparent" />
                Sending…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <SendHorizonal className="h-3.5 w-3.5" />
                Send Reset Link
              </span>
            )}
          </motion.button>
        </form>
      )}

      <p className="relative mt-7 text-center text-lg text-ink/50 font-light">
        Remembered it?{" "}
        <Link href="/login" className="text-gold-700 hover:text-gold-600 transition-colors font-semibold">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
