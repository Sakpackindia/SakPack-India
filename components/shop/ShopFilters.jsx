"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check, SlidersHorizontal } from "lucide-react";
import HangerGlyph from "@/components/HangerGlyph";
import SortSelect from "./SortSelect";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [activeCategory].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const filterGroups = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-ink/60">Category</p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setParam("category", "")}
            className={`group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-base transition-all ${
              !activeCategory ? "bg-gold-400/15 text-ink" : "text-ink/60 hover:bg-ivory-deep"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/50 transition-colors group-hover:border-gold-400/30">
              <HangerGlyph className="h-4 w-auto" />
            </span>
            <span className="flex-1">All Products</span>
            {!activeCategory && <Check className="h-3.5 w-3.5 shrink-0 text-gold-600" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam("category", cat.id)}
              className={`group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-base transition-all ${
                activeCategory === cat.id ? "bg-gold-400/15 text-ink" : "text-ink/60 hover:bg-ivory-deep"
              }`}
            >
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-ink/10 bg-white transition-colors group-hover:border-gold-400/30">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt="" fill sizes="36px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-ink/50">
                    <HangerGlyph className="h-4 w-auto" />
                  </span>
                )}
              </span>
              <span className="flex-1">{cat.name}</span>
              {activeCategory === cat.id && <Check className="h-3.5 w-3.5 shrink-0 text-gold-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — opens the filter drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-sm md:hidden"
      >
        <span className="flex items-center gap-2.5 font-display text-lg text-ink">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-ivory-deep text-ink">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </span>
          Filters
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/20 px-1.5 text-base font-semibold text-ink">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-base font-medium text-gold-700">Open</span>
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="relative hidden overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-6 shadow-sm md:block">
        <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />
        <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4">
          <span className="flex items-center gap-2.5 font-display text-lg text-ink">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-ivory-deep text-ink">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            </span>
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-base font-medium text-ink/50 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        {filterGroups}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-r border-ink/10 bg-ivory shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <span className="flex items-center gap-2.5 font-display text-lg text-ink">
            <SlidersHorizontal className="h-5 w-5 text-gold-600" strokeWidth={1.5} />
            Filters
            {hasFilters && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/20 px-1.5 text-base font-semibold text-ink">
                {activeCount}
              </span>
            )}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="group rounded-full border border-ink/10 bg-white p-1.5 text-ink/60 transition-all duration-300 hover:border-ink/30 hover:text-ink"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-7">
            <SortSelect />
          </div>
          {filterGroups}
        </div>

        <div className="space-y-3 border-t border-ink/10 bg-white px-6 py-5">
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex w-full items-center justify-center gap-1.5 text-base font-medium text-ink/50 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="btn-gold block w-full py-3.5 text-center text-base font-semibold uppercase tracking-widest"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}
