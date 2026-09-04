import Link from "next/link";
import Reveal from "@/components/Reveal";
import HangerGlyph from "@/components/HangerGlyph";

export default function LifestyleBanner() {
  return (
    <section className="relative mx-auto max-w-wrap overflow-hidden rounded-3xl">
      <div className="relative flex min-h-[420px] w-full items-center overflow-hidden rounded-none bg-ink-gradient md:rounded-3xl">
        <div className="pointer-events-none absolute right-[-4rem] top-1/2 hidden -translate-y-1/2 opacity-30 md:block">
          <HangerGlyph className="h-80 w-auto" />
        </div>
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />

        <Reveal className="relative flex max-w-lg flex-col justify-center px-6 py-16 md:px-14">
          <p className="eyebrow">
            <span className="gold-line" /> The Sakpack Feel
          </p>
          <h2 className="mt-5 font-display text-3xl leading-tight text-ivory md:text-4xl">
            Starts as comfort. <br /> Settles into confidence.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ivory/60">
            Soft fabric, easy fit — Sakpack pieces feel just as good by evening as they did
            the moment you put them on.
          </p>
          <Link href="/shop" className="btn-gold mt-8 w-fit">
            Shop Now
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
