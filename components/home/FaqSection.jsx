import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ChevronDown } from "lucide-react";

export default function FaqSection({
  subtitle = "Everything you need to know before you order.",
  image = "/bra-nude-back.jpeg",
  showImage = true,
  q1 = "How do I pick the right size?",
  a1 = "Each product page has a size chart (S, M, L, XL). If you're between sizes, message us on WhatsApp with your measurements and we'll help you choose.",
  q2 = "How should I wash and care for these fabrics?",
  a2 = "Gentle machine wash or hand wash in cold water is best for most of our fabrics. Avoid harsh bleach and always check the care label on the product.",
  q3 = "Do you ship across India?",
  a3 = "Yes, we ship all over India. We pack your order in 1 to 2 days. Delivery usually takes 3 to 6 days depending on your city.",
  q4 = "Can I return or exchange my order?",
  a4 = "Yes — unused items in original condition can be returned or exchanged within 7 days of delivery. If your item arrives damaged, we'll replace it for free. Just message us on WhatsApp with a photo.",
}) {
  const FAQS = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-[5%] top-0 h-[400px] w-[450px] rounded-full bg-gold-400/10 blur-[130px]" />
        <div className="absolute right-[8%] bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-10 sm:mb-16">
          <p className="eyebrow">
            <span className="gold-line" /> Good to Know
          </p>
          <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.2em] text-ink sm:text-2xl md:text-3xl">
            Questions You Might Have
          </h2>
          <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-ink/60 sm:mt-4 sm:text-lg lg:text-lg">
            {subtitle}
          </p>
        </Reveal>

        <div className={`relative z-10 grid grid-cols-1 gap-10 ${showImage ? "md:grid-cols-[380px_1fr] md:items-start" : ""}`}>
          {/* Left: Visual */}
          {showImage && (
            <Reveal delay={80} className="flex justify-center md:block">
              <div className="group relative aspect-[4/5] w-full max-w-[280px] sm:max-w-[320px] md:max-w-none">
                <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(202,161,75,0.22),transparent_65%)] blur-3xl" />
                <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-gold-400/30 shadow-xl">
                  <Image
                    src={image}
                    alt="Sakpack India"
                    fill
                    sizes="(max-width: 768px) 320px, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-3 rounded-[1.4rem] border border-white/25" />
                </div>
              </div>
            </Reveal>
          )}

          {/* FAQ Accordion List */}
          <div className="space-y-2.5 sm:space-y-4">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <details className="group relative overflow-hidden rounded-2xl border border-gold-400/25 bg-white/90 px-3.5 shadow-sm transition-all duration-500 hover:border-gold-400/45 open:border-gold-400/50 open:bg-white open:shadow-[0_20px_45px_-28px_rgba(202,161,75,0.3)] sm:px-6">
                  <span className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gold-400/0 transition-all duration-500 group-open:bg-gold-500" />

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2.5 py-3.5 font-display text-base font-semibold text-ink/80 transition-colors duration-300 group-hover:text-gold-700 sm:gap-4 sm:py-5 sm:text-lg lg:text-xl">
                    <span>{item.q}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400/30 text-gold-600 transition-all duration-500 group-open:rotate-180 group-open:border-gold-400/50 group-open:bg-gold-400/15 sm:h-8 sm:w-8">
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </summary>

                  <p className="pb-3.5 text-base font-medium leading-relaxed text-ink/60 sm:pb-5 sm:text-lg lg:text-lg">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
