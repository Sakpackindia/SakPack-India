// Shared between the admin product form (client-side, instant feedback) and
// the create/update server actions (last line of defense against bad data).
// A variant is a (color, size) pair — color is optional, so a single-color
// product can leave it blank and behaves exactly like a size-only variant.
export function validateVariants(variants) {
  if (!variants || variants.length === 0) return "Add at least one size.";

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const label = v.variant_name && String(v.variant_name).trim() ? `"${v.variant_name}"` : `Size #${i + 1}`;

    if (!v.variant_name || !String(v.variant_name).trim()) {
      return `${label}: please enter a size name (e.g. S, M, L, XL).`;
    }
    if (v.price === "" || v.price == null || Number.isNaN(Number(v.price)) || Number(v.price) <= 0) {
      return `${label}: please enter a valid price.`;
    }
    if (v.stock_quantity === "" || v.stock_quantity == null || Number.isNaN(Number(v.stock_quantity)) || Number(v.stock_quantity) < 0) {
      return `${label}: please enter a stock quantity.`;
    }
  }

  const keys = variants.map((v) => `${String(v.color || "").trim().toLowerCase()}::${String(v.variant_name).trim().toLowerCase()}`);
  const dupeIdx = keys.findIndex((k, i) => keys.indexOf(k) !== i);
  if (dupeIdx !== -1) {
    const dupe = variants[dupeIdx];
    const combo = dupe.color ? `${dupe.color} / ${dupe.variant_name}` : dupe.variant_name;
    return `Duplicate variant "${combo}" — each color + size combination must be unique.`;
  }

  return null;
}
