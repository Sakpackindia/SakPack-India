import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "./_components/ProductGallery";
import ProductPurchasePanel from "./_components/ProductPurchasePanel";
import ProductInfo from "./_components/ProductInfo";
import ProductDetailCards from "./_components/ProductDetailCards";
import { ProductVariantProvider } from "./_components/ProductVariantContext";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import Reveal from "@/components/Reveal";

// Dedupes the fetch: generateMetadata and the page component both need this
// product, and without caching each would trigger its own DB round trip.
const getCachedProduct = cache(getProductBySlug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakpack.in";
  const title = product.seo_title || product.name;
  const description =
    product.seo_description || product.short_description || product.description || `Buy ${product.name} online from Sakpack India. Premium handcrafted quality with express shipping across India.`;
  const image = product.featured_image_url || `${baseUrl}/logo.png`;

  return {
    title: `${title} | Sakpack India`,
    description,
    keywords: [
      product.name,
      product.categoryName || "Women's Wear",
      "Sakpack",
      "Sakpack India",
      "women innerwear",
      "buy online India",
    ],
    alternates: {
      canonical: `${baseUrl}/shop/${slug}`,
    },
    openGraph: {
      title: `${title} | Sakpack India`,
      description,
      url: `${baseUrl}/shop/${slug}`,
      siteName: "Sakpack India",
      images: [
        {
          url: image,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Sakpack India`,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  const details = [
    { label: "Fabric", value: product.fabric, icon: "shirt" },
    { label: "Fit", value: product.fit_type, icon: "ruler" },
    { label: "Care Instructions", value: product.care_instructions, icon: "droplets" },
  ].filter((n) => n.value);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProduct = JSON.parse(JSON.stringify(product));
  const safeRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakpack.in";
  const cheapestVariant = safeProduct.variants?.[0];
  const price = cheapestVariant?.price || 0;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: safeProduct.name,
    image: safeProduct.featured_image_url ? [safeProduct.featured_image_url] : [],
    description: safeProduct.description || safeProduct.short_description || safeProduct.name,
    sku: safeProduct.id,
    brand: {
      "@type": "Brand",
      name: "Sakpack India",
    },
    category: safeProduct.categoryName || "Women's Wear",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/shop/${slug}`,
      priceCurrency: "INR",
      price: price,
      priceValidUntil: "2028-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Sakpack India",
      },
    },
    ...(safeProduct.review_count > 0 && safeProduct.average_rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: safeProduct.average_rating,
            reviewCount: safeProduct.review_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <SiteHeader />

      <main className="relative min-h-screen bg-ivory text-ink overflow-hidden pb-28 sm:pb-24 pt-2 sm:pt-4">
        {/* Ambient glowing backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-gold-400/10 blur-[130px]" />
          <div className="absolute -right-24 top-96 h-[420px] w-[420px] rounded-full bg-ink/5 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-wrap px-4 sm:px-6 md:px-12 relative z-10">

          {/* Breadcrumbs Navigation */}
          <div className="mb-3 sm:mb-5 flex flex-wrap items-center gap-2 text-base font-bold uppercase tracking-wider text-ink/50">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-gold-500/70" />
            <Link href="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
            {product.categoryName && (
              <>
                <ChevronRight className="h-3 w-3 text-gold-500/70" />
                <Link href={`/shop?category=${product.category_id}`} className="hover:text-gold-600 transition-colors">
                  {product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 text-gold-500/70" />
            <span className="text-gold-700 font-extrabold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
            <ProductVariantProvider variants={safeProduct.variants}>

              {/* Gallery Panel — sticks in place while purchase details scroll on desktop */}
              <Reveal className="lg:sticky lg:top-[90px] lg:self-start">
                <ProductGallery images={safeProduct.images} name={safeProduct.name} featuredImage={safeProduct.featured_image_url} />
              </Reveal>

              {/* Purchase Options */}
              <div className="flex flex-col">
                <ProductInfo
                  color={product.color}
                  name={product.name}
                  reviewCount={product.review_count}
                  averageRating={product.average_rating}
                  description={product.description}
                />

                <div className="mt-8 border-t border-gold-400/20 pt-8">
                  <ProductPurchasePanel product={safeProduct} variants={safeProduct.variants} />
                </div>

                <ProductDetailCards details={details} />
              </div>
            </ProductVariantProvider>
          </div>



          {/* Symmetrical Grid: FAQs on left (if available), Reviews on right */}
          <div className="mt-16 sm:mt-24 border-t border-gold-400/20 pt-12 sm:pt-16">
            {product.faqs && product.faqs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
                {/* Left Column: FAQs */}
                <Reveal>
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-3.5 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700">
                      Need to Know
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mt-3 mb-6">
                      Common Questions
                    </h2>
                    <div className="space-y-4">
                      {product.faqs.map((faq) => (
                        <details key={faq.id} className="group relative overflow-hidden rounded-2xl border border-gold-400/30 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-gold-400">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base sm:text-lg font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-gold-600">
                            {faq.question}
                            <ChevronDown className="h-4.5 w-4.5 shrink-0 text-gold-600 transition-transform duration-300 group-open:rotate-180" />
                          </summary>
                          <p className="px-5 pb-5 text-base sm:text-lg leading-relaxed text-ink/75 font-medium border-t border-gold-400/15 pt-4 animate-fadeUp">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Right Column: Reviews */}
                <Reveal delay={100} className="space-y-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-3.5 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700">
                    Customer Love
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mt-3 mb-6">
                    Ratings &amp; Reviews
                  </h2>
                  <ReviewForm productId={product.id} existingReview={safeProduct.myReview} />
                  <ReviewsList reviews={safeProduct.reviews} hasOwnReview={!!safeProduct.myReview} />
                </Reveal>
              </div>
            ) : (
              /* Full Width Reviews Layout when Product has no FAQs */
              <Reveal className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700">
                    Customer Love
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mt-3 mb-6">
                    Ratings &amp; Reviews
                  </h2>
                </div>
                <ReviewForm productId={product.id} existingReview={safeProduct.myReview} />
                <ReviewsList reviews={safeProduct.reviews} hasOwnReview={!!safeProduct.myReview} />
              </Reveal>
            )}
          </div>

          {/* Related Products */}
          {safeRelatedProducts.length > 0 && (
            <Reveal className="mt-16 sm:mt-24 border-t border-gold-400/20 pt-12 sm:pt-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-3.5 py-1 text-base font-black uppercase tracking-[0.25em] text-gold-700">
                Complementary Selections
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mt-3 mb-10">
                You Might Also Like
              </h2>
              <ProductGrid products={safeRelatedProducts} />
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
