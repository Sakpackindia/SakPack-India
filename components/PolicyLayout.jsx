import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import PolicyTabs from "@/components/PolicyTabs";
import { BRAND, whatsappLink } from "@/lib/constants";
import { FileText, Sparkles, ChevronRight, MessageCircle, Mail, HelpCircle, CheckCircle2 } from "lucide-react";

export default function PolicyLayout({ title, updated, icon: Icon = FileText, highlights = [], children }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-[#fcf9f2] pb-24 pt-10 sm:pt-14 text-ink">
        
        {/* Background Ambient Radial Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(202,161,75,0.15),transparent_70%)] blur-[100px]" />
          <div className="absolute left-[5%] top-1/4 h-[350px] w-[350px] rounded-full bg-gold-400/10 blur-[120px]" />
          <div className="absolute right-[5%] bottom-1/4 h-[350px] w-[350px] rounded-full bg-gold-400/10 blur-[120px]" />
        </div>

        {/* Shimmering top hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-3 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-5 flex items-center justify-center gap-2 text-base sm:text-base font-bold uppercase tracking-wider text-ink/50">
            <Link href="/" className="transition-colors hover:text-gold-600">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-gold-500/70" />
            <span className="text-gold-700 font-extrabold">Policies</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center">
            {/* Glowing Metallic Badge Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl border border-gold-400/40 bg-white text-gold-700 shadow-md backdrop-blur-md">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-gold-600" strokeWidth={1.5} />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/90 px-4 py-1.5 text-base sm:text-base font-bold uppercase tracking-[0.2em] text-gold-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" />
              Sakpack India Legal & Guarantee
            </div>

            <h1 className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-ink leading-tight">
              {title}
            </h1>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-white/90 px-4 py-1.5 text-base sm:text-base font-bold uppercase tracking-[0.15em] text-ink/70 shadow-sm">
                <span>Last updated {updated}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                <span>2 min read</span>
              </span>
            </div>
          </div>

          {/* Policy Quick Tabs Bar */}
          <PolicyTabs />

          {/* Key Policy Highlights (If provided) */}
          {highlights.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start sm:items-center gap-3.5 rounded-2xl border border-gold-400/30 bg-white/95 p-4 sm:p-4.5 shadow-sm backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-gold-600 mt-0.5 sm:mt-0" />
                  <div>
                    <p className="text-base sm:text-lg font-black uppercase tracking-wider text-ink">{item.title}</p>
                    <p className="text-base sm:text-base font-medium text-ink/70 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Policy Document Body Container */}
          <div className="relative mt-8 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-gold-400/30 bg-white p-5 sm:p-10 md:p-12 shadow-xl shadow-gold-400/5 backdrop-blur-xl">
            
            {/* Top Sheen Line */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gold-gradient"
            />

            {/* Corner Decorative Watermark Icon */}
            <Icon className="pointer-events-none absolute -right-6 -top-6 h-44 w-44 text-gold-400/10 hidden sm:block" />

            {/* Render Content */}
            <div className="relative z-10 space-y-6 sm:space-y-8 text-lg sm:text-lg md:text-xl leading-relaxed text-ink/90">
              {children}
            </div>

            {/* Bottom Support CTA Box */}
            <div className="mt-10 sm:mt-14 rounded-3xl border border-gold-400/35 bg-gradient-to-r from-gold-400/15 via-gold-400/5 to-white p-5 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
                <div>
                  <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-base sm:text-base font-black uppercase tracking-[0.2em] text-gold-700">
                    <HelpCircle className="h-4.5 w-4.5 text-gold-600" />
                    Need Assistance?
                  </div>
                  <h4 className="mt-1 font-display text-xl sm:text-2xl font-black uppercase tracking-wide text-ink">
                    We're Here To Help You
                  </h4>
                  <p className="mt-1 text-base sm:text-base font-medium text-ink/70">
                    Have questions about returns, shipping, or your order? Connect with our support team directly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <a
                    href={whatsappLink(`Hi Sakpack India team, I have a question regarding your ${title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full border border-gold-400/50 bg-gold-gradient px-6 py-3 text-base sm:text-base font-black uppercase tracking-wider text-ink shadow-[0_0_20px_rgba(202,161,75,0.3)] transition-all hover:scale-105"
                  >
                    <MessageCircle className="h-4.5 w-4.5 fill-ink text-ink" />
                    WhatsApp Us
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="flex items-center justify-center gap-2 rounded-full border border-gold-400/35 bg-white px-5 py-3 text-base sm:text-base font-extrabold uppercase tracking-wider text-ink shadow-sm transition-all hover:border-gold-400/60 hover:bg-gold-400/10"
                  >
                    <Mail className="h-4.5 w-4.5 text-gold-600" />
                    Email Support
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
