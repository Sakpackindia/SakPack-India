"use client";

import { useState } from "react";
import {
  GalleryHorizontal,
  Sparkles,
  BadgeCheck,
  LayoutGrid,
  Columns3,
  TrendingUp,
  Compass,
  Quote,
  ShieldCheck,
  Instagram,
  HelpCircle,
  Percent,
} from "lucide-react";
import HeroSlideManager from "./HeroSlideManager";
import HomeSectionsManager from "./HomeSectionsManager";

const TABS = [
  { id: "hero", label: "Hero", icon: GalleryHorizontal },
  { id: "marquee", label: "Marquee Strip", icon: Sparkles, sections: ["marquee"] },
  { id: "features", label: "Feature Strip", icon: BadgeCheck, sections: ["features"] },
  { id: "categories", label: "Shop By Category", icon: LayoutGrid, sections: ["categories"] },
  { id: "tripanel", label: "3-Panel Banner", icon: Columns3, sections: ["tripanel"] },
  { id: "bestsellers", label: "Best Sellers", icon: TrendingUp, sections: ["bestsellers"] },
  { id: "choose", label: "Find the Perfect Fit", icon: Compass, sections: ["choose"] },
  { id: "testimonials", label: "Testimonials", icon: Quote, sections: ["testimonials"] },
  { id: "whyus", label: "Why Choose Us", icon: ShieldCheck, sections: ["whyus"] },
  { id: "instagram", label: "Instagram Gallery", icon: Instagram, sections: ["instagram"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, sections: ["faq"] },
  { id: "promo", label: "Promo Banner", icon: Percent, sections: ["promo"] },
];

export default function HomeCustomizationTabs({ settings }) {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeId);

  return (
    <div>
      <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto border-b border-gold-400/20 px-4 pb-4 scrollbar-thin scrollbar-thumb-gold-400/10 scrollbar-track-transparent sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-base font-semibold transition-colors duration-300 ${
                active
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-700"
                  : "border-gold-400/20 bg-ink/[0.04] text-ink/50 hover:border-gold-400/30 hover:text-ink"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.id === "hero" ? (
        <HeroSlideManager settings={settings} />
      ) : (
        <HomeSectionsManager key={activeTab.id} settings={settings} only={activeTab.sections} />
      )}
    </div>
  );
}
