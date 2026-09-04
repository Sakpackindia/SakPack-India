"use client";

import { motion } from "framer-motion";
import { Palette, Shirt, Ruler, Droplets } from "lucide-react";

const ICONS = { palette: Palette, shirt: Shirt, ruler: Ruler, droplets: Droplets };

export default function ProductDetailCards({ details }) {
  if (!details || details.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-12 border-t border-gold-400/20 pt-6 sm:pt-8">
      <span className="text-base font-black uppercase tracking-[0.25em] text-gold-700 block mb-5">
        Specifications &amp; Fabric
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map((n, i) => {
          const DetailIcon = ICONS[n.icon] || Palette;
          return (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/70 p-5 sm:p-6 shadow-sm backdrop-blur-md transition-all duration-400 hover:border-gold-400 hover:shadow-lg"
            >
              <div className="flex items-center gap-3.5 mb-3">
                {n.hex ? (
                  <span
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-gold-400/40 shadow-inner transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: n.hex }}
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-700 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-ink">
                    <DetailIcon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                )}
                <p className="font-display text-base font-extrabold uppercase tracking-widest text-ink/70">
                  {n.label}
                </p>
              </div>
              <p className="font-display text-lg sm:text-lg text-ink font-bold leading-snug">
                {n.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
