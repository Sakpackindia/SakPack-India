"use client";

import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import { createCoupon } from "@/actions/admin/coupons";

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";

export default function CouponForm() {
  const [state, formAction, pending] = useActionState(createCoupon, {});

  return (
    <form
      action={formAction}
      className="h-fit space-y-4 rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
          <PlusCircle className="h-4 w-4" />
        </div>
        <h2 className="font-display text-lg font-semibold text-ink">Create Coupon</h2>
      </div>
      {state.error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-base font-semibold text-red-600">{state.error}</p>
      )}
      <div>
        <label className={labelClass}>Code</label>
        <input required name="code" placeholder="AMAIRAH10" className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" className={inputClass}>
            <option value="percent">Percent Off</option>
            <option value="flat">Flat Amount Off</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Value</label>
          <input required type="number" name="value" placeholder="10" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Minimum Purchase (₹)</label>
        <input type="number" name="min_purchase" placeholder="0" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Expires On (optional)</label>
        <input type="date" name="expires_at" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full text-base font-semibold disabled:opacity-60">
        {pending ? "Creating…" : "Create Coupon"}
      </button>
    </form>
  );
}
