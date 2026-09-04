"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const DEFAULT_TAGLINES = [
  "Where comfort meets confidence.",
  "Fashion crafted for everyday elegance.",
  "Style that moves with you.",
];

const SPARKLES = [
  { top: "12%", left: "6%", delay: 0, size: 6 },
  { top: "22%", left: "92%", delay: 0.6, size: 4 },
  { top: "72%", left: "4%", delay: 1.2, size: 5 },
  { top: "85%", left: "88%", delay: 1.8, size: 7 },
  { top: "48%", left: "50%", delay: 2.4, size: 3 },
];

const DEFAULT_IMAGES = [
  "/hero-model.jpg",
  "/hero-model-2.jpg",
  "/hero-model-3.jpg",
];

export default function Hero({
  badgeText = "LOVED BY 10,000+ WOMEN",
  buttonText = "Shop Now",
  buttonLink = "/shop",
  taglines,
  images,
  mobileImages,
}) {
  const TAGLINES = taglines?.length ? taglines : DEFAULT_TAGLINES;
  const slideImages = images?.some(Boolean) ? images : DEFAULT_IMAGES;
  const slideCount = Math.max(TAGLINES.length, slideImages.length);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slideCount), 4500);
    return () => clearInterval(t);
  }, [slideCount]);

  const activeTagline = TAGLINES[slide % TAGLINES.length];
  const activeImage = slideImages[slide % slideImages.length];
  const activeMobileImage = mobileImages?.[slide % slideImages.length] || activeImage;

  return (
    <section className="relative w-full overflow-hidden bg-ivory">
      {/* ─── MOBILE ONLY HERO ──────────────────────────────────────────────── */}
      <div className="relative mx-auto w-full h-[86vh] min-h-[580px] max-h-[850px] overflow-hidden rounded-b-[2.2rem] shadow-xl bg-ivory sm:hidden">
        {/* Mobile Background Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeMobileImage || activeImage || "/hero-model.jpg"}
              alt="Sakpack India Hero"
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft bottom-up gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-ivory via-ivory/85 via-50% to-transparent" />

        {/* Mobile Overlaid Content Block */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end items-center px-4 pb-8 text-center">
          {/* Badge */}
          {badgeText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/90 px-4 py-1.5 shadow-md backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-ink">
                {badgeText}
              </span>
            </motion.div>
          )}

          {/* Title SAKPACK */}
          <div className="relative mt-1">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink drop-shadow-sm">
              SAKPACK
            </h1>
          </div>

          {/* Divider line with INDIA */}
          <div className="my-2 flex items-center justify-center gap-3 w-full max-w-[220px]">
            <div className="h-[1px] flex-1 bg-gold-400/70" />
            <span className="font-display text-xs font-bold tracking-[0.35em] text-gold-600 uppercase">
              INDIA
            </span>
            <div className="h-[1px] flex-1 bg-gold-400/70" />
          </div>

          {/* STYLE • COMFORT • CONFIDENCE */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-ink">
            <span>Style</span>
            <span className="text-gold-500 font-black">•</span>
            <span>Comfort</span>
            <span className="text-gold-500 font-black">•</span>
            <span>Confidence</span>
          </div>

          {/* Italic tagline */}
          <div className="mt-2 flex h-11 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={slide}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-xl font-extrabold italic text-ink drop-shadow-sm text-center leading-snug px-2"
              >
                {activeTagline}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* SHOP NOW Button */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4"
          >
            <Link
              href={buttonLink}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-ink hover:bg-ink-soft px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-ivory shadow-xl transition-all duration-300"
            >
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Mobile Slide Dots */}
          {slideCount > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${slide % slideCount === i
                      ? "w-6 bg-gold-600 shadow-sm"
                      : "w-1.5 bg-ink/25 hover:bg-ink/40"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── DESKTOP/LAPTOP 16:9 BANNER HERO ────────────────────────────────── */}
      <div className="hidden sm:relative sm:flex sm:min-h-[72vh] sm:items-center sm:justify-center sm:pt-20 sm:pb-16 md:pt-24 md:pb-20">
        {/* Full-bleed background image */}
        <AnimatePresence mode="wait">
          {activeImage && (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0"
            >
              <Image
                src={activeImage}
                alt="Sakpack Hero"
                fill
                priority
                sizes="100vw"
                className="object-cover object-top"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient glowing backdrop spheres */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 top-10 h-[500px] w-[500px] rounded-full bg-gold-400/20 blur-[140px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -right-20 bottom-10 h-[500px] w-[500px] rounded-full bg-ink/15 blur-[150px]"
          />

          {/* Floating sparkle particles */}
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -16, 0], opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              className="absolute rounded-full bg-gold-400 shadow-[0_0_10px_2px_rgba(202,161,75,0.6)]"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            />
          ))}
        </div>

        {/* Desktop Content Card */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center px-12 py-0 my-auto -mt-2 sm:-mt-4 md:-mt-6">


          {badgeText && (
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold-400/40 bg-gradient-to-r from-gold-400/15 via-gold-500/10 to-gold-400/15 px-4 py-2 shadow-md backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-gold-500" />
                <span className="font-display text-sm font-bold uppercase tracking-widest text-ink [text-shadow:0_1px_6px_rgba(255,255,255,0.6)]">
                  {badgeText}
                </span>
              </motion.div>
            </div>
          )}

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <LogoMark className="h-24 w-24 drop-shadow-md" />
          </motion.div>

          <div className="relative mt-5">
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(202,161,75,0.5),transparent_70%)] blur-2xl"
            />

            <h1 className="relative font-display text-6xl lg:text-7xl font-black leading-none tracking-tight text-ink drop-shadow-[0_2px_12px_rgba(202,161,75,0.25)]">
              SAKPACK
            </h1>

            <motion.h1
              aria-hidden="true"
              animate={{ backgroundPositionX: ["160%", "-60%"] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 0%, transparent 44%, rgba(255,255,255,0.95) 50%, transparent 56%, transparent 100%)",
                backgroundSize: "220% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              className="pointer-events-none absolute inset-0 font-display text-6xl lg:text-7xl font-black leading-none tracking-tight text-transparent"
            >
              SAKPACK
            </motion.h1>
          </div>
          <p className="mt-2 font-display text-2xl font-bold tracking-[0.35em] text-gold-600 [text-shadow:0_1px_6px_rgba(255,255,255,0.6)]">
            INDIA
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-3.5 text-base font-semibold uppercase tracking-[0.3em] text-ink/80 [text-shadow:0_1px_5px_rgba(255,255,255,0.55)]">
            <span className="transition-colors hover:text-gold-600">Style</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="transition-colors hover:text-gold-600">Comfort</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="transition-colors hover:text-gold-600">Confidence</span>
          </div>

          <div className="mt-5 flex h-9 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={slide}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-xl font-bold italic text-ink/90 [text-shadow:0_1px_6px_rgba(255,255,255,0.6)]"
              >
                {activeTagline}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="mt-8">
            <Link
              href={buttonLink}
              className="btn-gold group px-11 py-4 text-lg font-bold tracking-wide shadow-xl"
            >
              {buttonText}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>

          {/* Desktop Slide Dots */}
          {slideCount > 1 && (
            <div className="mt-10 flex items-center gap-2.5">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${slide % slideCount === i ? "w-8 bg-gold-600 shadow-sm" : "w-2 bg-ink/20 hover:bg-ink/40"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


