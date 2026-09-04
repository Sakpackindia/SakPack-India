"use server";

// Sakpack India - Products Actions (Strict Async Exports Only)
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

const LISTING_SELECT = `
  id, name, slug, badge, color, average_rating, review_count,
  featured_image_url, category_id, is_featured, short_description,
  product_images ( image_url, sort_order, variant_name, color ),
  product_variants ( id, variant_name, color, color_hex, price, original_price, stock_quantity, is_active )
`;

function withDisplayPrice(product) {
  const activeVariants = (product.product_variants || []).filter((v) => v.is_active);
  const cheapest = activeVariants.sort((a, b) => a.price - b.price)[0];
  const displayedVariantInStock = Boolean(cheapest && cheapest.stock_quantity > 0);
  const image =
    product.featured_image_url ||
    [...(product.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ||
    null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    badge: product.badge,
    shortDescription: product.short_description,
    color: product.color,
    rating: product.average_rating,
    reviewCount: product.review_count,
    categoryId: product.category_id,
    image,
    price: cheapest?.price ?? null,
    oldPrice: cheapest?.original_price ?? null,
    variantId: cheapest?.id ?? null,
    variantName: cheapest?.variant_name ?? null,
    variantColor: cheapest?.color ?? null,
    variantColorHex: cheapest?.color_hex ?? null,
    inStock: displayedVariantInStock,
    hasAnyStock: activeVariants.some((v) => v.stock_quantity > 0),
  };
}

export async function getProducts(filters = {}) {
  try {
    const supabase = createPublicClient();
    let query = supabase.from("products").select(LISTING_SELECT).eq("is_active", true).eq("show_in_shop", true);

    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.badgeContains) query = query.ilike("badge", `%${filters.badgeContains}%`);
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.or(`name.ilike.${term},description.ilike.${term},short_description.ilike.${term},color.ilike.${term},fabric.ilike.${term}`);
    }

    query = query.order("created_at", { ascending: false });
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      let products = data.map(withDisplayPrice);

      if (filters.minPrice != null) products = products.filter((p) => (p.price ?? 0) >= filters.minPrice);
      if (filters.maxPrice != null) products = products.filter((p) => (p.price ?? 0) <= filters.maxPrice);

      if (filters.sort === "price_asc") products.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      if (filters.sort === "price_desc") products.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      if (filters.sort === "rating") products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      return products;
    }
  } catch (err) {
    console.error("Fetch products error:", err);
  }

  return [];
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select(LISTING_SELECT)
      .eq("is_active", true)
      .eq("show_in_shop", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (data && data.length > 0) return data.map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch featured products error:", err);
  }

  return [];
}

export async function getRelatedProducts(categoryId, excludeId, limit = 4) {
  try {
    const supabase = createPublicClient();
    let data = null;

    if (categoryId) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .eq("show_in_shop", true)
        .eq("category_id", categoryId)
        .neq("id", excludeId)
        .limit(limit);
      data = res.data;
    }

    // No category, or nothing else in that category — widen to any other
    // real product instead of falling back to demo data.
    if (!data || data.length === 0) {
      const res = await supabase
        .from("products")
        .select(LISTING_SELECT)
        .eq("is_active", true)
        .eq("show_in_shop", true)
        .neq("id", excludeId)
        .order("created_at", { ascending: false })
        .limit(limit);
      data = res.data;
    }

    if (data && data.length > 0) return data.map(withDisplayPrice);
  } catch (err) {
    console.error("Fetch related products error:", err);
  }

  return [];
}

export async function getProductBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge,
        average_rating, review_count, short_description, description,
        color, fabric, fit_type, care_instructions, featured_image_url,
        product_images ( id, image_url, sort_order, variant_name, color ),
        product_variants ( id, variant_name, color, color_hex, price, original_price, stock_quantity, is_active ),
        product_faqs ( id, question, answer, display_order )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (product && product.is_active) {
      const [categoryResult, reviewsResult, userResult] = await Promise.all([
        product.category_id
          ? supabase.from("categories").select("name").eq("id", product.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("reviews")
          .select("id, rating, review_text, created_at, profiles ( full_name )")
          .eq("product_id", product.id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase.auth.getUser(),
      ]);

      const categoryName = categoryResult.data?.name || null;
      const reviews = reviewsResult.data;

      // A logged-in user's own review for this product (approved or still
      // pending) — used to show it back to them instead of a blank form.
      let myReview = null;
      const user = userResult.data?.user;
      if (user) {
        const { data } = await supabase
          .from("reviews")
          .select("id, rating, review_text, is_approved")
          .eq("product_id", product.id)
          .eq("user_id", user.id)
          .maybeSingle();
        myReview = data || null;
      }

      const images = (product.product_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
      if (images.length === 0 && product.featured_image_url) {
        images.push({ id: "featured", image_url: product.featured_image_url });
      }

      const faqs = (product.product_faqs || []).slice().sort((a, b) => a.display_order - b.display_order);
      const variants = (product.product_variants || [])
        .filter((v) => v.is_active)
        .sort((a, b) => a.price - b.price);

      // The signed-in user's own review is already shown separately via
      // `myReview` (as "Your Review"), so drop it here to avoid a duplicate.
      const otherReviews = (reviews || []).filter((r) => r.id !== myReview?.id);

      return {
        ...product,
        categoryName,
        images,
        faqs,
        variants,
        reviews: otherReviews,
        myReview,
      };
    }
  } catch (err) {
    console.error("Fetch product by slug error:", err);
  }

  return null;
}
