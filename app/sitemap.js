import { getAllProducts } from "@/actions/products";
import { getActiveCategories } from "@/actions/categories";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakpack.in";

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/policies/shipping",
    "/policies/refund",
    "/policies/privacy",
    "/policies/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.6,
  }));

  try {
    const [products, categories] = await Promise.all([
      getAllProducts().catch(() => []),
      getActiveCategories().catch(() => []),
    ]);

    const categoryRoutes = (categories || []).map((c) => ({
      url: `${baseUrl}/shop?category=${c.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const productRoutes = (products || []).map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
