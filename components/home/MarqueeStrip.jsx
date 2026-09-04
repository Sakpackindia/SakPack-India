import { Sparkles, Gem } from "lucide-react";

const DEFAULT_ITEMS =
  "*Premium Quality Fabrics\nHandpicked & Soft\nPerfect Everyday Fit\n*Free Delivery\nCash on Delivery Available\n*Easy 7-Day Returns";

function parseItems(raw) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      text: line.startsWith("*") ? line.slice(1).trim() : line,
      highlight: line.startsWith("*"),
    }));
}

export default function MarqueeStrip({ items = DEFAULT_ITEMS }) {
  const parsed = parseItems(items);
  const loop = [...parsed, ...parsed, ...parsed];

  return (
    <div className="group relative overflow-hidden border-y border-gold-400/25 bg-gradient-to-r from-ivory via-white to-ivory bg-[length:200%_100%] py-5 sm:py-6 backdrop-blur-md animate-shimmer">
      {/* Shimmering top/bottom hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Ambient glow orbs for depth */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-24 w-64 -translate-y-1/2 rounded-full bg-gold-400/[0.12] blur-[70px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-24 w-64 -translate-y-1/2 rounded-full bg-amber-400/[0.10] blur-[70px]" />

      {/* Left Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-ivory to-transparent z-10" />

      {/* Right Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-ivory to-transparent z-10" />

      <div className="relative flex w-max animate-marquee gap-8 sm:gap-12 whitespace-nowrap group-hover:[animation-play-state:paused] cursor-pointer">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 sm:gap-5 text-base sm:text-base font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-transform duration-300 hover:scale-105"
          >
            {item.highlight ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gradient-to-r from-gold-400/10 via-gold-300/15 to-gold-400/10 px-4 py-1.5 shadow-sm">
                <Gem className="h-3.5 w-3.5 shrink-0 text-gold-600" />
                <span className="text-transparent bg-clip-text bg-gold-gradient-text font-black">
                  {item.text}
                </span>
              </span>
            ) : (
              <span className="text-ink/85">{item.text}</span>
            )}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-600" />
            </span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 animate-pulse shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
