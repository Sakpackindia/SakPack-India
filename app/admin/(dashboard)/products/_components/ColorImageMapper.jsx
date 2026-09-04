"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

/**
 * `images` is an array of `{ url, color }`, where `color` is either null
 * (shows for every color — "General") or one of this product's colors.
 *
 * Product photos vary by color (a black bra and a white bra are different
 * photos), not by size, so tabs are built from the distinct colors entered
 * in the variants list. Products with no color option (single-color items)
 * fall back to size tabs instead, so a plain product still gets one image
 * set per size the way it always has.
 */
export default function ColorImageMapper({ images, onChange, variants, folder = "sakpack/products" }) {
  const colors = Array.from(
    new Set((variants || []).map((v) => (v.color || "").trim()).filter(Boolean))
  );
  const usesColor = colors.length > 0;

  const sizes = Array.from(
    new Set((variants || []).map((v) => (v.variant_name || "").trim()).filter(Boolean))
  );

  const dimensionTabs = (usesColor ? colors : sizes).map((name) => ({ key: name, name, label: name }));
  const tabs = [{ key: "General", name: null, label: "General" }, ...dimensionTabs];

  const [active, setActive] = useState("General");
  const activeTab = tabs.find((t) => t.key === active) || tabs[0];
  const activeKey = activeTab.key === "General" ? null : activeTab.key;

  const matchesTab = (imgTag, tab) => {
    if (tab.key === "General") return !imgTag;
    return imgTag === tab.key;
  };

  const activeUrls = images.filter((img) => matchesTab(img.color, activeTab)).map((img) => img.url);

  const setActiveUrls = (urls) => {
    const others = images.filter((img) => !matchesTab(img.color, activeTab));
    onChange([...others, ...urls.map((url) => ({ url, color: activeKey }))]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = images.filter((img) => matchesTab(img.color, t)).length;
          return (
            <button
              type="button"
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-base font-semibold uppercase tracking-wide transition-all duration-300 ${
                activeTab.key === t.key
                  ? "border-gold-300/60 bg-gold-400/15 text-gold-700"
                  : "border-ink/15 bg-ivory-deep/60 text-ink/50 hover:border-gold-400/35 hover:text-ink"
              }`}
            >
              {t.label}
              {count > 0 && <span className="text-base text-ink/40">({count})</span>}
            </button>
          );
        })}
      </div>

      <p className="text-base text-ink/40">
        {activeTab.key === "General"
          ? "These images show for every color."
          : usesColor
            ? `These images show only when a shopper selects color "${activeTab.label}".`
            : `These images show only when a shopper selects size "${activeTab.label}".`}
      </p>

      {/*
        `key` forces a full remount when the tab changes. next-cloudinary's
        CldUploadWidget creates its underlying widget once and never updates
        its onSuccess callback on prop changes, so without this the widget
        keeps using whichever tab was active when it was first opened —
        every later upload (and every "removed" image, since it also
        replays a stale snapshot of the gallery) would land back on that
        original tab instead of the one currently selected.
      */}
      <ImageUploader key={activeTab.key} value={activeUrls} onChange={setActiveUrls} multiple folder={folder} />
    </div>
  );
}
