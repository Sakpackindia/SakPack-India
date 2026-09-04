import Reveal from "@/components/Reveal";

export default function LuxuryQuoteSection({
  line1 = "Chosen With Care",
  line2 = "Made For Comfort",
  line3 = "Worn With Confidence",
  label1 = "Handpicked Fabric",
  label2 = "Perfect Fit",
  label3 = "Everyday Confidence",
}) {
  return (
    <section className="relative w-full overflow-hidden border-y border-ink-line bg-[#3d0d20]">
      <div className="relative flex min-h-[420px] flex-col items-center justify-center bg-ink px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-24">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.06),transparent_70%)]" />
        <div className="pointer-events-none absolute left-[-10%] top-[10%] h-[300px] w-[300px] rounded-full bg-gold-400/5 blur-[110px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-gold-400/5 blur-[110px]" />

        <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">

          <p className="eyebrow justify-center">
            <span className="gold-line" /> The Sakpack Promise <span className="gold-line" />
          </p>

          <div className="mt-6 flex flex-col items-center gap-6 font-display sm:mt-10 sm:flex-row sm:gap-10">
            <div>
              <p className="text-2xl font-semibold leading-tight tracking-wide text-gold-100 sm:text-3xl md:text-4xl">
                {line1}
              </p>
              <span className="mt-2 block font-sans text-base uppercase tracking-[0.28em] text-ivory/40 sm:text-base">
                {label1}
              </span>
            </div>

            <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent sm:h-10 sm:w-px sm:bg-gradient-to-b" />

            <div>
              <p className="text-2xl font-semibold leading-tight tracking-wide text-gold-200 sm:text-3xl md:text-4xl">
                {line2}
              </p>
              <span className="mt-2 block font-sans text-base uppercase tracking-[0.28em] text-ivory/40 sm:text-base">
                {label2}
              </span>
            </div>

            <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent sm:h-10 sm:w-px sm:bg-gradient-to-b" />

            <div>
              <p className="bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 bg-clip-text text-2xl font-bold leading-tight tracking-wide text-transparent sm:text-3xl md:text-4xl">
                {line3}
              </p>
              <span className="mt-2 block font-sans text-base uppercase tracking-[0.28em] text-gold-300/60 sm:text-base">
                {label3}
              </span>
            </div>
          </div>

        </Reveal>

      </div>
    </section>
  );
}
