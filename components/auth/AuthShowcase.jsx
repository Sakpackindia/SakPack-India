"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Leaf, Truck } from "lucide-react";
import HangerGlyph from "@/components/HangerGlyph";

const POINTS = [
  { icon: Leaf, text: "Premium, breathable fabrics for everyday comfort", title: "Pure Soft Fabric" },
  { icon: ShieldCheck, text: "Trusted quality, handpicked for every body", title: "Tailored Luxury Fit" },
  { icon: Truck, text: "Pan-India shipping, cash on delivery available", title: "Express Dispatch" },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden h-full min-h-[85vh] flex-col justify-center overflow-hidden bg-gradient-to-br from-[#2c0e18] via-ink to-[#1a080e] px-16 py-16 lg:flex">
      {/* Background Ambient Glows */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-gold-400/20 blur-[130px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-gold-300/15 blur-[150px]"
      />
      
      {/* Watermark Hanger Graphic */}
      <HangerGlyph className="pointer-events-none absolute right-4 top-1/2 h-[32rem] w-auto -translate-y-1/2 opacity-[0.06] text-gold-300" />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md z-10"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-base font-black uppercase tracking-[0.25em] text-gold-300 shadow-inner backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-gold-400 animate-pulse" /> Sakpack Luxury Experience
        </span>

        <h2 className="mt-6 font-display text-4xl leading-[1.15] text-ivory xl:text-5xl font-black uppercase tracking-tight">
          Style Worth <br />
          <span className="text-transparent bg-clip-text bg-gold-gradient-text bg-[length:200%_200%] animate-shimmer">
            Coming Back To
          </span>
        </h2>
        
        <p className="mt-4 text-base leading-relaxed text-ivory/80 font-medium max-w-sm">
          Create your account to unlock private wardrobe collections, track orders live, and checkout faster.
        </p>

        {/* Feature Cards Grid */}
        <div className="mt-10 space-y-3.5">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 rounded-2xl border border-gold-400/25 bg-white/5 p-3.5 backdrop-blur-md transition-all duration-300 hover:border-gold-400/60 hover:bg-white/10 group shadow-lg"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/40 bg-gold-gradient text-ink font-black shadow-md group-hover:scale-105 transition-transform duration-300">
                <p.icon className="h-5 w-5 text-ink" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-base font-black uppercase tracking-wider text-gold-300">
                  {p.title}
                </p>
                <p className="text-base text-ivory/80 font-medium mt-0.5">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
