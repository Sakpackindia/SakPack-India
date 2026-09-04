import ProductCard from "./ProductCard";
import HangerGlyph from "./HangerGlyph";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/constants";
import { MessageCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-6">
        <div className="relative flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-ink/10 bg-ivory-deep text-ink">
            <HangerGlyph className="h-9 w-auto text-ink/60 animate-floatSlow" />
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-light text-ink tracking-wide">
            No Products Found
          </h3>
          <div className="w-12 h-[1px] bg-gold-500/40 mx-auto mt-4 mb-4" />

          <p className="max-w-md text-base sm:text-lg leading-relaxed text-ink/50 font-light">
            We couldn't find any products matching your current selection. Try resetting your filters, or chat with us for a personalized recommendation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="btn-outline-ink flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold uppercase tracking-wider w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
              Reset Filters
            </Link>
            <a
              href={whatsappLink("Hi Sakpack India, I would love a product recommendation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold uppercase tracking-wider w-full sm:w-auto hover:scale-[1.02] transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={(i % 8) * 60}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
