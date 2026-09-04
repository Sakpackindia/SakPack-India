"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Coffee, Moon, Sparkles, ArrowRight, BadgeCheck } from "lucide-react";

const OPTION_ICONS = [Coffee, Moon, Sparkles];

const DEFAULT_SUBTITLE =
  "Finding the right fit matters. This guide helps you choose the style that's really you.";

export default function HowToChoose({
  subtitle = DEFAULT_SUBTITLE,
  image = "/bra-nude-front.jpeg",
  showImage = true,
  option1Title = "For Every Day",
  option1Desc = "Soft, breathable pieces you can wear from morning to evening. Easy to wear and love.",
  option2Title = "For Lounging & Sleep",
  option2Desc = "Relaxed, cozy fits made for comfort at home — soft fabrics that feel like a hug.",
  option3Title = "Universal Fit",
  option3Desc = "Versatile styles that work for any day, any mood, and suit almost everyone.",
  unsureTitle = "Still Unsure?",
  unsureText = "Just place your order, try it on, and see for yourself why it's worth it.",
  unsureButton = "Order Now",
}) {
  const OPTIONS = [
    { title: option1Title, description: option1Desc, icon: OPTION_ICONS[0] },
    { title: option2Title, description: option2Desc, icon: OPTION_ICONS[1] },
    { title: option3Title, description: option3Desc, icon: OPTION_ICONS[2] },
  ];

  return (
    <section id="how-to-choose" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <div className="absolute left-[8%] top-0 h-[420px] w-[480px] rounded-full bg-gold-400/10 blur-[140px]" />
        <div className="absolute right-[10%] bottom-0 h-[420px] w-[480px] rounded-full bg-gold-300/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-12 sm:mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" /> How To Choose
          </span>
          <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.2em] text-ink sm:text-2xl md:text-3xl">
            Find Your Perfect Fit
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base sm:text-lg text-ink/65 font-medium leading-relaxed">
            {subtitle}
          </p>
        </Reveal>

        {/* Asymmetric split: tall portrait image + always-visible option cards */}
        <div className={`grid grid-cols-1 gap-8 sm:gap-10 ${showImage ? "lg:grid-cols-12 lg:gap-12" : ""}`}>
          {showImage && (
            <Reveal className="lg:col-span-5">
              <div className="group relative h-full min-h-[320px] overflow-hidden rounded-[2.5rem] border border-gold-400/30 shadow-xl sm:min-h-[420px]">
                <Image
                  src={image}
                  alt="Sakpack India"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />

                {/* Floating "Style Guide" badge */}
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/90 px-4 py-2 shadow-md backdrop-blur-md">
                  <BadgeCheck className="h-4 w-4 text-gold-600" />
                  <span className="text-base font-bold uppercase tracking-[0.15em] text-ink">Style Guide</span>
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <p className="font-display text-xl font-bold text-ivory sm:text-2xl">3 Ways To Wear Sakpack</p>
                  <p className="mt-1 text-base text-ivory/70 font-medium">Pick the fit that matches your day.</p>
                </div>
              </div>
            </Reveal>
          )}

          {/* Always-visible option cards, stacked as a numbered checklist */}
          <div className={showImage ? "lg:col-span-7" : ""}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {OPTIONS.map((option, i) => {
                const Icon = option.icon;
                return (
                  <Reveal key={option.title} delay={i * 80}>
                    <div className="group/opt relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-gold-400/25 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:border-gold-400/50 hover:shadow-[0_15px_40px_-20px_rgba(202,161,75,0.35)] hover:-translate-y-0.5 lg:flex-row">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-ink shadow-[0_0_18px_rgba(212,163,89,0.3)] transition-transform duration-300 group-hover/opt:scale-110 group-hover/opt:rotate-3">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg font-bold text-ink sm:text-xl">
                            {option.title}
                          </span>
                          <span className="text-base font-black text-gold-400/60">0{i + 1}</span>
                        </div>
                        <p className="mt-1.5 text-base leading-relaxed text-ink/60 font-medium sm:text-lg">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-width consultation banner */}
        <Reveal delay={200} className="mt-8 sm:mt-10">
          <div className="group relative overflow-hidden rounded-3xl border border-gold-400/35 bg-white/90 px-6 py-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:border-gold-400 hover:shadow-[0_20px_50px_rgba(202,161,75,0.15)] sm:px-10 sm:py-8">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-[0_0_20px_rgba(212,163,89,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-display text-xl font-bold text-ink sm:text-2xl">{unsureTitle}</h4>
                  <p className="mt-1.5 max-w-md text-base leading-relaxed text-ink/60 font-medium sm:text-lg">
                    {unsureText}
                  </p>
                </div>
              </div>

              <Link
                href="/shop"
                className="group/btn inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold-gradient px-7 py-3.5 text-base font-black uppercase tracking-[0.18em] text-ink shadow-[0_10px_30px_-10px_rgba(212,163,89,0.45)] transition-all hover:scale-[1.03] hover:shadow-[0_14px_36px_-10px_rgba(212,163,89,0.55)]"
              >
                {unsureButton}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
