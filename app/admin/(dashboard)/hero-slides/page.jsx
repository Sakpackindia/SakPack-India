import { getSiteSettings } from "@/actions/settings";
import HomeCustomizationTabs from "./_components/HomeCustomizationTabs";

export const metadata = { title: "Home Customization" };

export default async function AdminHomePage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Home <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Customization</span>
        </h1>
        <p className="text-base text-ink/50 font-semibold mt-1">Manage the hero banner and every content section on the homepage.</p>
      </div>

      <HomeCustomizationTabs settings={settings} />
    </div>
  );
}
