import { Suspense } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck, Headphones } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import SortSelect from "@/components/shop/SortSelect";
import ShopHeader from "@/components/shop/ShopHeader";
import { getActiveCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

import { whatsappLink } from "@/lib/constants";

export const metadata = { title: "Shop All Products - Sakpack India" };

const PAGE_SIZE = 15;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getProducts({
      categoryId: params.category || undefined,
      sort: params.sort || undefined,
      search: params.search || undefined,
    }),
  ]);

  const activeCategoryName = categories.find((c) => c.id === params.category)?.name;

  const activeChips = [
    params.search ? { key: "search", label: `"${params.search}"` } : null,
    params.category ? { key: "category", label: activeCategoryName || "Category" } : null,
  ].filter(Boolean);

  const chipHref = (omitKey) => {
    const usp = new URLSearchParams();
    if (params.search && omitKey !== "search") usp.set("search", params.search);
    if (params.category && omitKey !== "category") usp.set("category", params.category);
    if (params.sort) usp.set("sort", params.sort);
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const categoryHref = (categoryId) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (categoryId) usp.set("category", categoryId);
    if (params.sort) usp.set("sort", params.sort);
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(parseInt(params.page, 10) || 1, 1), totalPages);
  const pagedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageHref = (pageNum) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (params.category) usp.set("category", params.category);
    if (params.sort) usp.set("sort", params.sort);
    if (pageNum > 1) usp.set("page", String(pageNum));
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProducts = JSON.parse(JSON.stringify(pagedProducts));

  // ShopHeader is a Client Component, so it can't receive the categoryHref
  // function as a prop — precompute plain link data instead.
  const categoryLinks = [
    { id: null, name: "All", href: categoryHref(null), active: !params.category },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      href: categoryHref(cat.id),
      active: params.category === cat.id,
    })),
  ];

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-ivory text-ink pb-24">
        {/* Ambient glowing backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
          <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-gold-400/10 blur-[130px] animate-pulse-glow" />
          <div className="absolute -right-24 top-64 h-[420px] w-[420px] rounded-full bg-ink/5 blur-[140px]" />
        </div>

        <ShopHeader
          heading={params.search ? `Results for "${params.search}"` : activeCategoryName || "Shop All Products"}
          productCount={products.length}
          categoryLinks={categoryLinks}
        >
          <Suspense fallback={null}>
            <SortSelect className="w-full sm:w-64" />
          </Suspense>
        </ShopHeader>

        <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12 pt-8 sm:pt-10">
          
          {/* Active Filter Chips Bar */}
          {activeChips.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-400/30 bg-white/90 p-4 shadow-sm backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-base font-extrabold uppercase tracking-wider text-gold-700 mr-1">
                  Active Filters:
                </span>
                {activeChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={chipHref(chip.key)}
                    scroll={false}
                    className="flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-base font-extrabold uppercase tracking-wider text-ink shadow-sm transition-all duration-300 hover:bg-gold-400/20 hover:border-gold-400"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5 text-gold-700" />
                  </Link>
                ))}
              </div>
              <Link href="/shop" scroll={false} className="text-base font-extrabold uppercase tracking-widest text-rose-600 transition-colors hover:text-rose-700">
                Reset All Filters
              </Link>
            </div>
          )}

          {/* Sidebar + Main Grid Split Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">

            {/* Left Desktop Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start">
              <div className="flex flex-col gap-6">
                
                {/* Category Navigation Box — Ultra Luxury Redesign */}
                <div className="group relative overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/80 p-6 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-gold-400 hover:shadow-[0_20px_45px_-12px_rgba(202,161,75,0.35)]">
                  {/* Top Edge Hairline Shimmer */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

                  {/* Header Row with Icon */}
                  <div className="mb-5 flex items-center justify-between pb-3.5 border-b border-gold-400/25">
                    <h3 className="font-display text-base sm:text-base font-black uppercase tracking-[0.2em] text-ink flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
                      Categories
                    </h3>
                    <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gold-700 border border-gold-400/20">
                      Collection
                    </span>
                  </div>

                  {/* Categories List */}
                  <ul className="flex flex-col gap-2">
                    {categoryLinks.map((cat) => (
                      <li key={cat.id ?? "all-sidebar"}>
                        <Link
                          href={cat.href}
                          scroll={false}
                          className={`group/item flex items-center justify-between rounded-2xl px-4 py-3 text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${
                            cat.active
                              ? "border border-gold-400/60 bg-ink text-gold-300 shadow-lg shadow-ink/25 translate-x-1.5"
                              : "border border-transparent bg-white/60 text-ink/70 backdrop-blur-sm hover:border-gold-400/35 hover:bg-white hover:text-ink hover:translate-x-1.5 hover:shadow-sm"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {/* Active/Inactive Bullet Dot Ring */}
                            <span
                              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                cat.active
                                  ? "bg-gold-400 shadow-[0_0_8px_rgba(202,161,75,0.8)] scale-125"
                                  : "bg-ink/20 group-hover/item:bg-gold-500"
                              }`}
                            />
                            {cat.name}
                          </span>

                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              cat.active
                                ? "text-gold-300 translate-x-0.5"
                                : "text-ink/30 opacity-0 group-hover/item:opacity-100 group-hover/item:text-gold-600 group-hover/item:translate-x-0.5"
                            }`}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sakpack Assurance Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-gold-400/35 bg-[#380b1b] p-6 shadow-xl text-ivory">
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gold-400/20 blur-2xl transition-all duration-500 group-hover:scale-125" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/15 text-gold-300 shadow-inner mb-3">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-display text-base font-extrabold uppercase tracking-[0.2em] text-gold-300">
                    Sakpack Guarantee
                  </p>
                  <h4 className="mt-1 font-display text-base font-bold text-ivory leading-tight">
                    100% Quality Inspected
                  </h4>
                  <p className="mt-1.5 text-base text-ivory/70 leading-relaxed font-medium">
                    Every piece is checked with care before fast shipping across India.
                  </p>
                </div>

              </div>
            </aside>

            {/* Right Product Grid Area */}
            <main className="lg:col-span-9">
              <ProductGrid
                products={safeProducts}
                emptyMessage="No products match these filters yet. Try clearing a filter, or message us on WhatsApp for a recommendation."
              />
            </main>

          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={pageHref(currentPage - 1)}
                scroll={false}
                aria-disabled={currentPage === 1}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  currentPage === 1
                    ? "pointer-events-none border-gold-400/10 text-ink/20"
                    : "border-gold-400/35 bg-white text-ink shadow-sm hover:border-gold-400 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {getPageNumbers(currentPage, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-base text-ink/30 font-bold">
                    &hellip;
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    scroll={false}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base font-extrabold uppercase tracking-wider transition-all duration-300 ${
                      p === currentPage
                        ? "border-gold-400/80 bg-ink text-gold-300 shadow-lg shadow-ink/20 scale-105"
                        : "border-gold-400/25 bg-white text-ink/70 hover:border-gold-400 hover:text-ink hover:-translate-y-0.5"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              <Link
                href={pageHref(currentPage + 1)}
                scroll={false}
                aria-disabled={currentPage === totalPages}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  currentPage === totalPages
                    ? "pointer-events-none border-gold-400/10 text-ink/20"
                    : "border-gold-400/35 bg-white text-ink shadow-sm hover:border-gold-400 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          )}
        </div>

        {/* --- LUXURY ASSURANCE STRIP --- */}
        <section className="mt-14 sm:mt-20 border-y border-gold-400/25 bg-white/80 py-8 sm:py-10 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-700 shadow-inner">
                  <ShieldCheck className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-ink">
                    100% Quality Checked
                  </h4>
                  <p className="text-base text-ink/65 font-medium">Inspected before dispatch</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-700 shadow-inner">
                  <Sparkles className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-ink">
                    Handpicked Fabrics
                  </h4>
                  <p className="text-base text-ink/65 font-medium">Ultra-soft &amp; breathable</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-700 shadow-inner">
                  <Truck className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-ink">
                    Fast Pan-India Delivery
                  </h4>
                  <p className="text-base text-ink/65 font-medium">Safe &amp; discrete packaging</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10 text-gold-700 shadow-inner">
                  <Headphones className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-ink">
                    Dedicated Support
                  </h4>
                  <p className="text-base text-ink/65 font-medium">Direct WhatsApp assistance</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
