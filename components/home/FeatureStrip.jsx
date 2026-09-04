"use client";

import { motion } from "framer-motion";
import { Sparkles, Feather, Scissors, Tag } from "lucide-react";

const ICONS = [Sparkles, Feather, Scissors, Tag];

export default function FeatureStrip({
  feature1Title = "Premium Quality",
  feature1Desc = "Handpicked Luxury Fabrics",
  feature2Title = "Soft & Breathable",
  feature2Desc = "Featherlight All-Day Ease",
  feature3Title = "Perfect Fit",
  feature3Desc = "Designed For Every Body",
  feature4Title = "Affordable Prices",
  feature4Desc = "Luxury Made Accessible",
}) {
  const FEATURES = [
    { icon: ICONS[0], title: feature1Title, desc: feature1Desc },
    { icon: ICONS[1], title: feature2Title, desc: feature2Desc },
    { icon: ICONS[2], title: feature3Title, desc: feature3Desc },
    { icon: ICONS[3], title: feature4Title, desc: feature4Desc },
  ];

  return (
    <section className="relative border-y border-gold-400/25 bg-ink py-6 sm:py-8 shadow-2xl">
      {/* Top subtle shimmer line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

      {/* Subtle ambient backdrop glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute left-1/2 top-1/2 h-64 w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-0 sm:divide-x sm:divide-gold-400/20">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group flex items-center gap-2.5 sm:gap-3.5 text-left sm:px-4 ${
                  i === 0
                    ? "justify-start"
                    : i === FEATURES.length - 1
                    ? "justify-start sm:justify-end"
                    : "justify-start sm:justify-center"
                }`}
              >
                {/* Refined Icon Container */}
                <div className="relative shrink-0">
                  <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-300 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_20px_rgba(202,161,75,0.4)]">
                    <Icon className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wide text-ivory leading-snug transition-colors group-hover:text-gold-300">
                    {f.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs md:text-sm font-medium text-gold-200/80 leading-snug transition-colors group-hover:text-gold-200">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom subtle shimmer line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
    </section>
  );
}



