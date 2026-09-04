import { getShippingSettings } from "@/actions/admin/shipping";
import ShippingForm from "./_components/ShippingForm";

export const metadata = { title: "Shipping Settings" };

export default async function AdminShippingPage() {
  const shipping = await getShippingSettings();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Shipping <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Settings</span>
        </h1>
        <p className="text-base text-ink/50 font-semibold mt-1">Controls shipping cost shown at checkout store-wide.</p>
      </div>
      <ShippingForm shipping={shipping} />
    </div>
  );
}
