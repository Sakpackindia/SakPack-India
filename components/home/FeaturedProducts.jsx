import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts({ products, heading = "Best Sellers" }) {
  const items = (products || []).slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="relative bg-[#fcf9f2] py-10 sm:py-16">
      <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
        {/* Header Row: Centered — BEST SELLERS — and Top Right VIEW ALL Button */}
        <Reveal className="mb-6 sm:mb-10 flex items-center justify-between gap-2">
          <div className="hidden sm:block w-24" />

          <div className="flex items-center justify-center gap-2 sm:gap-6 flex-1 sm:flex-initial min-w-0">
            <span className="h-[1.5px] w-6 sm:w-20 shrink-0 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
            <h2 className="font-display text-base sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-ink text-center truncate">
              {heading}
            </h2>
            <span className="h-[1.5px] w-6 sm:w-20 shrink-0 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
          </div>

          <div className="shrink-0">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-lg border border-ink/40 bg-white/90 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:bg-ink hover:text-ivory shadow-sm"
            >
              View All
            </Link>
          </div>
        </Reveal>

        {/* 5-Column Product Card Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}


