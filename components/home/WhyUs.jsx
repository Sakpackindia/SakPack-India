"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Feather, Scissors, Tag, Users, ShieldCheck, Award } from "lucide-react";
import Reveal from "@/components/Reveal";

const STAT_ICONS = [Users, Sparkles, ShieldCheck];
const STAT_GRADIENTS = [
  "from-amber-400/20 via-gold-400/10 to-transparent",
  "from-gold-400/20 via-amber-300/10 to-transparent",
  "from-amber-500/20 via-gold-400/10 to-transparent",
];
const POINT_ICONS = [Sparkles, Feather, Scissors, Tag];

// "10K+" -> counts 0→10 then appends "K+"; "100%" -> counts 0→100 then "%".
function useCountUp(target, isInView, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);
  return value;
}

function StatValue({ value }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(target, isInView);

  return (
    <span ref={ref}>
      {match ? count : value}
      {suffix}
    </span>
  );
}

export default function WhyUs({
  eyebrow = "Trusted By Thousands",
  heading = "Why Choose Sakpack India?",
  stat1Value = "10K+",
  stat1Title = "Happy Customers",
  stat1Desc = "Empowered & delighted women nationwide",
  stat2Value = "5+",
  stat2Title = "Product Categories",
  stat2Desc = "Curated collections for everyday luxury",
  stat3Value = "100%",
  stat3Title = "Quality Checked",
  stat3Desc = "Rigorous perfection in every single stitch",
  point1Title = "Premium Quality",
  point1Desc = "Handpicked luxury fabrics & flawless stitching.",
  point2Title = "Soft & Breathable",
  point2Desc = "Featherlight comfort designed for all-day ease.",
  point3Title = "Perfect Fit",
  point3Desc = "Tailored to complement your natural silhouette.",
  point4Title = "Affordable Prices",
  point4Desc = "Uncompromised luxury at accessible prices.",
}) {
  const STATS = [
    { value: stat1Value, title: stat1Title, desc: stat1Desc, icon: STAT_ICONS[0], gradient: STAT_GRADIENTS[0] },
    { value: stat2Value, title: stat2Title, desc: stat2Desc, icon: STAT_ICONS[1], gradient: STAT_GRADIENTS[1] },
    { value: stat3Value, title: stat3Title, desc: stat3Desc, icon: STAT_ICONS[2], gradient: STAT_GRADIENTS[2] },
  ];

  const POINTS = [
    { num: "01", icon: POINT_ICONS[0], title: point1Title, short: point1Desc },
    { num: "02", icon: POINT_ICONS[1], title: point2Title, short: point2Desc },
    { num: "03", icon: POINT_ICONS[2], title: point3Title, short: point3Desc },
    { num: "04", icon: POINT_ICONS[3], title: point4Title, short: point4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-[#fcf9f2] py-10 sm:py-24">
      {/* Ambient Radial Golden Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.12)_0%,transparent_70%)]" />

      {/* Floating ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-gold-400/15 blur-[110px]"
        />
        <motion.div
          animate={{ x: ["8%", "-8%", "8%"], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-amber-400/15 blur-[120px]"
        />
      </div>

      <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
        {/* Section Header */}
        <Reveal className="mb-8 sm:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-1.5 text-sm sm:text-base font-extrabold uppercase tracking-[0.2em] text-gold-700 shadow-sm"
          >
            <Award className="h-4 w-4 text-gold-600" />
            {eyebrow}
          </motion.span>

          <div className="flex items-center justify-center gap-2 sm:gap-6">
            <span className="h-[1.5px] w-6 sm:w-20 shrink-0 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-ink text-center">
              {heading}
            </h2>
            <span className="h-[1.5px] w-6 sm:w-20 shrink-0 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
          </div>
        </Reveal>

        {/* --- STATS SHOWCASE STRIP --- */}
        <div className="mb-10 sm:mb-16 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-white p-6 sm:p-7 text-center shadow-lg transition-all duration-500 hover:border-gold-400 hover:shadow-[0_20px_50px_-15px_rgba(202,161,75,0.4)]"
              >
                {/* Background Ambient Glow */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${stat.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Top Corner Subtle Shimmer Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

                {/* Floating Icon Ring */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className="relative mx-auto mb-3.5 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-600 shadow-inner transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_25px_rgba(202,161,75,0.45)]"
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
                </motion.div>

                {/* Big Bold Stat Value — counts up into view */}
                <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink drop-shadow-sm transition-colors duration-300 group-hover:text-gold-600">
                  <StatValue value={stat.value} />
                </div>

                {/* Stat Title */}
                <div className="mt-2 font-display text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-ink/90">
                  {stat.title}
                </div>

                {/* Subtitle / Description */}
                <p className="mt-1 text-sm sm:text-sm text-ink/75 font-normal leading-snug">
                  {stat.desc}
                </p>

                {/* Decorative Bottom Gold Dot Accent */}
                <div className="mx-auto mt-3.5 sm:mt-4 h-1 w-8 rounded-full bg-gold-400/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold-400" />
              </motion.div>
            );
          })}
        </div>

        {/* --- 4-COLUMN BRAND VALUE CARDS --- */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col items-center rounded-2xl border border-gold-400/30 bg-white p-4 sm:p-5 text-center shadow-md transition-all duration-500 hover:border-gold-400 hover:shadow-[0_15px_40px_-10px_rgba(202,161,75,0.35)]"
              >
                {/* Number Badge Pill */}
                <span className="mb-2.5 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-xs sm:text-xs font-extrabold tracking-widest text-gold-700 border border-gold-400/20">
                  {point.num}
                </span>

                {/* Multi-Layer Metallic Icon Ring */}
                <div className="relative mb-3 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-gold-400/40 bg-gradient-to-br from-gold-300/20 via-gold-400/10 to-gold-500/20 text-gold-600 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_20px_rgba(202,161,75,0.4)]">
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-500 group-hover:rotate-6" strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wide text-ink transition-colors duration-300 group-hover:text-gold-600">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-xs sm:text-sm leading-snug text-ink/75 font-medium">
                  {point.short}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

