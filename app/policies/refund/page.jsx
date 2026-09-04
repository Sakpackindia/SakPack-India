import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { RefreshCcw, ShieldAlert, Clock, CheckCircle2, RotateCcw } from "lucide-react";

export const metadata = { title: "Refund & Return Policy" };

const HIGHLIGHTS = [
  { title: "7-Day Return Window", desc: "For unused items with original tags" },
  { title: "Free Replacement", desc: "Instant help for damaged/defective items" },
  { title: "Fast Refund Credit", desc: "Processed within 5-7 business days" },
];

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund & Return Policy" updated="July 2026" icon={RefreshCcw} highlights={HIGHLIGHTS}>
      <p className="text-lg sm:text-lg md:text-xl text-ink/90 leading-relaxed font-medium">
        At <strong className="text-gold-700 font-bold">Sakpack India</strong>, we take pride in crafting high-quality everyday essentials. If you are not completely satisfied with your purchase, we are here to assist you with hassle-free returns and exchanges.
      </p>

      {/* Section 1 */}
      <div className="pt-2 sm:pt-4">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          1. 7-Day Return & Exchange Window
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          Unused items in their original condition, with all tags attached and in original packaging, can be returned or exchanged within <strong>7 days of delivery</strong>.
        </p>
        
        {/* Hygiene Note Callout Box */}
        <div className="mt-4 sm:mt-5 flex items-start gap-3.5 rounded-2xl sm:rounded-3xl border border-gold-400/35 bg-[#faf6ee] p-4.5 sm:p-6 text-base sm:text-lg text-ink/90 shadow-sm">
          <ShieldAlert className="h-6 w-6 shrink-0 text-gold-600 mt-0.5" />
          <div>
            <strong className="text-gold-700 uppercase tracking-wider font-extrabold block mb-1 text-base sm:text-base">Hygiene Guarantee Notice</strong>
            For intimate apparel (bras, panties, co-ord innerwear), items must be untried, unworn, unwashed, and in sealed original packaging to qualify for a return or exchange.
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          2. Damaged, Defective, or Incorrect Orders
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          If your shipment arrives damaged, defective, or contains an incorrect item/size, please inform us within <strong>48 hours of delivery</strong> with clear photo or video proof of the product and outer package.
        </p>
        <p className="mt-2 text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          Once verified, we will arrange a <strong>free replacement pickup</strong> or issue a <strong>100% full refund</strong> immediately without extra charge.
        </p>
      </div>

      {/* Section 3 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          3. Order Cancellations
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          Orders can be cancelled free of charge anytime <strong>before dispatch</strong>. Once your order has been handed over to our courier partner and shipped, it can no longer be cancelled in transit.
        </p>
      </div>

      {/* Section 4 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          4. Refund Timeline & Process
        </h2>
        <ul className="space-y-3 text-lg sm:text-lg text-ink/90 font-normal list-disc list-inside leading-relaxed">
          <li><strong>Prepaid Orders:</strong> Approved refunds are credited directly to your original payment method (UPI / Debit / Credit Card) within <strong>5–7 business days</strong>.</li>
          <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds are transferred to your verified UPI ID or Bank Account via secure payout link upon reverse pickup inspection.</li>
        </ul>
      </div>

      <div className="pt-4 sm:pt-6 text-base sm:text-lg text-ink/75 font-medium border-t border-gold-400/20">
        To initiate a return or exchange, reach our support team at <a href={`mailto:${BRAND.email}`} className="text-gold-700 underline font-extrabold">{BRAND.email}</a> or message us on WhatsApp at <span className="text-gold-700 font-extrabold">{BRAND.whatsappDisplay}</span>.
      </div>
    </PolicyLayout>
  );
}
