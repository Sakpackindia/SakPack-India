import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { ShieldCheck, Lock, Database, EyeOff, UserCheck } from "lucide-react";

export const metadata = { title: "Privacy Policy" };

const HIGHLIGHTS = [
  { title: "256-Bit SSL Encryption", desc: "Payments processed via Razorpay" },
  { title: "Zero Card Storage", desc: "We never store raw financial details" },
  { title: "No Data Selling", desc: "Your personal info is never sold" },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="July 2026" icon={ShieldCheck} highlights={HIGHLIGHTS}>
      <p className="text-lg sm:text-lg md:text-xl text-ink/90 leading-relaxed font-medium">
        <strong className="text-gold-700 font-bold">Sakpack India</strong> ("we", "our", or "us") is dedicated to protecting your personal data and privacy. This policy outlines how we collect, handle, and safeguard your personal details when you browse or make purchases on our platform.
      </p>

      {/* Section 1 */}
      <div className="pt-2 sm:pt-4">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Database className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          1. Information We Collect
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          When you register an account, place an order, or contact customer care, we collect your full name, email address, contact phone number, and physical shipping address.
        </p>

        {/* Security callout box */}
        <div className="mt-4 sm:mt-5 flex items-start gap-3.5 rounded-2xl sm:rounded-3xl border border-gold-400/35 bg-[#faf6ee] p-4.5 sm:p-6 text-base sm:text-lg text-ink/90 shadow-sm">
          <Lock className="h-6 w-6 shrink-0 text-gold-600 mt-0.5" />
          <div>
            <strong className="text-gold-700 uppercase tracking-wider font-extrabold block mb-1 text-base sm:text-base">Encrypted Payment Guarantee</strong>
            We do NOT store your bank account numbers, credit/debit card numbers, CVVs, or UPI PINs. All financial transactions are encrypted and processed through RBI-certified payment gateways (Razorpay).
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          2. How We Use Your Data
        </h2>
        <ul className="space-y-3 text-lg sm:text-lg text-ink/90 font-normal list-disc list-inside leading-relaxed">
          <li>Fulfilling and delivering your product orders securely.</li>
          <li>Sending automated order status notifications via SMS, WhatsApp, and Email.</li>
          <li>Providing responsive customer support and resolving queries.</li>
          <li>Improving store experience — <strong>we never sell or rent your personal data</strong> to third-party advertisers.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          3. Cookies & Session Storage
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          We use functional cookies to maintain your login session and save items in your shopping bag. We do not place intrusive third-party tracking scripts or spyware on your browser.
        </p>
      </div>

      {/* Section 4 */}
      <div className="pt-4 sm:pt-6">
        <h2 className="flex items-center gap-3 font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-ink border-b border-gold-400/25 pb-2.5 mb-3.5">
          <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
          4. Your Data Rights
        </h2>
        <p className="text-lg sm:text-lg text-ink/90 font-normal leading-relaxed">
          You have full ownership of your data. You may request access to, edit, or permanently request deletion of your account records at any time by contacting our Privacy Officer at <a href={`mailto:${BRAND.email}`} className="text-gold-700 underline font-extrabold">{BRAND.email}</a>.
        </p>
      </div>
    </PolicyLayout>
  );
}
