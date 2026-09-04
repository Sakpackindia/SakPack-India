import { getSiteSettings } from "@/actions/settings";
import AboutCustomizationTabs from "./_components/AboutCustomizationTabs";

export const metadata = { title: "About Page" };

export default async function AdminAboutPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          About <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Page</span>
        </h1>
        <p className="text-base text-ink/50 font-semibold mt-1">Manage every section of the About Us page — text, images, and visibility.</p>
      </div>

      <AboutCustomizationTabs settings={settings} />
    </div>
  );
}
