"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function formatHeading(text) {
  if (!text) return null;
  // Handle any squished words like "StylesJust" -> "Styles Just", "EssentialsFor" -> "Essentials For", "ByThousands" -> "By Thousands"
  const formatted = text.replace(/([a-z])([A-Z])/g, "$1 $2");
  const lines = formatted.includes("\n")
    ? formatted.split("\n").map((l) => l.trim()).filter(Boolean)
    : [formatted];

  return lines.map((line, idx) => (
    <span key={idx} className="block whitespace-nowrap">
      {line}
    </span>
  ));
}

export default function TriPanelBanner({
  panel1Label = "New Arrivals",
  panel1Heading = "Fresh Styles\nJust For You",
  panel1ButtonText = "Shop Now",
  panel2Label = "Comfort Meets Style",
  panel2Heading = "Everyday Essentials\nFor Every You.",
  panel2ButtonText = "Shop Now",
  panel3Label = "Best Sellers",
  panel3Heading = "Loved By\nThousands",
  panel3ButtonText = "Shop Now",
}) {
  return (
    <section className="mx-auto max-w-wrap px-3 pb-12 sm:pb-24 sm:px-6 md:px-12">
      {/* Outer Contiguous 3-Panel Card with Gold Border */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-[#fbf8f2] shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gold-400/30">
          
          {/* PANEL 1: NEW ARRIVALS */}
          <div className="group relative flex min-h-[290px] sm:min-h-[380px] flex-col justify-center p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-[#fbf8f2] via-[#f7f2e7]/80 to-transparent">
            <div className="relative z-10 max-w-[62%] sm:max-w-[58%]">
              <p className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-ink">
                {panel1Label}
              </p>
              <div className="my-1.5 sm:my-2 h-[2px] w-6 bg-gold-400 rounded-full transition-all duration-300 group-hover:w-10" />

              <h3 className="font-serif italic text-2xl sm:text-3xl text-ink font-semibold leading-snug">
                {formatHeading(panel1Heading)}
              </h3>

              <div className="mt-4 sm:mt-6">
                <Link
                  href="/shop?sort=newest"
                  className="inline-flex items-center justify-center rounded-full border border-gold-400/80 bg-white/80 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-ivory hover:border-ink hover:shadow-md"
                >
                  {panel1ButtonText}
                </Link>
              </div>
            </div>

            {/* Model Image Positioned on Right */}
            <div className="absolute bottom-0 right-0 h-full w-[46%] sm:w-[50%] overflow-hidden pointer-events-none">
              <Image
                src="/bra-white-front.png"
                alt="New Arrivals"
                fill
                sizes="(max-width: 768px) 45vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* PANEL 2: CENTER DARK WINE FEATURE PANEL */}
          <div className="group relative flex min-h-[290px] sm:min-h-[380px] flex-col items-center justify-center p-6 sm:p-10 text-center overflow-hidden bg-ink">
            {/* Subtle Inner Gold Accent Border Frame */}
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold-400/20 transition-all duration-500 group-hover:border-gold-400/40" />

            <div className="relative z-10 flex flex-col items-center">
              <p className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ivory">
                {panel2Label}
              </p>
              <div className="my-2 sm:my-2.5 h-[2px] w-8 bg-gold-400 rounded-full transition-all duration-300 group-hover:w-12" />

              <h3 className="font-serif italic text-2xl sm:text-3xl text-gold-200 font-semibold leading-relaxed max-w-[270px]">
                {formatHeading(panel2Heading)}
              </h3>

              <div className="mt-5 sm:mt-7">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-gold-400/80 bg-transparent px-6 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-ivory transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:shadow-[0_0_20px_rgba(202,161,75,0.4)]"
                >
                  {panel2ButtonText}
                </Link>
              </div>
            </div>
          </div>

          {/* PANEL 3: BEST SELLERS */}
          <div className="group relative flex min-h-[290px] sm:min-h-[380px] flex-col justify-center p-6 sm:p-10 overflow-hidden bg-gradient-to-l from-[#fbf8f2] via-[#f7f2e7]/80 to-transparent">
            <div className="relative z-10 max-w-[62%] sm:max-w-[58%]">
              <p className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-ink">
                {panel3Label}
              </p>
              <div className="my-1.5 sm:my-2 h-[2px] w-6 bg-gold-400 rounded-full transition-all duration-300 group-hover:w-10" />

              <h3 className="font-serif italic text-2xl sm:text-3xl text-ink font-semibold leading-snug">
                {formatHeading(panel3Heading)}
              </h3>

              <div className="mt-4 sm:mt-6">
                <Link
                  href="/shop?sort=popular"
                  className="inline-flex items-center justify-center rounded-full border border-gold-400/80 bg-white/80 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-ivory hover:border-ink hover:shadow-md"
                >
                  {panel3ButtonText}
                </Link>
              </div>
            </div>

            {/* Model Image Positioned on Right */}
            <div className="absolute bottom-0 right-0 h-full w-[46%] sm:w-[50%] overflow-hidden pointer-events-none">
              <Image
                src="/bra-black-front.png"
                alt="Best Sellers"
                fill
                sizes="(max-width: 768px) 45vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}



