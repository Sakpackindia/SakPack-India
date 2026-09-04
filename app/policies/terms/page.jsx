import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { FileText, ShoppingBag, Scale, Shield, HelpCircle } from "lucide-react";

export const metadata = { title: "Terms of Service" };

const HIGHLIGHTS = [
  { title: "Indian Jurisdiction", desc: "Governed under Indian Trade Laws" },
  { title: "Inclusive Pricing", desc: "All prices listed include taxes (INR)" },
  { title: "Genuine Guarantee", desc: "100% authentic Sakpack quality" },
];

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" updated="July 2026" icon={FileText} highlights={HIGHLIGHTS}>
      <p className="text-lg sm:text-lg md:text-xl text-ink/90 leading-relaxed font-medium">
        Welcome to <strong className="text-gold-700 font-bold">Sakpack India</strong>. By accessing our website, placing an order, or creating an account, you agree to comply with and be bound by the following Terms & Conditions.
      </p>

      {/* Section 1 */}
      <div className="pt-2 sm:pt-4">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          1. Orders & Transparent Pricing
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          All product prices are stated in Indian Rupees (INR) and are inclusive of applicable GST unless noted otherwise. We reserve the right to modify prices, launch temporary promotions, or correct typographical pricing errors before order fulfillment.
        </p>
      </div>

      {/* Section 2 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          2. Product Descriptions & Sizing
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          We strive to provide accurate fabric descriptions, stretch guidelines, and garment dimensions. Due to lighting and individual display settings, minor color nuances may vary. We recommend reviewing our Size Guide prior to completing your purchase.
        </p>
      </div>

      {/* Section 3 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          3. Governing Law & Jurisdiction
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India. Any legal proceedings or disputes will be subject to the exclusive jurisdiction of the competent courts where Sakpack India operates.
        </p>
      </div>

      <div className="pt-4 sm:pt-6 text-base sm:text-lg text-ink/75 font-medium border-t border-gold-400/20">
        Have questions regarding our Terms of Service? Write to <a href={`mailto:${BRAND.email}`} className="text-gold-700 underline font-extrabold">{BRAND.email}</a>.
      </div>
    </PolicyLayout>
  );
}
