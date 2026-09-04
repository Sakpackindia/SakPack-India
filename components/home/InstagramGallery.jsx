"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import { BRAND } from "@/lib/constants";

const DEFAULT_PHOTOS = [
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514123/sakpack/instagram/bra-black-front.png", link: "" },
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514127/sakpack/instagram/bra-white-front.png", link: "" },
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514131/sakpack/instagram/bra-nude-front.jpg", link: "" },
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514134/sakpack/instagram/bra-black-back.png", link: "" },
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514138/sakpack/instagram/bra-white-back.png", link: "" },
  { image: "https://res.cloudinary.com/ohej3wta/image/upload/v1788514139/sakpack/instagram/bra-nude-back.jpg", link: "" },
];

export default function InstagramGallery({ heading = "Follow Us On Instagram", photos }) {
  const handle = BRAND.instagram?.split("/").filter(Boolean).pop() || "sakpackindia";
  const PHOTOS = photos && photos.length > 0 ? photos.filter((p) => p.image) : DEFAULT_PHOTOS;
  if (PHOTOS.length === 0) return null;

  // Quadruple photos array for seamless infinite marquee loop
  const MARQUEE_PHOTOS = [...PHOTOS, ...PHOTOS, ...PHOTOS, ...PHOTOS];

  return (
    <section className="relative overflow-hidden bg-[#fcf9f2] pb-16 sm:pb-24 pt-4">
      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        {/* Title with side golden accent lines like reference */}
        <Reveal className="mb-10 sm:mb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full">
              <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-ink text-center">
                {heading}
              </h2>
              <span className="h-[1.5px] w-10 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
            </div>

            {/* Glowing Luxury Instagram Pill Button */}
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-gold-400/50 bg-gradient-to-r from-amber-500/10 via-gold-400/15 to-amber-600/10 px-6 py-2.5 text-ink shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-gold-300 hover:bg-gold-gradient hover:text-ink hover:shadow-[0_0_25px_rgba(202,161,75,0.4)]"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm transition-transform group-hover:rotate-12">
                <Instagram className="h-3.5 w-3.5" />
              </div>
              <span className="font-display text-base sm:text-base font-bold uppercase tracking-[0.2em]">
                @{handle}
              </span>
            </motion.a>
          </div>
        </Reveal>
      </div>

      {/* Infinite Auto-Swiping Marquee Strip (Pauses on Hover) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right Subtle Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-r from-[#fcf9f2] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-l from-[#fcf9f2] to-transparent" />

        <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
          {MARQUEE_PHOTOS.map((photo, i) => (
            <a
              key={`${photo.image}-${i}`}
              href={photo.link?.trim() || BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-40 w-40 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-2xl border border-gold-400/30 bg-[#f7f2ea] shadow-sm transition-all duration-500 hover:border-gold-400 hover:shadow-[0_12px_30px_rgba(202,161,75,0.35)]"
            >
              <Image
                src={photo.image}
                alt="Sakpack India on Instagram"
                fill
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-115"
              />

              {/* Glassmorphic Dark Overlay on Hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/55 opacity-0 backdrop-blur-[3px] transition-opacity duration-300 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-gold-300 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6" />
                <span className="text-base font-bold uppercase tracking-widest text-gold-200 flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-gold-400 text-gold-400" />
                  View Post
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



