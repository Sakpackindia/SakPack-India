"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import HangerGlyph from "@/components/HangerGlyph";

const PER_PAGE = 3;

function CategoryCircle({ cat, index = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
      whileHover={{ y: -14, transition: { type: "spring", stiffness: 300, damping: 18 } }}
      className="flex shrink-0 flex-col items-center"
    >
      <Link
        href={`/shop?category=${cat.id}`}
        className="group flex flex-col items-center gap-3 w-28 sm:w-36 lg:w-44"
      >
        {/* Double-Ring Metallic Gold Frame */}
        <div className="relative aspect-square w-full">
          {/* Ambient pulsing gold glow behind the ring */}
          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.92, 1.04, 0.92] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
            className="pointer-events-none absolute -inset-2 rounded-full bg-gold-400/30 blur-xl"
          />
          {/* Slowly rotating gold ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -inset-0.5 rounded-full bg-[conic-gradient(from_0deg,rgba(202,161,75,0.15),rgba(202,161,75,0.7),rgba(202,161,75,0.15)_50%,rgba(202,161,75,0.7)_75%,rgba(202,161,75,0.15))] opacity-70 group-hover:opacity-100"
          />
          <div className="relative h-full w-full rounded-full p-1 sm:p-1.5 transition-all duration-500 bg-gradient-to-b from-gold-300/60 via-gold-400/30 to-gold-600/50 shadow-md group-hover:shadow-[0_12px_35px_rgba(202,161,75,0.4)] group-hover:from-gold-200 group-hover:to-gold-500">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-gold-400/40 bg-ivory-deep shadow-inner">
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 176px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ivory to-ivory-deep">
                  <HangerGlyph className="h-1/2 w-auto text-gold-600/40" />
                </div>
              )}

              {/* Subtle inner gold sheen overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-gold-400/20 group-hover:ring-gold-300/40" />
            </div>
          </div>
        </div>

        {/* Title and Heart Icon below */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-display text-base font-extrabold uppercase tracking-[0.18em] text-ink transition-colors duration-300 group-hover:text-gold-600 sm:text-base">
            {cat.name}
          </p>
          
          {/* Filled luxury heart icon */}
          <Heart
            className="h-3.5 w-3.5 text-ink/70 fill-ink/70 transition-all duration-300 group-hover:scale-125 group-hover:text-gold-500 group-hover:fill-gold-500"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryCircles({ categories, heading = "Shop By Category" }) {
  const [page, setPage] = useState(0);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories?.length]);

  const scrollByAmount = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  if (!categories || categories.length === 0) return null;

  const isOverflowing = canScrollLeft || canScrollRight;
  const totalPages = Math.ceil(categories.length / PER_PAGE);
  const visible = categories.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="relative bg-[#fcf9f2] py-14 sm:py-20 overflow-hidden">
      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        {/* Title with side golden accent lines like reference */}
        <Reveal className="mb-10 sm:mb-14 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.2em] text-ink sm:text-2xl md:text-3xl">
              {heading}
            </h2>
            <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
          </div>
        </Reveal>

        {/* Mobile: fixed 3-up grid, paginated */}
        <div className="sm:hidden">
          <div className="grid grid-cols-3 gap-4">
            {visible.map((cat, i) => (
              <CategoryCircle key={cat.id} cat={cat} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous categories"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all disabled:opacity-25 hover:border-ink/40 active:scale-95 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      page === idx ? "w-5 bg-ink" : "w-1.5 bg-ink/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next categories"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all disabled:opacity-25 hover:border-ink/40 active:scale-95 shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop/tablet: single row, horizontally scrollable when it overflows */}
        <div className="relative hidden sm:block">
          {isOverflowing && canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-1)}
              aria-label="Scroll categories left"
              className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_20px_rgba(74,16,41,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-ink/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={trackRef}
            className={`flex flex-nowrap gap-8 lg:gap-12 overflow-x-auto scroll-smooth px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isOverflowing ? "justify-start" : "justify-center"
            }`}
          >
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 70}>
                <CategoryCircle cat={cat} index={i} />
              </Reveal>
            ))}
          </div>

          {isOverflowing && canScrollRight && (
            <button
              onClick={() => scrollByAmount(1)}
              aria-label="Scroll categories right"
              className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 translate-x-5 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_20px_rgba(74,16,41,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-ink/40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

