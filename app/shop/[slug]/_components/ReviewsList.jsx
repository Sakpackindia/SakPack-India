"use client";

import { useState } from "react";
import { CheckCircle2, User, MessageSquareHeart } from "lucide-react";
import StarRating from "@/components/StarRating";

// Initial reviews shown: 5 before View More
const INITIAL_COUNT = 5;
const BATCH_SIZE = 5;

export default function ReviewsList({ reviews, hasOwnReview = false }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-white/90 p-8 shadow-sm text-center backdrop-blur-md">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-700">
            <MessageSquareHeart className="h-6 w-6" />
          </div>
        </div>
        <p className="font-display text-base sm:text-lg font-extrabold uppercase tracking-wider text-ink">
          {hasOwnReview ? "No other reviews yet" : "No reviews yet • Be the first to share yours"}
        </p>
        <p className="mt-1 text-base text-ink/60 font-medium">
          Have you bought this item? Share your experience with our community!
        </p>
      </div>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const remaining = reviews.length - visibleCount;

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {visible.map((r) => (
          <li
            key={r.id}
            className="group relative overflow-hidden rounded-2xl border border-gold-400/30 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-ink text-gold-300 font-black text-base">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-base font-black uppercase tracking-wider text-ink">
                    {r.profiles?.full_name || "Sakpack Buyer"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-base font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                  </span>
                </div>
              </div>

              <div className="rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1">
                <StarRating rating={r.rating} size={12} />
              </div>
            </div>

            {r.review_text && (
              <p className="text-base sm:text-lg leading-relaxed text-ink/90 font-semibold border-t border-gold-400/15 pt-3">
                &ldquo;{r.review_text}&rdquo;
              </p>
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.min(c + BATCH_SIZE, reviews.length))}
          className="w-full rounded-full border border-gold-400/40 bg-white px-6 py-3.5 text-base font-black uppercase tracking-widest text-ink shadow-sm transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 active:scale-98"
        >
          View More Reviews ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
