"use client";

import { useState, useTransition } from "react";
import { Check, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";
const panelClass =
  "rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md md:p-8";

const SECTIONS = [
  {
    id: "hero",
    title: "Hero",
    enabledKey: "about_hero_enabled",
    fields: [
      { key: "about_hero_badge_text", label: "Eyebrow Badge Text" },
      { key: "about_hero_title_line1", label: "Title — Line 1" },
      { key: "about_hero_title_highlight", label: "Title — Line 2 (highlighted in gold)" },
      { key: "about_hero_paragraph", label: "Paragraph", rows: 3 },
      { key: "about_hero_button_text", label: "Button Text" },
      { key: "about_hero_badge_year", label: "Floating Badge — Year Line" },
      { key: "about_hero_badge_caption", label: "Floating Badge — Caption" },
    ],
    imageKey: "about_hero_image",
  },
  {
    id: "story",
    title: "Our Story",
    enabledKey: "about_story_enabled",
    fields: [
      { key: "about_story_eyebrow", label: "Eyebrow Text" },
      { key: "about_story_title_line1", label: "Title — Line 1" },
      { key: "about_story_title_highlight", label: "Title — Line 2 (highlighted in gold)" },
      { key: "about_story_paragraph", label: "Paragraph", rows: 3 },
      { key: "about_story_callout_title", label: "Location Callout — Heading" },
      { key: "about_story_callout_text", label: "Location Callout — Text", rows: 2 },
    ],
  },
  {
    id: "commitments",
    title: "Our Commitment To You",
    enabledKey: "about_commitments_enabled",
    fields: [
      { key: "about_commitments_eyebrow", label: "Eyebrow Text" },
      { key: "about_commitments_heading", label: "Heading" },
      { key: "about_commitment1_title", label: "Card 1 — Title" },
      { key: "about_commitment1_text", label: "Card 1 — Text", rows: 2 },
      { key: "about_commitment2_title", label: "Card 2 — Title" },
      { key: "about_commitment2_text", label: "Card 2 — Text", rows: 2 },
      { key: "about_commitment3_title", label: "Card 3 — Title" },
      { key: "about_commitment3_text", label: "Card 3 — Text", rows: 2 },
      { key: "about_commitment4_title", label: "Card 4 — Title" },
      { key: "about_commitment4_text", label: "Card 4 — Text", rows: 2 },
      { key: "about_commitment5_title", label: "Card 5 — Title" },
      { key: "about_commitment5_text", label: "Card 5 — Text", rows: 2 },
    ],
  },
  {
    id: "stats",
    title: "Sakpack By Numbers",
    fields: [
      { key: "about_stats_eyebrow", label: "Eyebrow Text" },
      { key: "about_stat1_value", label: "Stat 1 — Value (e.g. 10k+)" },
      { key: "about_stat1_label", label: "Stat 1 — Label" },
      { key: "about_stat2_value", label: "Stat 2 — Value" },
      { key: "about_stat2_label", label: "Stat 2 — Label" },
      { key: "about_stat3_value", label: "Stat 3 — Value" },
      { key: "about_stat3_label", label: "Stat 3 — Label" },
    ],
  },
  {
    id: "advantages",
    title: "Why Choose Sakpack India",
    enabledKey: "about_advantages_enabled",
    fields: [
      { key: "about_advantages_eyebrow", label: "Eyebrow Text" },
      { key: "about_advantages_title_line1", label: "Title — Line 1" },
      { key: "about_advantages_title_highlight", label: "Title — Line 2 (highlighted in gold)" },
      { key: "about_advantages_paragraph", label: "Paragraph", rows: 3 },
      { key: "about_advantages_tag_title", label: "Highlight Tag — Title" },
      { key: "about_advantages_tag_subtitle", label: "Highlight Tag — Subtitle" },
      { key: "about_advantage1", label: "Advantage 1" },
      { key: "about_advantage2", label: "Advantage 2" },
      { key: "about_advantage3", label: "Advantage 3" },
      { key: "about_advantage4", label: "Advantage 4" },
      { key: "about_advantage5", label: "Advantage 5" },
      { key: "about_advantage6", label: "Advantage 6" },
      { key: "about_advantage7", label: "Advantage 7" },
      { key: "about_advantage8", label: "Advantage 8" },
    ],
  },
  {
    id: "vision",
    title: "Vision & Every Body",
    enabledKey: "about_vision_enabled",
    fields: [
      { key: "about_vision_badge", label: "Vision Card — Badge" },
      { key: "about_vision_title", label: "Vision Card — Title" },
      { key: "about_vision_text", label: "Vision Card — Text", rows: 2 },
      { key: "about_vision_footer", label: "Vision Card — Footer Label" },
      { key: "about_inclusivity_badge", label: "Inclusivity Card — Badge" },
      { key: "about_inclusivity_title", label: "Inclusivity Card — Title" },
      { key: "about_inclusivity_text", label: "Inclusivity Card — Text", rows: 2 },
      { key: "about_inclusivity_footer", label: "Inclusivity Card — Footer Label" },
    ],
  },
  {
    id: "promise",
    title: "Our Promise Banner",
    enabledKey: "about_promise_enabled",
    fields: [
      { key: "about_promise_eyebrow", label: "Eyebrow Text" },
      { key: "about_promise_quote", label: "Quote", rows: 2 },
      { key: "about_promise_tagline", label: "Tagline" },
      { key: "about_promise_button_text", label: "Button Text" },
    ],
  },
];

export default function AboutSectionsManager({ settings, only }) {
  const [pending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState(null);
  const [saved, setSaved] = useState(null);

  const sections = only ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;

  const initialValues = {};
  sections.forEach((section) => {
    section.fields.forEach((f) => {
      initialValues[f.key] = settings[f.key]?.value ?? "";
    });
    if (section.imageKey) initialValues[section.imageKey] = settings[section.imageKey]?.value ?? "";
    if (section.enabledKey) initialValues[section.enabledKey] = settings[section.enabledKey]?.value ?? "true";
  });

  const [values, setValues] = useState(initialValues);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (section) => {
    const keys = [
      ...section.fields.map((f) => f.key),
      ...(section.imageKey ? [section.imageKey] : []),
      ...(section.enabledKey ? [section.enabledKey] : []),
    ];

    setSaved(null);
    setSavingId(section.id);
    startTransition(async () => {
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      setSavingId(null);
      if (failed) {
        setSaved({ id: section.id, success: false, error: failed.error });
      } else {
        setSaved({ id: section.id, success: true });
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const isSaving = pending && savingId === section.id;
        const sectionEnabled = section.enabledKey ? values[section.enabledKey] !== "false" : true;

        return (
          <div key={section.id} className={panelClass}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{section.title}</h3>
                {section.enabledKey && (
                  <label className="flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-ink/[0.04] px-3 py-1 text-base font-semibold text-ink/60">
                    <input
                      type="checkbox"
                      checked={sectionEnabled}
                      onChange={(e) => handleChange(section.enabledKey, e.target.checked ? "true" : "false")}
                    />
                    Show on About Page
                  </label>
                )}
              </div>
              <button
                onClick={() => handleSave(section)}
                disabled={isSaving}
                className="btn-gold w-full px-6 py-2.5 text-base font-semibold disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <textarea
                    value={values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.rows ?? (values[field.key]?.length > 80 ? 3 : 1)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              ))}

              {section.imageKey && (
                <div>
                  <label className={labelClass}>Image</label>
                  <ImageUploader
                    value={values[section.imageKey]}
                    onChange={(url) => handleChange(section.imageKey, url)}
                    folder="sakpack/about"
                  />
                </div>
              )}
            </div>

            {saved?.id === section.id && (
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
      })}
    </div>
  );
}
