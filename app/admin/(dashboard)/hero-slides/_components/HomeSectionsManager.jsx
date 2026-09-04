"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, ArrowRight, Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";
const panelClass =
  "rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md md:p-8";

const SECTIONS = [
  {
    id: "marquee",
    title: "Marquee Strip",
    enabledKey: "home_marquee_enabled",
    fields: [
      {
        key: "home_marquee_items",
        label: "Items",
        hint: "One item per line. Start a line with * to highlight it in gold.",
        rows: 8,
      },
    ],
  },
  {
    id: "features",
    title: "Feature Strip",
    enabledKey: "home_features_enabled",
    fields: [
      { key: "home_feature1_title", label: "Item 1 — Title" },
      { key: "home_feature1_desc", label: "Item 1 — Description" },
      { key: "home_feature2_title", label: "Item 2 — Title" },
      { key: "home_feature2_desc", label: "Item 2 — Description" },
      { key: "home_feature3_title", label: "Item 3 — Title" },
      { key: "home_feature3_desc", label: "Item 3 — Description" },
      { key: "home_feature4_title", label: "Item 4 — Title" },
      { key: "home_feature4_desc", label: "Item 4 — Description" },
    ],
  },
  {
    id: "categories",
    title: "Shop By Category",
    enabledKey: "home_categories_enabled",
    fields: [{ key: "home_categories_heading", label: "Heading" }],
    note: "Manage the actual categories on the Categories page.",
    noteHref: "/admin/categories",
  },
  {
    id: "tripanel",
    title: "3-Panel Banner",
    enabledKey: "home_tripanel_enabled",
    fields: [
      { key: "home_tripanel_panel1_label", label: "Panel 1 — Label" },
      { key: "home_tripanel_panel1_heading", label: "Panel 1 — Heading", hint: "Use Enter for a line break.", rows: 2 },
      { key: "home_tripanel_panel1_button_text", label: "Panel 1 — Button Text" },
      { key: "home_tripanel_panel2_label", label: "Panel 2 — Label" },
      { key: "home_tripanel_panel2_heading", label: "Panel 2 — Heading", hint: "Use Enter for a line break.", rows: 2 },
      { key: "home_tripanel_panel2_button_text", label: "Panel 2 — Button Text" },
      { key: "home_tripanel_panel3_label", label: "Panel 3 — Label" },
      { key: "home_tripanel_panel3_heading", label: "Panel 3 — Heading", hint: "Use Enter for a line break.", rows: 2 },
      { key: "home_tripanel_panel3_button_text", label: "Panel 3 — Button Text" },
    ],
  },
  {
    id: "bestsellers",
    title: "Best Sellers",
    enabledKey: "home_bestsellers_enabled",
    fields: [{ key: "home_bestsellers_heading", label: "Heading" }],
    note: "Manage the actual products on the Products page.",
    noteHref: "/admin/products",
  },
  {
    id: "choose",
    title: "Find the Perfect Fit",
    enabledKey: "home_choose_enabled",
    fields: [
      { key: "home_choose_subtitle", label: "Subtitle" },
      { key: "home_choose_option1_title", label: "Option 1 — Title" },
      { key: "home_choose_option1_desc", label: "Option 1 — Description" },
      { key: "home_choose_option2_title", label: "Option 2 — Title" },
      { key: "home_choose_option2_desc", label: "Option 2 — Description" },
      { key: "home_choose_option3_title", label: "Option 3 — Title" },
      { key: "home_choose_option3_desc", label: "Option 3 — Description" },
      { key: "home_choose_unsure_title", label: "Consultation Card — Heading" },
      { key: "home_choose_unsure_text", label: "Consultation Card — Text" },
      { key: "home_choose_unsure_button", label: "Consultation Card — Button Text" },
    ],
    imageKey: "home_choose_image",
  },
  {
    id: "testimonials",
    title: "What Our Customers Say",
    enabledKey: "home_testimonials_enabled",
    fields: [
      { key: "home_testimonials_eyebrow", label: "Eyebrow Badge Text" },
      { key: "home_testimonials_heading", label: "Heading" },
      { key: "home_testimonials_subtitle", label: "Subtitle" },
    ],
    note: "Manage the actual customer reviews on the Testimonials page.",
    noteHref: "/admin/testimonials",
  },
  {
    id: "whyus",
    title: "Why Choose Us",
    enabledKey: "home_whyus_enabled",
    fields: [
      { key: "home_whyus_eyebrow", label: "Eyebrow Badge Text" },
      { key: "home_whyus_heading", label: "Heading" },
      { key: "home_whyus_stat1_value", label: "Stat 1 — Value" },
      { key: "home_whyus_stat1_title", label: "Stat 1 — Title" },
      { key: "home_whyus_stat1_desc", label: "Stat 1 — Description" },
      { key: "home_whyus_stat2_value", label: "Stat 2 — Value" },
      { key: "home_whyus_stat2_title", label: "Stat 2 — Title" },
      { key: "home_whyus_stat2_desc", label: "Stat 2 — Description" },
      { key: "home_whyus_stat3_value", label: "Stat 3 — Value" },
      { key: "home_whyus_stat3_title", label: "Stat 3 — Title" },
      { key: "home_whyus_stat3_desc", label: "Stat 3 — Description" },
      { key: "home_whyus_point1_title", label: "Point 1 — Title" },
      { key: "home_whyus_point1_desc", label: "Point 1 — Description" },
      { key: "home_whyus_point2_title", label: "Point 2 — Title" },
      { key: "home_whyus_point2_desc", label: "Point 2 — Description" },
      { key: "home_whyus_point3_title", label: "Point 3 — Title" },
      { key: "home_whyus_point3_desc", label: "Point 3 — Description" },
      { key: "home_whyus_point4_title", label: "Point 4 — Title" },
      { key: "home_whyus_point4_desc", label: "Point 4 — Description" },
    ],
  },
  {
    id: "instagram",
    title: "Instagram Gallery",
    enabledKey: "home_instagram_enabled",
    fields: [{ key: "home_instagram_heading", label: "Heading" }],
    photosKey: "home_instagram_photos",
  },
  {
    id: "faq",
    title: "Questions You Might Have",
    enabledKey: "home_faq_enabled",
    fields: [
      { key: "home_faq_subtitle", label: "Subtitle" },
      { key: "home_faq_q1", label: "Question 1" },
      { key: "home_faq_a1", label: "Answer 1" },
      { key: "home_faq_q2", label: "Question 2" },
      { key: "home_faq_a2", label: "Answer 2" },
      { key: "home_faq_q3", label: "Question 3" },
      { key: "home_faq_a3", label: "Answer 3" },
      { key: "home_faq_q4", label: "Question 4" },
      { key: "home_faq_a4", label: "Answer 4" },
    ],
    imageKey: "home_faq_image",
  },
  {
    id: "promo",
    title: "Promo Banner",
    enabledKey: "home_promo_enabled",
    fields: [
      { key: "home_promo_code", label: "Coupon Code" },
      { key: "home_promo_discount", label: "Discount Headline (e.g. 30% OFF)" },
      { key: "home_promo_subtitle", label: "Subtitle" },
    ],
    imageKey: "home_promo_image",
    imageHint: "Upload a square (1:1) photo for the best crop — it fills the right edge of the banner.",
  },
];

