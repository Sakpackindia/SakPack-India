"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Tag } from "lucide-react";
import { toggleCoupon, deleteCoupon } from "@/actions/admin/coupons";

export default function CouponsList({ coupons }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleCoupon(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteCoupon(id);
      router.refresh();
    });
  };

  if (coupons.length === 0) {
    return (
      <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 py-12 text-center backdrop-blur-md">
        <p className="text-base font-semibold text-ink/50">No coupons yet — create your first one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-4 backdrop-blur-md sm:p-6 shadow-xs">
      <ul className="space-y-3">
        {coupons.map((c) => {
          const expired = c.expires_at && new Date(c.expires_at) < new Date();
          return (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-gold-400/20 bg-ink/[0.04] p-4 sm:flex-row sm:items-center shadow-xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20">
                <Tag className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm font-semibold text-ink">{c.code}</p>
                  {expired && (
                    <span className="rounded-full border border-red-400/30 bg-red-400/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-700">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-ink/60">
                  {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                  {c.min_purchase > 0 ? ` · min ₹${c.min_purchase}` : ""}
                  {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/70">
                  <input type="checkbox" checked={c.is_active} disabled={pending} onChange={(e) => handleToggle(c.id, e.target.checked)} />
                  Active
                </label>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={pending}
                  className="rounded-xl p-2 text-ink/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
