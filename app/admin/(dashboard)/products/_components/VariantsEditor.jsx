"use client";

import { useState } from "react";
import { Plus, Trash2, Wand2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink/15 bg-ivory-deep/60 px-3 py-2 text-sm font-semibold text-ink placeholder:text-ink/30 focus:border-gold-400/50 focus:bg-white focus:outline-none";
const errorInputClass = "border-red-500/60 focus:border-red-500/60";
const HEX_RE = /^#[0-9a-f]{6}$/i;

function splitList(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "Black:#000000" -> { name: "Black", hex: "#000000" }. Hex is optional —
// "Black" alone still works, it just won't get a swatch until an admin
// picks one on the row below.
function parseColorToken(token) {
  const idx = token.indexOf(":");
  if (idx === -1) return { name: token.trim(), hex: "" };
  const name = token.slice(0, idx).trim();
  const hex = token.slice(idx + 1).trim();
  return { name, hex: HEX_RE.test(hex) ? hex : "" };
}

export default function VariantsEditor({ variants, onChange, showErrors }) {
  const [colorsInput, setColorsInput] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const colorTokens = splitList(colorsInput).map(parseColorToken);

  // Picking a swatch below rewrites that color's token in the text field
  // itself, so the field stays the single source of truth for Generate.
  const pickColorHex = (name, hex) => {
    const tokens = splitList(colorsInput).map((token) => {
      const parsed = parseColorToken(token);
      return parsed.name.toLowerCase() === name.toLowerCase() ? `${parsed.name}:${hex}` : token;
    });
    setColorsInput(tokens.join(", "));
  };

  const update = (idx, key, value) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  };

  // Setting a color's hex on one row updates every other row with that same
  // color name too, so an admin only has to pick the swatch once per color.
  const updateColorHex = (idx, hex) => {
    const color = (variants[idx]?.color || "").trim().toLowerCase();
    onChange(
      variants.map((v, i) => {
        if (i === idx) return { ...v, color_hex: hex };
        if (color && (v.color || "").trim().toLowerCase() === color) return { ...v, color_hex: hex };
        return v;
      })
    );
  };

  const add = () => {
    onChange([...variants, { variant_name: "", color: "", color_hex: "", price: "", original_price: "", stock_quantity: "", weight_grams: "" }]);
  };

  const remove = (idx) => onChange(variants.filter((_, i) => i !== idx));

  const generateGrid = () => {
    const colorTokens = splitList(colorsInput).map(parseColorToken);
    const sizes = splitList(sizesInput);
    if (sizes.length === 0) return;

    const existingKeys = new Set(
      variants.map((v) => `${(v.color || "").trim().toLowerCase()}::${(v.variant_name || "").trim().toLowerCase()}`)
    );

    const rows = [];
    const colorList = colorTokens.length > 0 ? colorTokens : [{ name: "", hex: "" }];
    for (const { name: color, hex } of colorList) {
      for (const size of sizes) {
        const key = `${color.trim().toLowerCase()}::${size.trim().toLowerCase()}`;
        if (existingKeys.has(key)) continue;
        existingKeys.add(key);
        rows.push({ variant_name: size, color, color_hex: hex, price: "", original_price: "", stock_quantity: "", weight_grams: "" });
      }
    }
    if (rows.length === 0) return;

    // Drop a single still-blank starter row before adding the generated grid.
    const base = variants.filter((v) => v.variant_name?.trim() || v.color?.trim() || v.price !== "");
    onChange([...base, ...rows]);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-gold-400/35 bg-ivory-deep/60 p-4">
        <p className="mb-3 flex items-center gap-1.5 text-base font-semibold uppercase tracking-widest text-gold-600/85">
          <Wand2 className="h-3.5 w-3.5" /> Quick Generate
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            placeholder="Colors, comma separated (e.g. Black, Nude, Red) — optional"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Sizes, comma separated (e.g. S, M, L, XL)"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={generateGrid}
            className="rounded-lg border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-base font-semibold uppercase tracking-wide text-gold-700 transition-colors hover:bg-gold-400/20"
          >
            Generate
          </button>
        </div>

        {colorTokens.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {colorTokens.map(({ name, hex }) => (
              <label
                key={name}
                className="flex items-center gap-2 rounded-full border border-ink/15 bg-white px-2.5 py-1.5 shadow-sm"
              >
                <input
                  type="color"
                  value={HEX_RE.test(hex) ? hex : "#cccccc"}
                  onChange={(e) => pickColorHex(name, e.target.value)}
                  title={`Pick a shade for "${name}"`}
                  className="h-6 w-6 shrink-0 cursor-pointer rounded-full border border-ink/15 bg-ivory-deep p-0"
                />
                <span className="text-base font-semibold text-ink">{name}</span>
              </label>
            ))}
          </div>
        )}

        <p className="mt-2 text-base text-ink/40">
          Leave colors blank for a single-color product. Type the color names above, then use the color picker next to each one to set its swatch — no need to type hex codes by hand.
        </p>
      </div>

      {variants.map((v, i) => {
        const nameMissing = showErrors && !v.variant_name?.trim();
        const priceMissing = showErrors && (v.price === "" || v.price == null || Number(v.price) <= 0);
        const stockMissing = showErrors && (v.stock_quantity === "" || v.stock_quantity == null || Number(v.stock_quantity) < 0);
        const swatchValue = HEX_RE.test(v.color_hex || "") ? v.color_hex : "#cccccc";

        return (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-ink/15 p-3 sm:grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_auto]">
            <div className="flex items-center justify-center sm:pt-0">
              <input
                type="color"
                value={swatchValue}
                onChange={(e) => updateColorHex(i, e.target.value)}
                disabled={!v.color?.trim()}
                title={v.color?.trim() ? `Swatch for ${v.color}` : "Enter a color name first"}
                className="h-9 w-9 shrink-0 cursor-pointer rounded-full border border-ink/15 bg-ivory-deep p-0.5 disabled:cursor-not-allowed disabled:opacity-30"
              />
            </div>
            <div>
              <input
                placeholder="Color (optional)"
                value={v.color || ""}
                onChange={(e) => update(i, "color", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <input
                placeholder="Size (e.g. S, M, L, XL)"
                value={v.variant_name}
                onChange={(e) => update(i, "variant_name", e.target.value)}
                className={`${inputClass} ${nameMissing ? errorInputClass : ""}`}
              />
              {nameMissing && <p className="mt-1 text-base text-red-400">Size name required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => update(i, "price", e.target.value)}
                className={`${inputClass} ${priceMissing ? errorInputClass : ""}`}
              />
              {priceMissing && <p className="mt-1 text-base text-red-400">Valid price required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Old price"
                value={v.original_price}
                onChange={(e) => update(i, "original_price", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Stock"
                value={v.stock_quantity}
                onChange={(e) => update(i, "stock_quantity", e.target.value)}
                className={`${inputClass} ${stockMissing ? errorInputClass : ""}`}
              />
              {stockMissing && <p className="mt-1 text-base text-red-400">Stock required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Weight (g)"
                value={v.weight_grams ?? ""}
                onChange={(e) => update(i, "weight_grams", e.target.value)}
                className={inputClass}
              />
            </div>
            <button type="button" onClick={() => remove(i)} className="flex h-fit items-center justify-center rounded-lg p-2 text-ink/40 hover:bg-ink hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-base text-gold-600 hover:text-gold-700"
      >
        <Plus className="h-4 w-4" /> Add Variant
      </button>
      <p className="text-base text-ink/40">
        Weight (grams) is used for courier shipment booking — leave blank to use a default estimate.
      </p>
    </div>
  );
}
