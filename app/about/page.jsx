import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HangerGlyph from "@/components/HangerGlyph";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getFeaturedProducts } from "@/actions/products";
import { getActiveTestimonials } from "@/actions/site";
import { getSiteSettings } from "@/actions/settings";
import { whatsappLink } from "@/lib/constants";
import {
  Leaf,
  Users,
  Layers,
  Sparkles,
  Quote,
  Compass,
  Award,
  ShieldCheck,
  Heart,
  MapPin,
  Check,
  ArrowRight,
} from "lucide-react";

export const metadata = { title: "About Us - Sakpack India" };

const COMMITMENT_ICONS = [Award, Leaf, ShieldCheck, Sparkles, Compass];

export default async function AboutPage() {
  const [featuredProducts, testimonials, settings] = await Promise.all([
    getFeaturedProducts(4),
    getActiveTestimonials(),
    getSiteSettings(),
  ]);
  const storyImage = featuredProducts.find((p) => p.image)?.image || "/bra-black-triview.png";
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));

  const setting = (key) => settings[key]?.value ?? "";
  const isOn = (key) => settings[key]?.value !== "false";

  const STATS = [
    { icon: Users, value: setting("about_stat1_value"), label: setting("about_stat1_label") },
    { icon: Layers, value: setting("about_stat2_value"), label: setting("about_stat2_label") },
    { icon: ShieldCheck, value: setting("about_stat3_value"), label: setting("about_stat3_label") },
  ];

  const COMMITMENTS = [1, 2, 3, 4, 5].map((n, i) => ({
    icon: COMMITMENT_ICONS[i],
    title: setting(`about_commitment${n}_title`),
    text: setting(`about_commitment${n}_text`),
  }));

  const ADVANTAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => setting(`about_advantage${n}`));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory text-ink overflow-hidden">

        {/* Hero Section — Split Layout */}
        {isOn("about_hero_enabled") && (
          <section className="relative overflow-hidden bg-[#fcf9f2] py-10 sm:py-20">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -left-24 top-0 h-[500px] w-[500px] rounded-full bg-gold-400/15 blur-[130px]" />
              <div className="absolute -right-24 bottom-0 h-[500px] w-[500px] rounded-full bg-ink/10 blur-[130px]" />
            </div>

            <div className="relative mx-auto grid max-w-wrap grid-cols-1 items-center gap-8 sm:gap-12 px-3 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16">
              <Reveal className="order-2 lg:order-1 text-center lg:text-left">
                {/* Title with side golden accent lines */}
                <div className="mb-3.5 inline-flex items-center gap-2 sm:gap-4 justify-center lg:justify-start">
                  <span className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/95 px-4 py-1.5 text-sm sm:text-sm font-extrabold uppercase tracking-[0.18em] text-ink shadow-sm">
                    <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
                    {setting("about_hero_badge_text")}
                  </span>
                  <span className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-ink">
                  {setting("about_hero_title_line1")}{" "}
                  <span className="text-gold-600 font-black block sm:inline">
                    {setting("about_hero_title_highlight")}
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ink/80 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
                  {setting("about_hero_paragraph")}
                </p>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <Link
                    href="/shop"
                    className="btn-gold group inline-flex items-center gap-2 rounded-full px-7 sm:px-8 py-3.5 text-sm sm:text-sm font-extrabold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]"
                  >
                    {setting("about_hero_button_text")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={whatsappLink("Hi Sakpack India, I would love to explore your collection.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50/90 px-7 sm:px-8 py-3.5 text-sm sm:text-sm font-extrabold uppercase tracking-widest text-emerald-800 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:shadow-lg"
                  >
                    Chat on WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>

              {/* Right Side Image Frame with Gold Border */}
              <Reveal delay={100} className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-full max-w-xs sm:max-w-md">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-gold-400/40 bg-white p-1 sm:p-1.5 shadow-2xl">
                    <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-[2.2rem]">
                      <Image
                        src={setting("about_hero_image") || "/bra-black-front.png"}
                        alt="Sakpack India"
                        fill
                        sizes="(max-width: 1024px) 90vw, 40vw"
                        className="object-cover object-top transition-transform duration-700 hover:scale-105"
                        priority
                      />
                    </div>
                  </div>

                  {/* Floating Gold Pill Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-bottom-6 sm:-left-6 flex items-center gap-2.5 sm:gap-3 rounded-full border border-gold-400/50 bg-ink px-4 py-2 sm:px-5 sm:py-3 shadow-2xl text-ivory whitespace-nowrap">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#caa14b] text-ink font-bold shadow-md">
                      <Award className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="font-display text-sm sm:text-sm font-bold uppercase tracking-widest text-gold-300">
                        {setting("about_hero_badge_year")}
                      </p>
                      <p className="text-xs sm:text-xs font-semibold text-ivory/80 uppercase tracking-wider">
                        {setting("about_hero_badge_caption")}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Story Section */}
        {isOn("about_story_enabled") && (
          <section className="relative py-12 sm:py-24 border-y border-gold-400/20 bg-white">
            <div className="mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                {/* Image side with Gold Arch Frame */}
                <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center">
                  <Reveal className="relative group w-full max-w-[260px] sm:max-w-[340px] aspect-[4/5] rounded-[130px] sm:rounded-[170px] p-2 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 shadow-2xl">
                    <div className="relative h-full w-full overflow-hidden rounded-[120px] sm:rounded-[160px] bg-ivory">
                      {storyImage ? (
                        <Image
                          src={storyImage}
                          alt="Sakpack India Story"
                          fill
                          sizes="(max-width: 1024px) 80vw, 30vw"
                          className="object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <HangerGlyph className="h-1/2 w-auto text-ink/15 animate-floatSlow" />
                        </div>
                      )}
                    </div>
                    {/* Decorative Frame */}
                    <div className="absolute inset-3 rounded-[110px] sm:rounded-[150px] border border-white/40 pointer-events-none z-20" />
                  </Reveal>
                </div>

                {/* Text side */}
                <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                  <Reveal delay={100}>
                    {/* Title with side golden accent lines */}
                    <div className="mb-3 inline-flex items-center gap-2 sm:gap-4 justify-center lg:justify-start">
                      <span className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                      <span className="font-display text-sm sm:text-sm font-bold uppercase tracking-[0.2em] text-gold-600">
                        {setting("about_story_eyebrow")}
                      </span>
                      <span className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink leading-tight">
                      {setting("about_story_title_line1")} <br />
                      <span className="text-gold-600 font-black">{setting("about_story_title_highlight")}</span>
                    </h2>

                    <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink/80 leading-relaxed font-medium">
                      {setting("about_story_paragraph")}
                    </p>

                    {/* Location Callout */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fcf9f2] border border-gold-400/35 shadow-md backdrop-blur-sm">
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#caa14b] text-ink font-bold shadow-md">
                        <MapPin className="w-5 h-5 text-ink" strokeWidth={2.2} />
                      </div>
                      <div>
                        <h4 className="font-display text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-ink">
                          {setting("about_story_callout_title")}
                        </h4>
                        <p className="mt-1 text-sm sm:text-sm text-ink/80 leading-relaxed font-medium">
                          {setting("about_story_callout_text")}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Commitment to Quality Cards */}
        {isOn("about_commitments_enabled") && (
          <section className="py-12 sm:py-24 relative bg-[#fcf9f2] overflow-hidden">
            {/* Background Ambient Radial Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.12)_0%,transparent_70%)]" />

            <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
              <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-18">
                <div className="flex items-center justify-center gap-2 sm:gap-6 mb-2.5">
                  <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                  <span className="font-display text-sm sm:text-sm font-bold uppercase tracking-[0.2em] text-gold-600">
                    {setting("about_commitments_eyebrow")}
                  </span>
                  <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
                  {setting("about_commitments_heading")}
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {COMMITMENTS.map((c, i) => (
                  <Reveal key={c.title} delay={i * 60} className={i === COMMITMENTS.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}>
                    <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/35 bg-gradient-to-b from-white via-[#fffdfa] to-[#f8f3ea]/60 p-5 sm:p-8 transition-all duration-500 hover:border-gold-400 hover:-translate-y-2 hover:shadow-[0_20px_45px_-12px_rgba(202,161,75,0.35)] flex flex-col justify-between shadow-md backdrop-blur-sm">
                      <div>
                        {/* Top Row: Metallic Icon + Number Badge */}
                        <div className="mb-4 sm:mb-6 flex items-center justify-between">
                          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#caa14b] text-ink font-bold shadow-md transition-transform duration-500 group-hover:scale-110">
                            <c.icon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-ink" strokeWidth={2.2} />
                          </div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/15 text-sm font-bold text-gold-700">
                            0{i + 1}
                          </span>
                        </div>

                        <h3 className="font-display text-lg sm:text-xl text-ink font-extrabold uppercase tracking-wide mb-2 sm:mb-3 group-hover:text-gold-600 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed text-ink/80 font-medium">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Showcase */}
        <section className="relative overflow-hidden bg-[#fcf9f2] py-12 sm:py-24 border-b border-gold-400/20">
          {/* Ambient Background Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.12)_0%,transparent_70%)]" />

          <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
            <Reveal className="mb-8 sm:mb-16 text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-6">
                <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                <span className="font-display text-sm sm:text-sm font-bold uppercase tracking-[0.2em] text-gold-600">
                  {setting("about_stats_eyebrow")}
                </span>
                <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={stat.label} delay={i * 100}>
                    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/80 p-6 sm:p-8 text-center shadow-lg backdrop-blur-md transition-all duration-500 hover:border-gold-400 hover:-translate-y-2 hover:shadow-[0_22px_50px_-12px_rgba(202,161,75,0.4)]">
                      {/* Ambient Gradient Glow on Hover */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-gold-400/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Subtle Top Gold Shimmer Line */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

                      {/* Icon Ring */}
                      <div className="mx-auto mb-3.5 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-600 shadow-inner transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_25px_rgba(202,161,75,0.45)]">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
                      </div>

                      {/* Stat Value */}
                      <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink drop-shadow-sm transition-colors duration-300 group-hover:text-gold-600">
                        <StatCounter value={stat.value} />
                      </div>

                      {/* Label */}
                      <p className="mt-2 font-display text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-ink/90">
                        {stat.label}
                      </p>

                      {/* Decorative Gold Accent Line */}
                      <div className="mx-auto mt-3 sm:mt-4 h-1 w-8 rounded-full bg-gold-400/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold-400" />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Sakpack India */}
        {isOn("about_advantages_enabled") && (
          <section className="relative overflow-hidden bg-[#fcf9f2] py-12 sm:py-24 border-b border-gold-400/20">
            <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16 items-center">

                {/* Left Column: Heading & Copy */}
                <div className="lg:col-span-5 text-center lg:text-left">
                  <Reveal>
                    {/* Eyebrow Pill */}
                    <div className="mb-3 inline-flex items-center gap-2 justify-center lg:justify-start">
                      <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/90 px-4 py-1.5 text-sm sm:text-sm font-bold uppercase tracking-[0.2em] text-gold-700 shadow-sm backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
                        {setting("about_advantages_eyebrow")}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink leading-tight">
                      {setting("about_advantages_title_line1")} <br />
                      <span className="text-gold-600 font-black">{setting("about_advantages_title_highlight")}</span>
                    </h2>

                    <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ink/80 leading-relaxed font-medium">
                      {setting("about_advantages_paragraph")}
                    </p>

                    {/* Luxury Highlight Tag */}
                    <div className="mt-6 sm:mt-8 inline-flex items-center gap-3 rounded-2xl border border-gold-400/35 bg-white/80 p-4 sm:p-4 shadow-md backdrop-blur-sm text-left">
                      <div className="flex h-10 w-10 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-ink font-bold shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-display text-sm sm:text-sm font-bold uppercase tracking-wider text-ink">
                          {setting("about_advantages_tag_title")}
                        </p>
                        <p className="text-sm sm:text-sm text-ink/75 font-medium">
                          {setting("about_advantages_tag_subtitle")}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Right Column: Feature Cards Grid */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {ADVANTAGES.map((feature, i) => (
                      <Reveal key={feature || i} delay={i * 60}>
                        <div className="group relative flex items-center gap-3.5 rounded-2xl border border-gold-400/30 bg-white/95 p-4 sm:p-4 shadow-sm backdrop-blur-md transition-all duration-400 hover:border-gold-400 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(202,161,75,0.3)]">
                          <div className="flex h-9 w-9 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-gold-400/40 bg-gold-400/15 text-gold-700 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-ink group-hover:border-gold-300">
                            <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
                          </div>
                          <span className="font-display text-sm sm:text-base font-bold tracking-wide text-ink transition-colors group-hover:text-gold-600">
                            {feature}
                          </span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        <TestimonialSection testimonials={safeTestimonials} />

        {/* Vision & Made For Every Body */}
        {isOn("about_vision_enabled") && (
          <section className="py-12 sm:py-24 relative bg-[#fcf9f2] border-b border-gold-400/20 overflow-hidden">
            {/* Ambient Background Radial Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.1)_0%,transparent_70%)]" />

            <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

                {/* Card 1: Our Vision */}
                <Reveal>
                  <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/80 p-6 sm:p-10 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-gold-400 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(202,161,75,0.38)] flex flex-col justify-between">
                    {/* Subtle Background Radial Ambient Glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-400/15 via-amber-300/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top Shimmer Line */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

                    {/* Watermark Background Icon */}
                    <Compass className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 sm:h-40 sm:w-40 text-gold-500/10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12 group-hover:text-gold-500/15" strokeWidth={0.75} />

                    <div>
                      {/* Header Row: Badge & Metallic Icon */}
                      <div className="mb-4 sm:mb-6 flex items-center justify-between">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-600 shadow-inner transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_25px_rgba(202,161,75,0.45)]">
                          <Compass className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
                        </div>
                        <span className="rounded-full bg-gold-400/15 px-3.5 py-1 text-sm sm:text-sm font-extrabold tracking-widest text-gold-700 border border-gold-400/25 shadow-sm">
                          {setting("about_vision_badge")}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-2.5 group-hover:text-gold-600 transition-colors">
                        {setting("about_vision_title")}
                      </h3>

                      <p className="text-sm sm:text-base leading-relaxed text-ink/80 font-medium">
                        {setting("about_vision_text")}
                      </p>
                    </div>

                    {/* Decorative Bottom Gold Pill */}
                    <div className="mt-6 sm:mt-8 flex items-center gap-2">
                      <span className="h-[2px] w-8 sm:w-10 bg-gold-400 rounded-full transition-all duration-500 group-hover:w-16 sm:group-hover:w-20" />
                      <span className="text-sm sm:text-sm font-extrabold uppercase tracking-widest text-gold-600">
                        {setting("about_vision_footer")}
                      </span>
                    </div>
                  </div>
                </Reveal>

                {/* Card 2: Made For Every Body */}
                <Reveal delay={100}>
                  <div className="group relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-gradient-to-b from-white via-white/95 to-[#faf4e8]/80 p-6 sm:p-10 shadow-lg backdrop-blur-md transition-all duration-500 hover:border-gold-400 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(202,161,75,0.38)] flex flex-col justify-between">
                    {/* Subtle Background Radial Ambient Glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-400/15 via-gold-400/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top Shimmer Line */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

                    {/* Watermark Background Icon */}
                    <Heart className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 sm:h-40 sm:w-40 text-gold-500/10 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-gold-500/15" strokeWidth={0.75} />

                    <div>
                      {/* Header Row: Badge & Metallic Icon */}
                      <div className="mb-4 sm:mb-6 flex items-center justify-between">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-600 shadow-inner transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-gold-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-[0_0_25px_rgba(202,161,75,0.45)]">
                          <Heart className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.75} />
                        </div>
                        <span className="rounded-full bg-gold-400/15 px-3.5 py-1 text-sm sm:text-sm font-extrabold tracking-widest text-gold-700 border border-gold-400/25 shadow-sm">
                          {setting("about_inclusivity_badge")}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-2.5 group-hover:text-gold-600 transition-colors">
                        {setting("about_inclusivity_title")}
                      </h3>

                      <p className="text-sm sm:text-base leading-relaxed text-ink/80 font-medium">
                        {setting("about_inclusivity_text")}
                      </p>
                    </div>

                    {/* Decorative Bottom Gold Pill */}
                    <div className="mt-6 sm:mt-8 flex items-center gap-2">
                      <span className="h-[2px] w-8 sm:w-10 bg-gold-400 rounded-full transition-all duration-500 group-hover:w-16 sm:group-hover:w-20" />
                      <span className="text-sm sm:text-sm font-extrabold uppercase tracking-widest text-gold-600">
                        {setting("about_inclusivity_footer")}
                      </span>
                    </div>
                  </div>
                </Reveal>

              </div>
            </div>
          </section>
        )}

        {/* Our Promise — Statement Banner */}
        {isOn("about_promise_enabled") && (
          <section className="relative py-12 sm:py-24 overflow-hidden">
            <div className="mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
              <Reveal className="group relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-gold-400/40 bg-[#380b1b] p-6 sm:p-16 md:p-20 text-center shadow-[0_25px_60px_-15px_rgba(56,11,27,0.5)]">
                {/* Gold Shimmer Top Edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

                {/* Ambient Glowing Orbs */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold-400/20 blur-[100px] transition-all duration-700 group-hover:scale-125" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-amber-500/20 blur-[100px] transition-all duration-700 group-hover:scale-125" />

                <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
                  {/* Floating Quote Icon Ring */}
                  <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-gold-400/40 bg-gold-400/15 text-gold-300 shadow-inner backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold-300 group-hover:shadow-[0_0_30px_rgba(202,161,75,0.5)]">
                    <Quote className="h-7 w-7 sm:h-8 sm:w-8 text-gold-300" strokeWidth={1.5} />
                  </div>

                  {/* Eyebrow Badge */}
                  <span className="mb-3.5 sm:mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm sm:text-sm font-extrabold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-sm">
                    {setting("about_promise_eyebrow")}
                  </span>

                  {/* Quote Typography */}
                  <blockquote className="font-serif italic text-xl sm:text-3xl md:text-4xl text-ivory font-light leading-snug drop-shadow-md">
                    &ldquo;{setting("about_promise_quote")}&rdquo;
                  </blockquote>

                  {/* Brand Separator */}
                  <div className="my-4 sm:my-6 flex items-center gap-3">
                    <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-gold-400/60 to-gold-400" />
                    <span className="font-display text-sm sm:text-sm font-extrabold uppercase tracking-[0.2em] text-gold-300">
                      Sakpack India
                    </span>
                    <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-gold-400/60 to-gold-400" />
                  </div>

                  {/* Tagline */}
                  <p className="text-sm sm:text-sm font-semibold uppercase tracking-[0.18em] text-gold-200/70">
                    {setting("about_promise_tagline")}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-6 sm:mt-10">
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/80 bg-gold-400 px-7 sm:px-8 py-3.5 text-sm sm:text-sm font-black uppercase tracking-widest text-ink shadow-[0_0_25px_rgba(202,161,75,0.4)] transition-all duration-300 hover:scale-105 hover:bg-gold-300 hover:shadow-[0_0_35px_rgba(202,161,75,0.6)]"
                    >
                      {setting("about_promise_button_text")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}

