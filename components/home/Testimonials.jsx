"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Delhi",
    review: "Amazing quality & super comfortable! Wore the rayon palazzo all day long without any discomfort. Will definitely shop again!",
    rating: 5,
    avatar: "/hero-model.jpg",
  },
  {
    name: "Neha Kapoor",
    location: "Mumbai",
    review: "Loved the fabric and fit! Truly premium quality, soft breathable cotton fabric that feels so gentle and light on the skin.",
    rating: 5,
    avatar: "/hero-model-2.jpg",
  },
  {
    name: "Anjali Mehta",
    location: "Bangalore",
    review: "Best collection at this price point! Totally worth every rupee. Fast express shipping and gorgeous luxury packaging too.",
    rating: 5,
    avatar: "/hero-model-3.jpg",
  },
];

// How many cards show side-by-side at once, per breakpoint.
function useCardsPerView() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const compute = () => {
      if (window.innerWidth < 640) setN(1);
      else if (window.innerWidth < 1024) setN(2);
      else setN(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return n;
}

function TestimonialCard({ item }) {
  return (
    <div
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gold-400/35 bg-white/95 p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:border-gold-400 hover:shadow-[0_20px_50px_rgba(202,161,75,0.18)] hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gold-500">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <Quote className="h-6 w-6 text-gold-400/40 group-hover:text-gold-500/60 transition-colors" />
        </div>

        <p className="text-base sm:text-lg leading-relaxed text-ink/85 font-medium italic min-h-[72px]">
          &ldquo;{item.review}&rdquo;
        </p>
      </div>

      <div className="mt-6 border-t border-gold-400/20 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gold-400/40 bg-ink shadow-md">
            {item.avatar && (
              <Image src={item.avatar} alt={item.name} fill sizes="40px" className="object-cover" />
            )}
          </div>

          <div>
            <p className="font-display text-base font-black uppercase tracking-wider text-ink">
              {item.name}
            </p>
            <span className="inline-flex items-center gap-1 text-base font-bold text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> Verified Buyer ({item.location})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({
  testimonials,
  eyebrow = "Real Customer Stories",
  heading = "What Our Customers Say",
  subtitle = "Loved by thousands of women across India for unmatched everyday comfort.",
}) {
  const TESTIMONIALS =
    testimonials && testimonials.length > 0
      ? testimonials.map((t) => ({
          name: t.customer_name,
          location: t.location,
          review: t.review_text,
          rating: Math.round(Number(t.rating) || 5),
          avatar: t.image_url,
        }))
      : FALLBACK_TESTIMONIALS;
  const LEN = TESTIMONIALS.length;

  const cardsPerView = useCardsPerView();
  // Two back-to-back copies of the deck let the track slide seamlessly:
  // once we've scrolled past the first copy, we snap back to the start of
  // it (no-animation) at a point that looks pixel-identical to the viewer.
  const track = [...TESTIMONIALS, ...TESTIMONIALS];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const timerRef = useRef(null);

  const advance = () => setIndex((i) => i + 1);
  const retreat = () => setIndex((i) => Math.max(0, i - 1));

  // Auto-advance one card at a time.
  useEffect(() => {
    timerRef.current = setInterval(advance, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  // Seamless loop: once we've slid a full deck's worth, jump back to 0
  // instantly (transition disabled for one frame) so it reads as endless.
  useEffect(() => {
    if (index !== LEN) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    }, 650);
    return () => clearTimeout(t);
  }, [index]);

  const restartTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 4500);
  };

  const activeDot = index % LEN;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory py-16 sm:py-24">
      {/* Background Sheen & Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        {/* Header Title */}
        <Reveal className="mb-12 sm:mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" /> {eyebrow}
          </span>

          <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-[0.2em] text-ink sm:text-2xl md:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-base sm:text-base text-ink/65 font-medium max-w-md mx-auto">
            {subtitle}
          </p>
        </Reveal>

        {/* Sliding swiper track — new card enters from the right, one at a time */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${index * (100 / cardsPerView)}%)`,
                transition: animate ? "transform 0.65s cubic-bezier(0.22,1,0.36,1)" : "none",
              }}
            >
              {track.map((item, i) => (
                <div key={i} className="shrink-0 px-3" style={{ flexBasis: `${100 / cardsPerView}%` }}>
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() => {
                retreat();
                restartTimer();
              }}
              aria-label="Previous testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-ink text-gold-300 shadow-md transition-all hover:scale-110 hover:bg-gold-400 hover:text-ink active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIndex(idx);
                    restartTimer();
                  }}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeDot === idx
                      ? "w-8 bg-gold-500 shadow-sm"
                      : "w-2.5 bg-gold-400/30 hover:bg-gold-400/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                advance();
                restartTimer();
              }}
              aria-label="Next testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-ink text-gold-300 shadow-md transition-all hover:scale-110 hover:bg-gold-400 hover:text-ink active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
