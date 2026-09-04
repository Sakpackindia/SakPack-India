"use client";

import { useState } from "react";
import { GalleryHorizontal, BookOpen, Award, TrendingUp, Sparkles, HeartHandshake, Quote } from "lucide-react";
import AboutSectionsManager from "./AboutSectionsManager";

const TABS = [
  { id: "hero", label: "Hero", icon: GalleryHorizontal, sections: ["hero"] },
  { id: "story", label: "Our Story", icon: BookOpen, sections: ["story"] },
  { id: "commitments", label: "Our Commitment", icon: Award, sections: ["commitments"] },
  { id: "stats", label: "Sakpack By Numbers", icon: TrendingUp, sections: ["stats"] },
  { id: "advantages", label: "Why Choose Us", icon: Sparkles, sections: ["advantages"] },
  { id: "vision", label: "Vision & Every Body", icon: HeartHandshake, sections: ["vision"] },
  { id: "promise", label: "Promise Banner", icon: Quote, sections: ["promise"] },
];

export default function AboutCustomizationTabs({ settings }) {
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

      <AboutSectionsManager key={activeTab.id} settings={settings} only={activeTab.sections} />
    </div>
  );
}
