// Cart items store color + size combined as "Color / Size" in variant_name
// (see ProductPurchasePanel's buildCartItem). This splits that back apart so
// UI can label the color by name instead of just showing a bare swatch.
export function splitVariantName(variantName) {
  if (!variantName) return { color: "", size: "" };
  const idx = variantName.indexOf(" / ");
  if (idx === -1) return { color: "", size: variantName };
  return { color: variantName.slice(0, idx), size: variantName.slice(idx + 3) };
}
