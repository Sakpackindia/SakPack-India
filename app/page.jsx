import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import CategoryCircles from "@/components/home/CategoryCircles";
import TriPanelBanner from "@/components/home/TriPanelBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowToChoose from "@/components/home/HowToChoose";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import WhyUs from "@/components/home/WhyUs";
import InstagramGallery from "@/components/home/InstagramGallery";
import PromoBanner from "@/components/home/PromoBanner";
import { getActiveCategories } from "@/actions/categories";
import { getFeaturedProducts } from "@/actions/products";
import { getSiteSettings } from "@/actions/settings";
import { getActiveTestimonials } from "@/actions/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakpack.in";

export const metadata = {
  title: "Sakpack India | Loved By 10,000+ Women | Soft Bras, Panties, Palazzos & Cord Sets",
  description:
    "Explore Sakpack India – Loved by 10,000+ women for everyday luxury. Shop ultra-soft bras, seamless panties, stylish palazzos, comfortable leggings, and luxury cord sets with free shipping & COD across India.",
  keywords: [
    "Sakpack",
    "Sakpack India",
    "women innerwear",
    "bra online India",
    "panties for women",
    "palazzo pants",
    "cotton leggings",
    "cord set women",
    "co-ord set",
    "loungewear women",
    "everyday fashion women",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Sakpack India | Loved By 10,000+ Women | Bras, Panties, Palazzos & Cord Sets",
    description:
      "Explore Sakpack India – Loved by 10,000+ women for everyday luxury. Shop ultra-soft bras, seamless panties, stylish palazzos, comfortable leggings, and luxury cord sets.",
    url: baseUrl,
    siteName: "Sakpack India",
    images: [{ url: `${baseUrl}/logo.png`, alt: "Sakpack India Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakpack India | Loved By 10,000+ Women | Bras, Panties, Palazzos & Cord Sets",
    description:
      "Explore Sakpack India – Loved by 10,000+ women for everyday luxury. Shop ultra-soft bras, seamless panties, stylish palazzos, comfortable leggings, and luxury cord sets.",
    images: [`${baseUrl}/logo.png`],
  },
};

export default async function HomePage() {
  const [categories, featuredProducts, settings, testimonials] =
    await Promise.all([
      getActiveCategories(),
      getFeaturedProducts(8),
      getSiteSettings(),
      getActiveTestimonials(),
    ]);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeFeaturedProducts = JSON.parse(JSON.stringify(featuredProducts));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));

  const setting = (key) => settings[key]?.value;
  const isOn = (key) => settings[key]?.value !== "false";
  const parseJson = (value, fallback) => {
    try {
      return JSON.parse(value ?? "");
    } catch {
      return fallback;
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sakpack India",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <SiteHeader />
      <main>
        {isOn("home_hero_enabled") && (() => {
          // Up to 5 slides — a slide only counts if its tagline is filled in;
          // its photo can still be left blank (falls back to the plain background).
          const heroSlides = [1, 2, 3, 4, 5]
            .map((n) => ({
              tagline: setting(`home_hero_tagline${n}`),
              image: setting(`home_hero_slide${n}_image`),
              mobileImage: setting(`home_hero_slide${n}_mobile_image`),
            }))
            .filter((s) => s.tagline?.trim());

          return (
            <Hero
              badgeText={setting("home_hero_badge_text")}
              buttonText={setting("home_hero_button_text")}
              taglines={heroSlides.map((s) => s.tagline)}
              images={heroSlides.map((s) => s.image)}
              mobileImages={heroSlides.map((s) => s.mobileImage)}
            />
          );
        })()}

        {isOn("home_marquee_enabled") && (
          <MarqueeStrip items={setting("home_marquee_items")} />
        )}

        {isOn("home_features_enabled") && (
          <FeatureStrip
            feature1Title={setting("home_feature1_title")}
            feature1Desc={setting("home_feature1_desc")}
            feature2Title={setting("home_feature2_title")}
            feature2Desc={setting("home_feature2_desc")}
            feature3Title={setting("home_feature3_title")}
            feature3Desc={setting("home_feature3_desc")}
            feature4Title={setting("home_feature4_title")}
            feature4Desc={setting("home_feature4_desc")}
          />
        )}

        {isOn("home_categories_enabled") && (
          <CategoryCircles categories={safeCategories} heading={setting("home_categories_heading")} />
        )}

        {isOn("home_tripanel_enabled") && (
          <TriPanelBanner
            panel1Label={setting("home_tripanel_panel1_label")}
            panel1Heading={setting("home_tripanel_panel1_heading")}
            panel1ButtonText={setting("home_tripanel_panel1_button_text")}
            panel2Label={setting("home_tripanel_panel2_label")}
            panel2Heading={setting("home_tripanel_panel2_heading")}
            panel2ButtonText={setting("home_tripanel_panel2_button_text")}
            panel3Label={setting("home_tripanel_panel3_label")}
            panel3Heading={setting("home_tripanel_panel3_heading")}
            panel3ButtonText={setting("home_tripanel_panel3_button_text")}
          />
        )}

        {isOn("home_bestsellers_enabled") && (
          <FeaturedProducts products={safeFeaturedProducts} heading={setting("home_bestsellers_heading")} />
        )}

        {isOn("home_choose_enabled") && (
          <HowToChoose
            subtitle={setting("home_choose_subtitle")}
            image={setting("home_choose_image")}
            option1Title={setting("home_choose_option1_title")}
            option1Desc={setting("home_choose_option1_desc")}
            option2Title={setting("home_choose_option2_title")}
            option2Desc={setting("home_choose_option2_desc")}
            option3Title={setting("home_choose_option3_title")}
            option3Desc={setting("home_choose_option3_desc")}
            unsureTitle={setting("home_choose_unsure_title")}
            unsureText={setting("home_choose_unsure_text")}
            unsureButton={setting("home_choose_unsure_button")}
          />
        )}

        {isOn("home_testimonials_enabled") && (
          <Testimonials
            testimonials={safeTestimonials}
            eyebrow={setting("home_testimonials_eyebrow")}
            heading={setting("home_testimonials_heading")}
            subtitle={setting("home_testimonials_subtitle")}
          />
        )}

        {isOn("home_whyus_enabled") && (
          <WhyUs
            eyebrow={setting("home_whyus_eyebrow")}
            heading={setting("home_whyus_heading")}
            stat1Value={setting("home_whyus_stat1_value")}
            stat1Title={setting("home_whyus_stat1_title")}
            stat1Desc={setting("home_whyus_stat1_desc")}
            stat2Value={setting("home_whyus_stat2_value")}
            stat2Title={setting("home_whyus_stat2_title")}
            stat2Desc={setting("home_whyus_stat2_desc")}
            stat3Value={setting("home_whyus_stat3_value")}
            stat3Title={setting("home_whyus_stat3_title")}
            stat3Desc={setting("home_whyus_stat3_desc")}
            point1Title={setting("home_whyus_point1_title")}
            point1Desc={setting("home_whyus_point1_desc")}
            point2Title={setting("home_whyus_point2_title")}
            point2Desc={setting("home_whyus_point2_desc")}
            point3Title={setting("home_whyus_point3_title")}
            point3Desc={setting("home_whyus_point3_desc")}
            point4Title={setting("home_whyus_point4_title")}
            point4Desc={setting("home_whyus_point4_desc")}
          />
        )}

        {isOn("home_instagram_enabled") && (
          <InstagramGallery
            heading={setting("home_instagram_heading")}
            photos={parseJson(setting("home_instagram_photos"), [])}
          />
        )}

        {isOn("home_faq_enabled") && (
          <FaqSection
            subtitle={setting("home_faq_subtitle")}
            image={setting("home_faq_image")}
            q1={setting("home_faq_q1")}
            a1={setting("home_faq_a1")}
            q2={setting("home_faq_q2")}
            a2={setting("home_faq_a2")}
            q3={setting("home_faq_q3")}
            a3={setting("home_faq_a3")}
            q4={setting("home_faq_q4")}
            a4={setting("home_faq_a4")}
          />
        )}

        {isOn("home_promo_enabled") && (
          <PromoBanner
            code={setting("home_promo_code")}
            discount={setting("home_promo_discount")}
            subtitle={setting("home_promo_subtitle")}
            image={setting("home_promo_image")}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
