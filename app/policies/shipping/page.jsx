import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { Truck, Clock, MapPin, PackageCheck, ShieldCheck } from "lucide-react";

export const metadata = { title: "Shipping Policy" };

const HIGHLIGHTS = [
  { title: "Fast Dispatch", desc: "Handed to couriers in 1-2 business days" },
  { title: "Pan-India Delivery", desc: "Arrives in 3-6 business days" },
  { title: "Free Shipping", desc: "On orders crossing free-tier threshold" },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" updated="July 2026" icon={Truck} highlights={HIGHLIGHTS}>
      <p className="text-lg sm:text-lg md:text-xl text-ink/90 leading-relaxed font-medium">
        We deliver across India with premium courier partners to ensure your <strong className="text-gold-700 font-bold">Sakpack India</strong> orders are safely packaged and arrive promptly at your doorstep.
      </p>

      {/* Section 1 */}
      <div className="pt-2 sm:pt-4">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          1. Order Processing Time
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          All orders are processed, quality-inspected, and handed over to our logistical partners within <strong>1–2 business days</strong> of payment or COD confirmation.
        </p>
        <p className="mt-2 text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          You will receive an automated tracking link via <strong>WhatsApp and email</strong> as soon as your parcel is dispatched.
        </p>
      </div>

      {/* Section 2 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          2. Estimated Delivery Time
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          Standard delivery takes <strong>3–6 business days</strong> across metro cities and major towns. Delivery to tier-3 towns or remote regional pin codes may take up to 7 business days.
        </p>
      </div>

      {/* Section 3 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <PackageCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          3. Shipping Charges & COD
        </h2>
        <ul className="space-y-3 text-lg sm:text-lg text-ink/90 font-normal list-disc list-inside leading-relaxed">
          <li><strong>Free Delivery:</strong> Applied automatically at checkout on orders meeting our minimum order value threshold.</li>
          <li><strong>Standard Prepaid Orders:</strong> Nominal flat shipping rate applied at checkout for smaller order amounts.</li>
          <li><strong>Cash on Delivery (COD):</strong> Available across select serviceable pin codes. A minor handling fee is added to cover cash logistics.</li>
        </ul>
      </div>

      {/* Section 4 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          4. Discrete & Tamper-Proof Packaging
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          Your privacy matters to us. All orders are packed in eco-friendly, tamper-proof, non-transparent mailers with outer seals to guarantee complete confidentiality during transit.
        </p>
      </div>

      <div className="pt-4 sm:pt-6 text-base sm:text-lg text-ink/75 font-medium border-t border-gold-400/20">
        Have questions regarding tracking or shipping updates? Write to <a href={`mailto:${BRAND.email}`} className="text-gold-700 underline font-extrabold">{BRAND.email}</a> or message us on WhatsApp at <span className="text-gold-700 font-extrabold">{BRAND.whatsappDisplay}</span> with your order ID.
      </div>
    </PolicyLayout>
  );
}
