"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Default settings (fallback if table doesn't exist, and to backfill any
// keys that don't have a row in the DB yet).
const DEFAULT_SETTINGS = {
  brand_name: { value: "Sakpack India", category: "brand", description: "Brand name" },
  tagline: { value: "Style. Comfort. Confidence.", category: "brand", description: "Brand tagline" },
  email: { value: "sakpackindia@gmail.com", category: "contact", description: "Business email" },
  whatsapp_number: { value: "919582083441", category: "contact", description: "WhatsApp number (with country code, no spaces)" },
  whatsapp_display: { value: "+91 95820 83441", category: "contact", description: "WhatsApp display format" },
  address: { value: "2012, Sector 23A, Near NIMS Hospital, Faridabad, Haryana 121005", category: "contact", description: "Store address" },
  instagram_url: { value: "https://www.instagram.com/sakpackindia", category: "social", description: "Instagram profile URL" },
  facebook_url: { value: "https://www.facebook.com/people/Sakpack-India/61594175631081/", category: "social", description: "Facebook profile URL" },
  youtube_url: { value: "https://youtube.com/@sakpackindia", category: "social", description: "YouTube channel URL" },
  cod_enabled: { value: "true", category: "payment", description: "Allow Cash on Delivery at checkout" },
  online_payment_enabled: { value: "true", category: "payment", description: "Allow online payment (Razorpay) at checkout" },

  home_hero_badge_text: { value: "LOVED BY 10,000+ WOMEN", category: "home_hero", description: "Hero — badge text above the title" },
  home_hero_button_text: { value: "Shop Now", category: "home_hero", description: "Hero — button text" },
  home_hero_enabled: { value: "true", category: "home_hero", description: "Show the hero banner on the homepage" },

  home_hero_tagline1: { value: "Where comfort meets confidence.", category: "home_hero", description: "Hero — slide 1 tagline text" },
  home_hero_slide1_image: { value: "", category: "home_hero", description: "Hero — slide 1 background photo (optional; leave blank for the plain background)" },
  home_hero_slide1_mobile_image: { value: "", category: "home_hero", description: "Hero — slide 1 MOBILE photo, 4:5 portrait (optional; falls back to the slide's regular photo on mobile if left blank)" },
  home_hero_tagline2: { value: "Where comfort meets confidence.", category: "home_hero", description: "Hero — slide 2 tagline text" },
  home_hero_slide2_image: { value: "", category: "home_hero", description: "Hero — slide 2 background photo (optional; leave blank for the plain background)" },
  home_hero_slide2_mobile_image: { value: "", category: "home_hero", description: "Hero — slide 2 MOBILE photo, 4:5 portrait (optional; falls back to the slide's regular photo on mobile if left blank)" },
  home_hero_tagline3: { value: "Style that moves with you.", category: "home_hero", description: "Hero — slide 3 tagline text" },
  home_hero_slide3_image: { value: "", category: "home_hero", description: "Hero — slide 3 background photo (optional; leave blank for the plain background)" },
  home_hero_slide3_mobile_image: { value: "", category: "home_hero", description: "Hero — slide 3 MOBILE photo, 4:5 portrait (optional; falls back to the slide's regular photo on mobile if left blank)" },
  home_hero_tagline4: { value: "", category: "home_hero", description: "Hero — slide 4 tagline text (optional; leave blank to skip this slide)" },
  home_hero_slide4_image: { value: "", category: "home_hero", description: "Hero — slide 4 background photo (optional; leave blank for the plain background)" },
  home_hero_slide4_mobile_image: { value: "", category: "home_hero", description: "Hero — slide 4 MOBILE photo, 4:5 portrait (optional; falls back to the slide's regular photo on mobile if left blank)" },
  home_hero_tagline5: { value: "", category: "home_hero", description: "Hero — slide 5 tagline text (optional; leave blank to skip this slide)" },
  home_hero_slide5_image: { value: "", category: "home_hero", description: "Hero — slide 5 background photo (optional; leave blank for the plain background)" },
  home_hero_slide5_mobile_image: { value: "", category: "home_hero", description: "Hero — slide 5 MOBILE photo, 4:5 portrait (optional; falls back to the slide's regular photo on mobile if left blank)" },

  home_features_enabled: { value: "true", category: "home_sections", description: "Show the Feature Strip on the homepage" },
  home_feature1_title: { value: "Premium Quality", category: "home_sections", description: "Feature Strip — item 1 title" },
  home_feature1_desc: { value: "Handpicked Luxury Fabrics", category: "home_sections", description: "Feature Strip — item 1 description" },
  home_feature2_title: { value: "Soft & Breathable", category: "home_sections", description: "Feature Strip — item 2 title" },
  home_feature2_desc: { value: "Featherlight All-Day Ease", category: "home_sections", description: "Feature Strip — item 2 description" },
  home_feature3_title: { value: "Perfect Fit", category: "home_sections", description: "Feature Strip — item 3 title" },
  home_feature3_desc: { value: "Designed For Every Body", category: "home_sections", description: "Feature Strip — item 3 description" },
  home_feature4_title: { value: "Affordable Prices", category: "home_sections", description: "Feature Strip — item 4 title" },
  home_feature4_desc: { value: "Luxury Made Accessible", category: "home_sections", description: "Feature Strip — item 4 description" },

  home_categories_heading: { value: "Shop By Category", category: "home_sections", description: "Shop By Category — heading" },
  home_categories_enabled: { value: "true", category: "home_sections", description: "Show the Shop By Category section on the homepage" },

  home_tripanel_enabled: { value: "true", category: "home_sections", description: "Show the 3-panel banner on the homepage" },
  home_tripanel_panel1_label: { value: "New Arrivals", category: "home_sections", description: "3-Panel Banner — panel 1 label" },
  home_tripanel_panel1_heading: { value: "Fresh Styles\nJust For You", category: "home_sections", description: "3-Panel Banner — panel 1 heading (use Enter for line break)" },
  home_tripanel_panel1_button_text: { value: "Shop Now", category: "home_sections", description: "3-Panel Banner — panel 1 button text" },
  home_tripanel_panel2_label: { value: "Comfort Meets Style", category: "home_sections", description: "3-Panel Banner — panel 2 label" },
  home_tripanel_panel2_heading: { value: "Everyday Essentials\nFor Every You.", category: "home_sections", description: "3-Panel Banner — panel 2 heading (use Enter for line break)" },
  home_tripanel_panel2_button_text: { value: "Shop Now", category: "home_sections", description: "3-Panel Banner — panel 2 button text" },
  home_tripanel_panel3_label: { value: "Best Sellers", category: "home_sections", description: "3-Panel Banner — panel 3 label" },
  home_tripanel_panel3_heading: { value: "Loved By\nThousands", category: "home_sections", description: "3-Panel Banner — panel 3 heading (use Enter for line break)" },
  home_tripanel_panel3_button_text: { value: "Shop Now", category: "home_sections", description: "3-Panel Banner — panel 3 button text" },

  home_bestsellers_heading: { value: "Best Sellers", category: "home_sections", description: "Best Sellers (featured products) — heading" },
  home_bestsellers_enabled: { value: "true", category: "home_sections", description: "Show the Best Sellers section on the homepage" },

  home_whyus_eyebrow: { value: "Trusted By Thousands", category: "home_sections", description: "Why Choose Us — eyebrow badge text" },
  home_whyus_heading: { value: "Why Choose Sakpack India?", category: "home_sections", description: "Why Choose Us — heading" },
  home_whyus_enabled: { value: "true", category: "home_sections", description: "Show the Why Choose Us section on the homepage" },
  home_whyus_stat1_value: { value: "10K+", category: "home_sections", description: "Why Choose Us — stat 1 value" },
  home_whyus_stat1_title: { value: "Happy Customers", category: "home_sections", description: "Why Choose Us — stat 1 title" },
  home_whyus_stat1_desc: { value: "Empowered & delighted women nationwide", category: "home_sections", description: "Why Choose Us — stat 1 description" },
  home_whyus_stat2_value: { value: "5+", category: "home_sections", description: "Why Choose Us — stat 2 value" },
  home_whyus_stat2_title: { value: "Product Categories", category: "home_sections", description: "Why Choose Us — stat 2 title" },
  home_whyus_stat2_desc: { value: "Curated collections for everyday luxury", category: "home_sections", description: "Why Choose Us — stat 2 description" },
  home_whyus_stat3_value: { value: "100%", category: "home_sections", description: "Why Choose Us — stat 3 value" },
  home_whyus_stat3_title: { value: "Quality Checked", category: "home_sections", description: "Why Choose Us — stat 3 title" },
  home_whyus_stat3_desc: { value: "Rigorous perfection in every single stitch", category: "home_sections", description: "Why Choose Us — stat 3 description" },
  home_whyus_point1_title: { value: "Premium Quality", category: "home_sections", description: "Why Choose Us — point 1 title" },
  home_whyus_point1_desc: { value: "Handpicked luxury fabrics & flawless stitching.", category: "home_sections", description: "Why Choose Us — point 1 description" },
  home_whyus_point2_title: { value: "Soft & Breathable", category: "home_sections", description: "Why Choose Us — point 2 title" },
  home_whyus_point2_desc: { value: "Featherlight comfort designed for all-day ease.", category: "home_sections", description: "Why Choose Us — point 2 description" },
  home_whyus_point3_title: { value: "Perfect Fit", category: "home_sections", description: "Why Choose Us — point 3 title" },
  home_whyus_point3_desc: { value: "Tailored to complement your natural silhouette.", category: "home_sections", description: "Why Choose Us — point 3 description" },
  home_whyus_point4_title: { value: "Affordable Prices", category: "home_sections", description: "Why Choose Us — point 4 title" },
  home_whyus_point4_desc: { value: "Uncompromised luxury at accessible prices.", category: "home_sections", description: "Why Choose Us — point 4 description" },

  home_instagram_heading: { value: "Follow Us On Instagram", category: "home_sections", description: "Instagram Gallery — heading" },
  home_instagram_enabled: { value: "true", category: "home_sections", description: "Show the Instagram Gallery section on the homepage" },
  home_instagram_photos: {
    value: JSON.stringify([
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514123/sakpack/instagram/bra-black-front.png", link: "" },
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514127/sakpack/instagram/bra-white-front.png", link: "" },
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514131/sakpack/instagram/bra-nude-front.jpg", link: "" },
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514134/sakpack/instagram/bra-black-back.png", link: "" },
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514138/sakpack/instagram/bra-white-back.png", link: "" },
      { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514139/sakpack/instagram/bra-nude-back.jpg", link: "" },
    ]),
    category: "home_sections",
    description: "Instagram Gallery — photos, each with an optional link to that specific post (falls back to the Instagram profile if left blank)",
  },

  home_promo_enabled: { value: "true", category: "home_sections", description: "Show the Promo Banner on the homepage" },
  home_promo_code: { value: "SAKPACK30", category: "home_sections", description: "Promo Banner — coupon code shown" },
  home_promo_discount: { value: "30% OFF", category: "home_sections", description: "Promo Banner — discount headline (e.g. 30% OFF)" },
  home_promo_subtitle: { value: "Special Deals Just For You! Upgrade your wardrobe today.", category: "home_sections", description: "Promo Banner — subtitle" },
  home_promo_image: { value: "/hero-model.jpg", category: "home_sections", description: "Promo Banner — model photo (upload a square, 1:1 image for the best crop)" },

  home_choose_subtitle: {
    value: "Finding the right fit matters. This guide helps you choose the style that's really you.",
    category: "home_sections",
    description: "Find Your Perfect Fit — subtitle",
  },
  home_choose_image: { value: "/bra-nude-front.jpeg", category: "home_sections", description: "Find Your Perfect Fit — image" },
  home_choose_enabled: { value: "true", category: "home_sections", description: "Show the Find Your Perfect Fit section on the homepage" },

  home_choose_option1_title: { value: "For Every Day", category: "home_sections", description: "Find Your Perfect Fit — option 1 title" },
  home_choose_option1_desc: {
    value: "Soft, breathable pieces you can wear from morning to evening. Easy to wear and love.",
    category: "home_sections",
    description: "Find Your Perfect Fit — option 1 description",
  },
  home_choose_option2_title: { value: "For Lounging & Sleep", category: "home_sections", description: "Find Your Perfect Fit — option 2 title" },
  home_choose_option2_desc: {
    value: "Relaxed, cozy fits made for comfort at home — soft fabrics that feel like a hug.",
    category: "home_sections",
    description: "Find Your Perfect Fit — option 2 description",
  },
  home_choose_option3_title: { value: "Universal Fit", category: "home_sections", description: "Find Your Perfect Fit — option 3 title" },
  home_choose_option3_desc: {
    value: "Versatile styles that work for any day, any mood, and suit almost everyone.",
    category: "home_sections",
    description: "Find Your Perfect Fit — option 3 description",
  },

  home_choose_unsure_title: { value: "Still Unsure?", category: "home_sections", description: "Find Your Perfect Fit — consultation card heading" },
  home_choose_unsure_text: {
    value: "Just place your order, try it on, and see for yourself why it's worth it.",
    category: "home_sections",
    description: "Find Your Perfect Fit — consultation card text",
  },
  home_choose_unsure_button: { value: "Order Now", category: "home_sections", description: "Find Your Perfect Fit — consultation card button text" },

  home_testimonials_eyebrow: { value: "Real Customer Stories", category: "home_sections", description: "What Our Customers Say — eyebrow badge text" },
  home_testimonials_heading: { value: "What Our Customers Say", category: "home_sections", description: "What Our Customers Say — heading" },
  home_testimonials_subtitle: {
    value: "Loved by thousands of women across India for unmatched everyday comfort.",
    category: "home_sections",
    description: "What Our Customers Say — subtitle",
  },
  home_testimonials_enabled: { value: "true", category: "home_sections", description: "Show the Testimonials section on the homepage" },

  home_faq_subtitle: {
    value: "Everything you need to know before you order.",
    category: "home_sections",
    description: "Questions You Might Have — subtitle",
  },
  home_faq_image: { value: "/bra-nude-back.jpeg", category: "home_sections", description: "Questions You Might Have — image" },
  home_faq_enabled: { value: "true", category: "home_sections", description: "Show the FAQ section on the homepage" },

  home_faq_q1: { value: "How do I pick the right size?", category: "home_sections", description: "FAQ 1 — question" },
  home_faq_a1: {
    value: "Each product page has a size chart (S, M, L, XL). If you're between sizes, message us on WhatsApp with your measurements and we'll help you choose.",
    category: "home_sections",
    description: "FAQ 1 — answer",
  },
  home_faq_q2: { value: "How should I wash and care for these fabrics?", category: "home_sections", description: "FAQ 2 — question" },
  home_faq_a2: {
    value: "Gentle machine wash or hand wash in cold water is best for most of our fabrics. Avoid harsh bleach and always check the care label on the product.",
    category: "home_sections",
    description: "FAQ 2 — answer",
  },
  home_faq_q3: { value: "Do you ship across India?", category: "home_sections", description: "FAQ 3 — question" },
  home_faq_a3: {
    value: "Yes, we ship all over India. We pack your order in 1 to 2 days. Delivery usually takes 3 to 6 days depending on your city.",
    category: "home_sections",
    description: "FAQ 3 — answer",
  },
  home_faq_q4: { value: "Can I return or exchange my order?", category: "home_sections", description: "FAQ 4 — question" },
  home_faq_a4: {
    value: "Yes — unused items in original condition can be returned or exchanged within 7 days of delivery. If your item arrives damaged, we'll replace it for free. Just message us on WhatsApp with a photo.",
    category: "home_sections",
    description: "FAQ 4 — answer",
  },

  home_marquee_items: {
    value:
      "*Premium Quality Fabrics\nHandpicked & Soft\nPerfect Everyday Fit\n*Free Delivery\nCash on Delivery Available\n*Easy 7-Day Returns",
    category: "home_sections",
    description: "Marquee Strip — one item per line, start a line with * to highlight it in gold",
  },
  home_marquee_enabled: { value: "true", category: "home_sections", description: "Show the Marquee Strip on the homepage" },

  // ─── About Page ──────────────────────────────────────────────────────────
  about_hero_badge_text: { value: "About Sakpack India", category: "about", description: "Hero — eyebrow badge text" },
  about_hero_title_line1: { value: "Style, Comfort,", category: "about", description: "Hero — title line 1" },
  about_hero_title_highlight: { value: "Made Accessible", category: "about", description: "Hero — title line 2 (highlighted in gold)" },
  about_hero_paragraph: {
    value: "We believe everyone deserves everyday fashion that feels as good as it looks, without paying premium prices — quality innerwear and loungewear with real comfort, fit, and durability.",
    category: "about",
    description: "Hero — paragraph",
  },
  about_hero_button_text: { value: "Shop Our Collection", category: "about", description: "Hero — primary button text" },
  about_hero_image: { value: "/bra-black-front.png", category: "about", description: "Hero — image" },
  about_hero_badge_year: { value: "EST. 2026", category: "about", description: "Hero — floating badge, year line" },
  about_hero_badge_caption: { value: "Premium Quality Guarantee", category: "about", description: "Hero — floating badge, caption line" },
  about_hero_enabled: { value: "true", category: "about", description: "Show the Hero section on the About page" },

  about_story_eyebrow: { value: "Our Story", category: "about", description: "Story — eyebrow text" },
  about_story_title_line1: { value: "Comfort First.", category: "about", description: "Story — title line 1" },
  about_story_title_highlight: { value: "Style Always.", category: "about", description: "Story — title line 2 (highlighted in gold)" },
  about_story_paragraph: {
    value: "Whether you're looking for everyday essentials or something for a special occasion, our collection is thoughtfully put together to suit every body, style, and budget. We combine handpicked fabrics with careful stitching to deliver pieces people love wearing every day.",
    category: "about",
    description: "Story — paragraph",
  },
  about_story_callout_title: { value: "Proudly Based In Faridabad, Haryana", category: "about", description: "Story — location callout heading" },
  about_story_callout_text: {
    value: "Sakpack India is proudly based in Faridabad, Haryana, serving customers across India with secure packaging, reliable shipping, and dedicated customer support.",
    category: "about",
    description: "Story — location callout text",
  },
  about_story_enabled: { value: "true", category: "about", description: "Show the Story section on the About page" },

  about_commitments_eyebrow: { value: "Quality & Craft", category: "about", description: "Commitments — eyebrow text" },
  about_commitments_heading: { value: "Our Commitment To You", category: "about", description: "Commitments — heading" },
  about_commitments_enabled: { value: "true", category: "about", description: "Show the Commitments section on the About page" },
  about_commitment1_title: { value: "Commitment to Quality", category: "about", description: "Commitment 1 — title" },
  about_commitment1_text: {
    value: "We use handpicked, soft fabrics and careful stitching for safe, consistent quality across every piece.",
    category: "about",
    description: "Commitment 1 — text",
  },
  about_commitment2_title: { value: "Built to Last", category: "about", description: "Commitment 2 — title" },
  about_commitment2_text: {
    value: "Soft, breathable materials chosen for everyday comfort — pieces that hold their shape wash after wash.",
    category: "about",
    description: "Commitment 2 — text",
  },
  about_commitment3_title: { value: "Personally Tested", category: "about", description: "Commitment 3 — title" },
  about_commitment3_text: {
    value: "Before launching any style, we personally check fit, fabric, and finish. If we wouldn't wear it, we won't sell it.",
    category: "about",
    description: "Commitment 3 — text",
  },
  about_commitment4_title: { value: "Affordable Everyday Style", category: "about", description: "Commitment 4 — title" },
  about_commitment4_text: {
    value: "Good style shouldn't come with a big price tag — quality collections that suit every budget.",
    category: "about",
    description: "Commitment 4 — text",
  },
  about_commitment5_title: { value: "Designed for Real Life", category: "about", description: "Commitment 5 — title" },
  about_commitment5_text: {
    value: "Comfortable enough for home, put-together enough for everywhere else. Fashion for how you actually live.",
    category: "about",
    description: "Commitment 5 — text",
  },

  about_stats_eyebrow: { value: "Sakpack By Numbers", category: "about", description: "Stats — eyebrow text" },
  about_stats_enabled: { value: "true", category: "about", description: "Show the Stats section on the About page" },
  about_stat1_value: { value: "10k+", category: "about", description: "Stat 1 — value" },
  about_stat1_label: { value: "Happy Customers", category: "about", description: "Stat 1 — label" },
  about_stat2_value: { value: "5+", category: "about", description: "Stat 2 — value" },
  about_stat2_label: { value: "Product Categories", category: "about", description: "Stat 2 — label" },
  about_stat3_value: { value: "100%", category: "about", description: "Stat 3 — value" },
  about_stat3_label: { value: "Quality Checked", category: "about", description: "Stat 3 — label" },

  about_advantages_eyebrow: { value: "Our Advantages", category: "about", description: "Advantages — eyebrow text" },
  about_advantages_title_line1: { value: "Why Choose", category: "about", description: "Advantages — title line 1" },
  about_advantages_title_highlight: { value: "Sakpack India?", category: "about", description: "Advantages — title line 2 (highlighted in gold)" },
  about_advantages_paragraph: {
    value: "We combine handpicked breathable fabrics with precision stitching right here in India, ensuring every piece delivers long-lasting comfort, flawless fit, and timeless style for real everyday life.",
    category: "about",
    description: "Advantages — paragraph",
  },
  about_advantages_tag_title: { value: "100% Quality & Satisfaction", category: "about", description: "Advantages — highlight tag title" },
  about_advantages_tag_subtitle: { value: "Tested, approved & loved nationwide.", category: "about", description: "Advantages — highlight tag subtitle" },
  about_advantages_enabled: { value: "true", category: "about", description: "Show the Advantages section on the About page" },
  about_advantage1: { value: "Handpicked, soft fabrics", category: "about", description: "Advantage item 1" },
  about_advantage2: { value: "Trendy, everyday designs", category: "about", description: "Advantage item 2" },
  about_advantage3: { value: "Quality-checked before shipping", category: "about", description: "Advantage item 3" },
  about_advantage4: { value: "Personally tested before launch", category: "about", description: "Advantage item 4" },
  about_advantage5: { value: "Affordable, honest pricing", category: "about", description: "Advantage item 5" },
  about_advantage6: { value: "Sizes for every body", category: "about", description: "Advantage item 6" },
  about_advantage7: { value: "Fast pan-India shipping", category: "about", description: "Advantage item 7" },
  about_advantage8: { value: "Trusted by 10,000+ women", category: "about", description: "Advantage item 8" },

  about_vision_badge: { value: "VISION 01", category: "about", description: "Vision card — badge text" },
  about_vision_title: { value: "Our Vision", category: "about", description: "Vision card — title" },
  about_vision_text: {
    value: "To make comfortable, well-made everyday fashion accessible to everyone by combining quality, affordability, and exceptional customer satisfaction.",
    category: "about",
    description: "Vision card — text",
  },
  about_vision_footer: { value: "Sakpack India Purpose", category: "about", description: "Vision card — footer label" },
  about_inclusivity_badge: { value: "INCLUSIVITY 02", category: "about", description: "Inclusivity card — badge text" },
  about_inclusivity_title: { value: "Made For Every Body", category: "about", description: "Inclusivity card — title" },
  about_inclusivity_text: {
    value: "We're committed to designing for real bodies, with sizes and fits that work for you — because you deserve clothing that feels as good as it looks.",
    category: "about",
    description: "Inclusivity card — text",
  },
  about_inclusivity_footer: { value: "Perfect Fit Promise", category: "about", description: "Inclusivity card — footer label" },
  about_vision_enabled: { value: "true", category: "about", description: "Show the Vision & Inclusivity cards on the About page" },

  about_promise_eyebrow: { value: "Our Promise To You", category: "about", description: "Promise banner — eyebrow text" },
  about_promise_quote: {
    value: "Every piece reflects our passion for comfort, affordability, and helping you feel confident every day.",
    category: "about",
    description: "Promise banner — quote",
  },
  about_promise_tagline: { value: "Style • Comfort • Confidence", category: "about", description: "Promise banner — tagline" },
  about_promise_button_text: { value: "Explore Shop Collection", category: "about", description: "Promise banner — button text" },
  about_promise_enabled: { value: "true", category: "about", description: "Show the Promise banner on the About page" },
};

const getSiteSettingsCached = unstable_cache(
  async () => {
    try {
      // Uses the service-role client (not createPublicClient) because the
      // "site_settings public read" RLS policy isn't reliably present on
      // every environment — this table has no sensitive data, so bypassing
      // RLS for this read-only, unstable_cache'd fetch is safe.
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value, category, description")
        .order("category", { ascending: true });

      if (error) {
        console.warn("Site settings table not found or error reading, using defaults:", error.message);
        return DEFAULT_SETTINGS;
      }

      const settings = {};
      (data || []).forEach((item) => {
        settings[item.key] = {
          value: item.value,
          category: item.category,
          description: item.description,
        };
      });

      // Backfill any keys that don't have a DB row yet (e.g. newly added
      // settings on an existing install) so they still show up with a
      // sensible default until an admin explicitly saves them.
      Object.entries(DEFAULT_SETTINGS).forEach(([key, meta]) => {
        if (!settings[key]) settings[key] = meta;
      });

      return settings;
    } catch (err) {
      console.error("Error fetching site settings:", err?.message || err);
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { revalidate: 120, tags: ["site-settings"] }
);

export async function getSiteSettings() {
  return getSiteSettingsCached();
}

export async function isCodEnabled() {
  const settings = await getSiteSettings();
  return settings.cod_enabled?.value !== "false";
}

export async function isOnlinePaymentEnabled() {
  const settings = await getSiteSettings();
  return settings.online_payment_enabled?.value !== "false";
}

export async function updateSiteSetting(key, value) {
  try {
    const supabase = createAdminClient();
    const meta = DEFAULT_SETTINGS[key];
    // Image uploaders call onChange(null) when a photo is removed — normalize
    // that (and undefined) to "" so it never hits the DB's NOT NULL column.
    const payload = { key, value: value ?? "", updated_at: new Date().toISOString() };
    if (meta) {
      payload.category = meta.category;
      payload.description = meta.description;
    }

    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });

    if (error) throw error;
    revalidateTag("site-settings");
    return { success: true };
  } catch (err) {
    console.error("Update site setting error:", err);
    return { success: false, error: err.message };
  }
}
