"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

const VISIBLE_COUNT = 3;

function getVisible(startIndex, items) {
  return Array.from(
    { length: Math.min(VISIBLE_COUNT, items.length) },
    (_, i) => items[(startIndex + i) % items.length]
  );
}

export default function TestimonialSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  const items = testimonials;
  const [startIndex, setStartIndex] = useState(0);

  const goTo = (target) => setStartIndex(target);
  const handleNext = () => goTo((startIndex + 1) % items.length);
  const handlePrev = () => goTo((startIndex - 1 + items.length) % items.length);

  useEffect(() => {
    if (items.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex, items.length]);

  const visible = getVisible(startIndex, items);

  return (
    <section className="py-12 sm:py-24 relative bg-ivory">
      <div className="mx-auto max-w-wrap px-3 sm:px-6 md:px-12 relative">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 relative z-10">
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-[0.2em] text-gold-600 mb-2 sm:mb-3 block">
            Loved by Real, Everyday Customers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink uppercase tracking-tight">
            Stories From Our Community
          </h2>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto mt-3 sm:mt-4" />
        </Reveal>

        <Reveal delay={100} className="relative z-10">
          <div key={startIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-slideInRight">
            {visible.map((t, i) => {
              const name = t.customer_name || t.name || "";
              const text = t.review_text || t.text || "";
              const title = t.title || "Verified Buyer";
              return (
                <div
                  key={`${name}-${i}`}
                  className={`group flex h-full flex-col rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm transition-all duration-500 hover:border-gold-400/30 hover:shadow-xl hover:-translate-y-1 ${
                    i === 0 ? "" : "hidden md:flex"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`w-4 h-4 ${si < t.rating ? "fill-gold-500 text-gold-500" : "fill-none text-ink/15"}`}
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 sm:h-7 sm:w-7 text-ink/10" strokeWidth={1.5} />
                  </div>

                  <p className="mt-4 sm:mt-5 flex-1 text-sm sm:text-base md:text-lg leading-relaxed text-ink/85 font-medium italic">
                    &ldquo;{text}&rdquo;
                  </p>

                  <div className="mt-5 flex items-center gap-3 border-t border-ink/10 pt-4 sm:pt-5">
                    {t.image_url ? (
                      <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border border-ink/10 bg-ivory-deep">
                        <Image src={t.image_url} alt={name} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 font-display text-base sm:text-lg font-extrabold text-gold-700 animate-fadeIn">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-base sm:text-lg text-ink font-bold truncate">{name}</p>
                      <p className="text-sm text-ink/60 truncate">
                        {title} {t.location ? `· ${t.location}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > VISIBLE_COUNT && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-ink/15 bg-white text-ink hover:border-gold-400/40 flex items-center justify-center transition-all hover:-translate-x-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1.5">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === startIndex ? "w-8 bg-ink" : "w-2.5 bg-ink/15 hover:bg-gold-400/40"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-ink/15 bg-white text-ink hover:border-gold-400/40 flex items-center justify-center transition-all hover:translate-x-1"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
