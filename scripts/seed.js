// One-off demo data seeder. Run after applying schema.sql in the Supabase
// SQL Editor: `npm run seed`. Safe to re-run — skips categories/products
// that already exist (matched by slug).
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  console.error("Run with: node --env-file=.env scripts/seed.js");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const CATEGORIES = [
  {
    name: "Bra",
    slug: "bra",
    description: "Everyday comfort bras in soft, breathable fabrics.",
    sort_order: 0,
  },
  {
    name: "Panty",
    slug: "panty",
    description: "Cotton-rich panties made for all-day comfort.",
    sort_order: 1,
  },
  {
    name: "Palazzo",
    slug: "palazzo",
    description: "Flowy, relaxed-fit palazzos for everyday wear.",
    sort_order: 2,
  },
  {
    name: "Legging",
    slug: "legging",
    description: "Stretch leggings that move with you.",
    sort_order: 3,
  },
  {
    name: "Cord Set",
    slug: "cord-set",
    description: "Matching co-ord sets for effortless everyday style.",
    sort_order: 4,
  },
];

const SIZES = ["S", "M", "L", "XL"];

function sizeVariants(price, originalPrice, stockPerSize = 15) {
  return SIZES.map((size) => ({
    variant_name: size,
    price,
    original_price: originalPrice,
    stock_quantity: stockPerSize,
  }));
}

const PRODUCTS = [
  {
    name: "Everyday Comfort Bra",
    color: "Black",
    fabric: "Cotton Blend",
    categorySlug: "bra",
    badge: "Bestseller",
    short_description: "Soft, wire-free bra built for all-day comfort.",
    description:
      "A everyday essential — soft cotton-blend cups, wire-free support, and breathable straps that stay comfortable from morning to night. Designed for real, everyday wear.",
    is_featured: true,
    variants: sizeVariants(699, 999),
    faqs: [
      { question: "Is this bra wire-free?", answer: "Yes — it uses soft cotton-blend cups with no underwire." },
    ],
  },
  {
    name: "Cotton Comfort Panty",
    color: "Rose Pink",
    fabric: "Pure Cotton",
    categorySlug: "panty",
    badge: "New",
    short_description: "Breathable cotton panty with a soft, stretch waistband.",
    description:
      "Made from pure cotton for everyday breathability, with a soft stretch waistband that sits comfortably all day without digging in.",
    is_featured: true,
    variants: sizeVariants(299, 499),
    faqs: [],
  },
  {
    name: "Soft Palazzo",
    color: "Maroon",
    fabric: "Rayon",
    categorySlug: "palazzo",
    badge: "Signature",
    short_description: "Relaxed-fit flowy palazzo with a drawstring waist.",
    description:
      "A relaxed, flowy silhouette in soft rayon fabric with an adjustable drawstring waist — dress it up or keep it easy for everyday wear.",
    is_featured: true,
    variants: sizeVariants(599, 899),
    faqs: [],
  },
  {
    name: "Stretch Legging",
    color: "Black",
    fabric: "Cotton Lycra",
    categorySlug: "legging",
    badge: null,
    short_description: "Four-way stretch legging that moves with you.",
    description:
      "Soft cotton-lycra fabric with four-way stretch for a fit that moves with you all day — an everyday wardrobe staple.",
    is_featured: false,
    variants: sizeVariants(499, 799),
    faqs: [],
  },
  {
    name: "Cozy Cord Set",
    color: "Dusty Pink",
    fabric: "Cotton Fleece",
    categorySlug: "cord-set",
    badge: "Bestseller",
    short_description: "Matching co-ord set for effortless everyday style.",
    description:
      "A soft, cozy co-ord set — button-down top and matching pants in brushed cotton fleece. Easy to wear, easy to love.",
    is_featured: true,
    variants: sizeVariants(999, 1499),
    faqs: [
      { question: "Does the set come as separates?", answer: "It's sold as a matching top + bottom set." },
    ],
  },
];

async function upsertCategories() {
  const map = {};
  for (const cat of CATEGORIES) {
    const { data: existing } = await supabase.from("categories").select("id").eq("slug", cat.slug).maybeSingle();
    if (existing) {
      map[cat.slug] = existing.id;
      continue;
    }
    const { data, error } = await supabase.from("categories").insert(cat).select("id").single();
    if (error) throw error;
    map[cat.slug] = data.id;
    console.log(`Created category: ${cat.name}`);
  }
  return map;
}

async function upsertProducts(categoryMap) {
  for (const p of PRODUCTS) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      console.log(`Skipped existing product: ${p.name}`);
      continue;
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: p.name,
        slug,
        category_id: categoryMap[p.categorySlug] || null,
        color: p.color,
        fabric: p.fabric,
        badge: p.badge,
        short_description: p.short_description,
        description: p.description,
        is_active: true,
        is_featured: p.is_featured,
      })
      .select("id")
      .single();

    if (error) throw error;

    await supabase.from("product_variants").insert(
      p.variants.map((v) => ({ product_id: product.id, ...v }))
    );
    if (p.faqs.length) {
      await supabase.from("product_faqs").insert(
        p.faqs.map((f, i) => ({ product_id: product.id, ...f, display_order: i }))
      );
    }

    console.log(`Created product: ${p.name}`);
  }
}

async function seedAnnouncement() {
  const { data } = await supabase.from("announcements").select("id").limit(1);
  if (data && data.length > 0) return;
  await supabase.from("announcements").insert({
    message: "Free delivery on all orders — use code SAKPACK30 for flat 30% off",
    is_active: true,
  });
  console.log("Created a default announcement.");
}

async function main() {
  console.log("Seeding Sakpack India demo data...");
  const categoryMap = await upsertCategories();
  await upsertProducts(categoryMap);
  await seedAnnouncement();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
