"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";

const OPTIONS = [
  { value: "", label: "Sort: Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function SortSelect({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "";

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const selectValue = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const activeLabel = OPTIONS.find((o) => o.value === activeSort)?.label || OPTIONS[0].label;

  return (
    <div ref={rootRef} className={`relative z-40 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-full border px-5 py-2.5 text-base sm:text-base font-bold uppercase tracking-wider text-ink transition-all duration-300 shadow-sm backdrop-blur-sm ${
          open
            ? "border-gold-400 bg-white shadow-md"
            : "border-gold-400/35 bg-white/90 hover:border-gold-400 hover:bg-white"
        }`}
      >
        <span className="flex items-center gap-2 whitespace-nowrap truncate">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-gold-600" />
          {activeLabel}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gold-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full sm:w-[240px] overflow-hidden rounded-2xl border border-gold-400/40 bg-ink p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-fadeUp">
          <div className="px-3 py-2 text-base font-extrabold uppercase tracking-[0.2em] text-gold-400/70 border-b border-gold-400/15 mb-1">
            Select Sort Order
          </div>
          {OPTIONS.map((option) => {
            const isActive = option.value === activeSort;
            return (
              <button
                key={option.value || "default"}
                type="button"
                onClick={() => selectValue(option.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-gold-400 text-ink shadow-md font-extrabold"
                    : "text-ivory/80 hover:bg-gold-400/15 hover:text-gold-300"
                }`}
              >
                <span>{option.label}</span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-ink stroke-[3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
