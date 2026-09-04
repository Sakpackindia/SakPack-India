"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, Sparkles } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";
const panelClass =
  "rounded-[2rem] border border-gold-400/20 bg-white/85 backdrop-blur-md";

const HERO_ENABLED_KEY = "home_hero_enabled";

const HERO_SETTINGS_FIELDS = [
  { key: "home_hero_badge_text", label: "Badge Text", hint: "The small pill shown above the title (e.g. \"Up To 30% Off\")." },
  { key: "home_hero_button_text", label: "Button Text", hint: "The main call-to-action button, e.g. \"Shop Now\"." },
];

const HERO_SLIDES = [
  { taglineKey: "home_hero_tagline1", imageKey: "home_hero_slide1_image", mobileImageKey: "home_hero_slide1_mobile_image", label: "Slide 1" },
  { taglineKey: "home_hero_tagline2", imageKey: "home_hero_slide2_image", mobileImageKey: "home_hero_slide2_mobile_image", label: "Slide 2" },
  { taglineKey: "home_hero_tagline3", imageKey: "home_hero_slide3_image", mobileImageKey: "home_hero_slide3_mobile_image", label: "Slide 3" },
  { taglineKey: "home_hero_tagline4", imageKey: "home_hero_slide4_image", mobileImageKey: "home_hero_slide4_mobile_image", label: "Slide 4" },
  { taglineKey: "home_hero_tagline5", imageKey: "home_hero_slide5_image", mobileImageKey: "home_hero_slide5_mobile_image", label: "Slide 5" },
];

export default function HeroSlideManager({ settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(null);
  const [values, setValues] = useState(() => {
    const initial = { [HERO_ENABLED_KEY]: settings[HERO_ENABLED_KEY]?.value ?? "true" };
    HERO_SETTINGS_FIELDS.forEach((f) => {
      initial[f.key] = settings[f.key]?.value ?? "";
    });
    HERO_SLIDES.forEach((s) => {
      initial[s.taglineKey] = settings[s.taglineKey]?.value ?? "";
      initial[s.imageKey] = settings[s.imageKey]?.value ?? "";
      initial[s.mobileImageKey] = settings[s.mobileImageKey]?.value ?? "";
    });
    return initial;
  });
  const heroEnabled = values[HERO_ENABLED_KEY] !== "false";

  const handleChange = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = [
        HERO_ENABLED_KEY,
        ...HERO_SETTINGS_FIELDS.map((f) => f.key),
        ...HERO_SLIDES.flatMap((s) => [s.taglineKey, s.imageKey, s.mobileImageKey]),
      ];
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      if (failed) {
        setSaved({ success: false, error: failed.error });
      } else {
        setSaved({ success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className={`${panelClass} p-6 md:p-8`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Hero Section</h2>
            <p className="text-base font-semibold text-ink/40">The banner at the very top of the homepage.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-ink/[0.04] px-3 py-1 text-base font-semibold text-ink/60">
            <input
              type="checkbox"
              checked={heroEnabled}
              onChange={(e) => handleChange(HERO_ENABLED_KEY, e.target.checked ? "true" : "false")}
            />
            Show on Homepage
          </label>
          <button onClick={handleSave} disabled={pending} className="btn-gold px-6 py-2.5 text-base font-semibold disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HERO_SETTINGS_FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClass}>{field.label}</label>
            <input
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={inputClass}
            />
            {field.hint && <p className="mt-1.5 text-base font-semibold text-ink/30">{field.hint}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gold-400/15 pt-5">
        <p className="mb-1 font-display text-base font-semibold text-ink">Rotating Taglines & Slide Photos</p>
        <p className="mb-4 text-base font-semibold text-ink/30">
          The logo, "SAKPACK INDIA" title and button always stay centered as-is — each slide below just swaps the tagline text and the photo behind it as it rotates. Up to 5 slides — slides 4 and 5 are optional, leave a slide's tagline blank to skip it entirely, and leave just a photo blank to keep the tagline with a plain background. The mobile photo is optional too — if you skip it, phones just show the regular photo instead.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HERO_SLIDES.map((s, i) => (
            <div key={s.taglineKey} className="rounded-2xl border border-gold-400/15 p-4">
              <label className={labelClass}>{s.label} — Tagline{i >= 3 ? " (optional)" : ""}</label>
              <input
                value={values[s.taglineKey]}
                onChange={(e) => handleChange(s.taglineKey, e.target.value)}
                placeholder={i >= 3 ? "Leave blank to skip this slide" : ""}
                className={inputClass}
              />
              <label className={`${labelClass} mt-4`}>{s.label} — Photo (desktop, wide)</label>
              <ImageUploader
                value={values[s.imageKey]}
                onChange={(url) => handleChange(s.imageKey, url)}
                folder="sakpack/hero"
                previewClassName="aspect-video w-full"
              />
              <label className={`${labelClass} mt-4`}>{s.label} — Mobile Photo (4:5, optional)</label>
              <ImageUploader
                value={values[s.mobileImageKey]}
                onChange={(url) => handleChange(s.mobileImageKey, url)}
                folder="sakpack/hero"
                previewClassName="aspect-[4/5] w-32"
              />
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div className={`mt-4 flex items-center gap-2 text-base font-semibold ${saved.success ? "text-emerald-400" : "text-red-400"}`}>
          {saved.success ? (
            <>
              <Check className="h-3.5 w-3.5" /> Saved successfully
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
            </>
          )}
        </div>
      )}
    </div>
  );
}
