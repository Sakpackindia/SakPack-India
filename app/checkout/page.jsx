import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CheckoutForm from "./_components/CheckoutForm";
import { isRazorpayEnabled } from "@/actions/checkout";
import { getShippingSettings } from "@/actions/admin/shipping";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import { isCodEnabled, isOnlinePaymentEnabled } from "@/actions/settings";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [razorpayConfigured, shipping, quantityDiscount, bundleSettings, codEnabled, onlinePaymentEnabled] = await Promise.all([
    isRazorpayEnabled(),
    getShippingSettings(),
    getQuantityDiscountSettings(),
    getBundleSettings(),
    isCodEnabled(),
    isOnlinePaymentEnabled(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory pb-12 pt-6 sm:pt-10">
        {/* Ambient Radial Background Glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.08)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-2/3 h-96 w-96 rounded-full bg-gold-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CheckoutForm
            codEnabled={codEnabled}
            razorpayEnabled={razorpayConfigured && onlinePaymentEnabled}
            shipping={shipping}
            quantityDiscount={quantityDiscount}
            bundleSettings={bundleSettings}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