export default function HomeSectionsManager({ settings, only }) {
  const router = useRouter();
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
    if (section.photosKey) {
      let parsed = [];
      try {
        parsed = JSON.parse(settings[section.photosKey]?.value || "[]");
      } catch {
        parsed = [];
      }
      initialValues[section.photosKey] = Array.isArray(parsed) ? parsed : [];
    }
    if (section.enabledKey) initialValues[section.enabledKey] = settings[section.enabledKey]?.value ?? "true";
  });

  const [values, setValues] = useState(initialValues);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const addPhoto = (key) => {
    setValues((prev) => ({ ...prev, [key]: [...(prev[key] || []), { image: "", link: "" }] }));
  };

  const updatePhoto = (key, idx, field, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));
  };

  const removePhoto = (key, idx) => {
    setValues((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  const handleSave = (section) => {
    const keys = [
      ...section.fields.map((f) => f.key),
      ...(section.imageKey ? [section.imageKey] : []),
      ...(section.photosKey ? [section.photosKey] : []),
      ...(section.enabledKey ? [section.enabledKey] : []),
    ];

    setSaved(null);
    setSavingId(section.id);
    startTransition(async () => {
      const results = await Promise.all(
        keys.map((key) => {
          const value = section.photosKey === key ? JSON.stringify(values[key] || []) : values[key];
          return updateSiteSetting(key, value);
        })
      );
      const failed = results.find((r) => !r.success);
      setSavingId(null);
      if (failed) {
        setSaved({ id: section.id, success: false, error: failed.error });
      } else {
        setSaved({ id: section.id, success: true });
        router.refresh();
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
                    Show on Homepage
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
                  {field.hint && <p className="mb-1.5 -mt-1 text-base font-semibold text-ink/30">{field.hint}</p>}
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
                  {section.imageHint && <p className="mb-1.5 -mt-1 text-base font-semibold text-ink/30">{section.imageHint}</p>}
                  <ImageUploader
                    value={values[section.imageKey]}
                    onChange={(url) => handleChange(section.imageKey, url)}
                    folder="amairah/home-sections"
                  />
                </div>
              )}

              {section.photosKey && (
                <div>
                  <label className={labelClass}>Photos</label>
                  <p className="mb-3 -mt-1 text-base font-semibold text-ink/30">
                    Each photo can optionally link to a specific Instagram post — leave the link blank to send visitors to your Instagram profile instead.
                  </p>
                  <div className="space-y-3">
                    {values[section.photosKey].map((photo, idx) => (
                      <div key={idx} className="flex flex-col gap-3 rounded-xl border border-gold-400/20 bg-ink/[0.03] p-3 sm:flex-row sm:items-center">
                        <ImageUploader
                          value={photo.image}
                          onChange={(url) => updatePhoto(section.photosKey, idx, "image", url)}
                          folder="amairah/instagram"
                          previewClassName="h-20 w-20"
                        />
                        <div className="flex-1">
                          <label className={labelClass}>Post Link (optional)</label>
                          <input
                            type="text"
                            value={photo.link}
                            onChange={(e) => updatePhoto(section.photosKey, idx, "link", e.target.value)}
                            placeholder="https://instagram.com/p/..."
                            className={inputClass}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(section.photosKey, idx)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-red-400/70 transition-colors hover:bg-red-400/10 hover:text-red-500 sm:self-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addPhoto(section.photosKey)}
                    className="mt-3 flex items-center gap-1.5 rounded-lg border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-base font-semibold text-gold-700 transition-colors hover:bg-gold-400/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Photo
                  </button>
                </div>
              )}

              {section.note && (
                <Link
                  href={section.noteHref}
                  className="flex items-center gap-1.5 text-base font-semibold text-gold-600/80 transition-colors hover:text-gold-700"
                >
                  {section.note} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
