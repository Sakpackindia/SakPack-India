"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Copy, Check } from "lucide-react";

export default function PromoBanner({
  code = "SAKPACK30",
  discount = "30%",
  subtitle = "Special Deals Just For You!",
  image = "/hero-model.jpg",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="relative bg-ivory py-6 sm:py-8 md:py-10">
      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-gold-400/35 bg-gradient-to-r from-[#340917] via-[#2a0611] to-[#1c030b] shadow-2xl">
          {/* Top & Bottom Shimmer Hairline Borders */}
          <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer opacity-80" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer opacity-80" />

          {/* Radial Ambient Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,161,75,0.12),transparent_70%)]" />

          <div className="relative px-5 py-6 sm:px-8 md:px-10 md:py-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
              
              {/* Main 3 Columns Row */}
              <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-around sm:text-left md:justify-center md:gap-8 lg:gap-12 xl:gap-14">
                
                {/* Column 1: LIMITED TIME OFFER + Special Deals Just For You! */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3.5"
                >
                  {/* Gold Tag Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-gradient-to-br from-gold-400/20 to-gold-600/10 text-[#dfb15b] shadow-md">
                    <Tag className="h-6 w-6 stroke-[1.8] -rotate-12 text-[#dfb15b]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[12.5px] font-black uppercase tracking-[0.25em] text-ivory/80">
                      Limited Time Offer
                    </p>
                    <p className="font-serif text-[28px] sm:text-[34px] italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-ivory via-gold-100 to-gold-300 mt-0.5">
                      Special Deals
                    </p>
                    <p className="font-serif text-[28px] sm:text-[34px] italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-ivory via-gold-100 to-gold-300">
                      Just For You!
                    </p>
                  </div>
                </motion.div>

                {/* Vertical Divider 1 with center gold dot */}
                <div className="hidden h-16 w-px shrink-0 items-center justify-center bg-gold-400/30 sm:flex relative">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#dfb15b] shadow-[0_0_8px_rgba(223,177,91,0.8)]" />
                </div>

                {/* Column 2: FLAT 30% OFF */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="text-[13.5px] font-extrabold uppercase tracking-[0.25em] text-gold-300/90">
                    FLAT
                  </p>
                  <p className="font-display text-[54px] sm:text-[66px] font-black uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#f7e3ad] via-[#dfb15b] to-[#b8852c] my-0.5 drop-shadow-sm">
                    30%
                  </p>
                  <p className="text-[13.5px] font-extrabold uppercase tracking-[0.25em] text-gold-300/90">
                    OFF
                  </p>
                </motion.div>

                {/* Vertical Divider 2 with center gold dot */}
                <div className="hidden h-16 w-px shrink-0 items-center justify-center bg-gold-400/30 sm:flex relative">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#dfb15b] shadow-[0_0_8px_rgba(223,177,91,0.8)]" />
                </div>

                {/* Column 3: ON YOUR FIRST ORDER + Use Code + SHOP NOW */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center text-center sm:items-start sm:text-left gap-2.5"
                >
                  <p className="text-[13.5px] font-extrabold uppercase tracking-[0.2em] text-ivory/90">
                    On Your First Order
                  </p>
                  
                  <button
                    onClick={handleCopyCode}
                    title="Click to copy promo code"
                    className="group relative flex items-center gap-1.5 text-[13.5px] font-semibold text-ivory/80"
                  >
                    Use Code:{" "}
                    <span className="inline-flex items-center gap-1 font-mono text-[15.5px] font-black uppercase tracking-wider text-[#e3ba63] underline decoration-dashed decoration-gold-400/50 underline-offset-4">
                      {code}
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 opacity-70" />}
                    </span>

                    <AnimatePresence>
                      {copied && (
                        <motion.span
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: -24, scale: 1 }}
                          exit={{ opacity: 0, y: -30, scale: 0.9 }}
                          className="absolute left-1/2 -translate-x-1/2 rounded-full border border-gold-400/50 bg-gold-gradient px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-ink shadow-lg"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <Link
                    href="/shop"
                    className="group/cta mt-0.5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#edd392] via-[#d4a345] to-[#b3832c] px-8 py-2.5 text-[13.5px] font-black uppercase tracking-[0.2em] text-[#340917] shadow-[0_0_20px_rgba(212,163,89,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,163,89,0.6)] active:scale-95"
                  >
                    SHOP NOW
                  </Link>
                </motion.div>

              </div>

              {/* Model Cutout (Mobile & Desktop) */}
              {image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative shrink-0 self-center md:self-end mt-3 md:mt-0 md:-mb-8"
                >
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-40 lg:h-48 lg:w-44 overflow-hidden rounded-2xl md:rounded-none border md:border-none border-gold-400/40 shadow-lg md:shadow-none bg-gold-400/10 md:bg-transparent">
                    <Image
                      src={image}
                      alt="Sakpack India Promo"
                      fill
                      priority
                      sizes="(max-width: 768px) 150px, 200px"
                      className="object-cover md:object-contain object-top md:object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
