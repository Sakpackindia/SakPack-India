"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import HangerGlyph from "@/components/HangerGlyph";
import { useProductVariant } from "./ProductVariantContext";

export default function ProductGallery({ images, name, featuredImage }) {
  const ctx = useProductVariant();
  const selectedColor = ctx?.selected?.color || null;
  const selectedSizeName = ctx?.selected?.variant_name || null;

  // Photos vary by color, not size, so a color-tagged image only shows once
  // a shopper picks that color. A size-tagged image (the old, pre-color
  // tagging scheme) only shows for that size. An image tagged with neither
  // is "General" and shows regardless of what's selected.
  const filtered = (images || []).filter((img) => {
    if (img.color) return img.color === selectedColor;
    if (img.variant_name) return img.variant_name === selectedSizeName;
    return true;
  });
  // Never fall back to the full, unfiltered gallery — that would mix in
  // images uploaded for a different color/size. Instead fall back to the
  // single product-level featured image, or a placeholder.
  const list =
    filtered.length > 0
      ? filtered
      : featuredImage
        ? [{ id: "featured", image_url: featuredImage }]
        : [{ id: "placeholder", image_url: null }];

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [ctx?.selected?.id]);

  const activeImage = list[active]?.image_url;

  return (
    <div className="w-full relative">

      {/* Ambient glow behind the frame */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gold-400/10 blur-3xl"
      />

      {/* Flexible Layout: Thumbnails Left on Desktop (`lg:flex-row`), Bottom on Mobile */}
      <div className="flex flex-col-reverse lg:flex-row items-start gap-4">

        {/* Thumbnail Selection Strip (Arrow Buttons for Laptop/Desktop only `hidden lg:flex`) */}
        {list.length > 1 && (
          <div className="flex flex-row lg:flex-col items-center justify-center gap-2 w-full lg:w-auto shrink-0">
            {/* Desktop Up Arrow */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActive((prev) => (prev > 0 ? prev - 1 : list.length - 1))}
              aria-label="Previous image"
              className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/40 bg-ink text-gold-300 shadow-md transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:shadow-[0_0_15px_rgba(202,161,75,0.4)]"
            >
              <ChevronUp className="h-4 w-4 stroke-[2.5]" />
            </motion.button>

            {/* Thumbnail Strip */}
            <div className="no-scrollbar flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[440px] shrink-0 w-full lg:w-auto py-1">
              {list.map((img, i) => (
                <motion.button
                  key={img.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(i)}
                  className={`relative h-14 w-14 lg:h-16 lg:w-16 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    active === i
                      ? "border-gold-400 ring-2 ring-gold-400/50 shadow-lg shadow-gold-400/25 bg-white"
                      : "border-gold-400/25 bg-white/90 opacity-70 hover:opacity-100 hover:border-gold-400"
                  }`}
                >
                  {img.image_url && (
                    <Image src={img.image_url} alt="" fill sizes="64px" className="rounded-xl object-contain p-1.5" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Desktop Down Arrow */}
            <motion.button
              whileHover={{ scale: 1.1, y: 2 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActive((prev) => (prev < list.length - 1 ? prev + 1 : 0))}
              aria-label="Next image"
              className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/40 bg-ink text-gold-300 shadow-md transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:shadow-[0_0_15px_rgba(202,161,75,0.4)]"
            >
              <ChevronDown className="h-4 w-4 stroke-[2.5]" />
            </motion.button>
          </div>
        )}

        {/* Main Image Container */}
        <div className="relative aspect-square flex-1 w-full overflow-hidden rounded-[2.5rem] border border-gold-400/20 bg-white shadow-2xl group transition-all duration-500 hover:border-gold-400/50">

          {/* Shimmering top sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer z-20" />

          <AnimatePresence mode="wait">
            {activeImage ? (
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImage}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="rounded-[2rem] object-contain p-3 sm:p-5"
                  priority
                />
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center bg-ivory-deep">
                <HangerGlyph className="h-2/3 w-auto text-ink/25 animate-floatSlow" />
              </div>
            )}
          </AnimatePresence>

          {activeImage && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View full image"
              className="absolute bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-ink text-gold-300 shadow-xl transition-all duration-300 hover:bg-gold-400 hover:text-ink hover:border-gold-400"
            >
              <ZoomIn className="h-5 w-5" />
            </motion.button>
          )}

          {/* Double Luxury Borders */}
          <div className="absolute inset-4 rounded-[2rem] border border-gold-400/10 pointer-events-none z-20" />
        </div>

      </div>

      {/* Fullscreen Lightbox — portaled to <body> so it always renders above the sticky header */}
      {lightboxOpen &&
        activeImage &&
        typeof document !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 sm:p-10"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="group absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft/80 text-ivory/70 backdrop-blur-sm transition-all hover:border-gold-300/40 hover:text-gold-200"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
            <div className="relative h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <Image src={activeImage} alt={name} fill sizes="90vw" className="object-contain" />
            </div>
          </motion.div>,
          document.body
        )}
    </div>
  );
}
