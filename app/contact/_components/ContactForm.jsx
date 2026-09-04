"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { submitInquiry } from "@/actions/contact";
import { Send, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

const TOPICS = [
  "Size & Fit Help",
  "Order Status",
  "Returns & Exchange",
  "Bulk / Corporate",
  "General Query",
];

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, {});
  const [selectedTopic, setSelectedTopic] = useState("Size & Fit Help");
  const [message, setMessage] = useState("");

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-white p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md md:p-12"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/15 text-gold-600 shadow-inner ring-8 ring-gold-400/10"
        >
          <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-gold-600" />
        </motion.div>

        <span className="font-display mt-5 sm:mt-6 inline-flex text-sm sm:text-sm font-bold uppercase tracking-[0.2em] text-gold-600">
          Message Received
        </span>
        <h3 className="font-display mt-2 text-2xl sm:text-3xl font-extrabold text-ink">
          Thank You for Reaching Out
        </h3>
        <p className="mx-auto mt-2.5 max-w-sm text-base sm:text-base leading-relaxed text-ink/80 font-medium">
          We have received your message. Our support team will review it and respond to you within 2 hours.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="btn-gold w-full sm:w-auto px-7 py-3.5 text-sm sm:text-sm font-extrabold uppercase tracking-wider shadow-md"
          >
            Send Another Message
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/35 bg-white p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-gold-400">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl" />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-sm sm:text-sm font-extrabold uppercase tracking-[0.18em] text-gold-700">
            <Sparkles className="h-4 w-4" /> Send Us A Message
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm sm:text-sm font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4" /> Priority Response
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-black text-ink">
          How Can We Help You Today?
        </h3>
        <p className="mt-1.5 text-sm sm:text-base text-ink/80 font-medium">
          Select a topic below or type your query &mdash; we reply within 2 hours.
        </p>
      </div>

      <form action={formAction} className="space-y-4 sm:space-y-6">
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 rounded-2xl border border-red-500/30 bg-red-50 p-3.5 text-sm font-bold text-red-600"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            {state.error}
          </motion.div>
        )}

        {/* Hidden Topic Input + Select Chips */}
        <input type="hidden" name="topic" value={selectedTopic} />
        <div>
          <label className="mb-2 block text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
            What is your query about?
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-full px-3.5 py-1.5 text-sm sm:text-sm font-bold transition-all duration-300 ${
                  selectedTopic === topic
                    ? "bg-gold-500 text-ink shadow-sm ring-2 ring-gold-400/40"
                    : "border border-gold-400/30 bg-[#f7f2ea] text-ink/80 hover:border-gold-400 hover:text-ink"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Amaira Sharma"
              className="w-full rounded-xl sm:rounded-2xl border border-gold-400/30 bg-[#fbf9f4] px-4 py-3.5 text-sm sm:text-base font-medium text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl sm:rounded-2xl border border-gold-400/30 bg-[#fbf9f4] px-4 py-3.5 text-sm sm:text-base font-medium text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
                Phone / WhatsApp
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full rounded-xl sm:rounded-2xl border border-gold-400/30 bg-[#fbf9f4] px-4 py-3.5 text-sm sm:text-base font-medium text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/30"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
                Your Message <span className="text-red-500">*</span>
              </label>
              <span className="text-xs sm:text-sm font-semibold text-ink/50">
                {message.length} / 500
              </span>
            </div>
            <textarea
              required
              name="message"
              rows={4}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe what you need help with..."
              className="w-full resize-none rounded-xl sm:rounded-2xl border border-gold-400/30 bg-[#fbf9f4] px-4 py-3.5 text-sm sm:text-base font-medium text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/30"
            />
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="btn-gold group inline-flex w-full sm:w-fit items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-sm font-extrabold uppercase tracking-[0.18em] shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                Sending Message...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                Submit Inquiry
              </span>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}



