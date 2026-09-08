"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Film, X } from "lucide-react";

export default function VideoUploader({ value, onChange, folder = "sakpack/products" }) {
  const restoreBodyScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.documentElement.style.overflow = "";
    }
  };

  const handleSuccess = (result) => {
    restoreBodyScroll();
    const url = result?.info?.secure_url;
    if (url) onChange(url);
  };

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-ink/15 bg-black">
        <video src={value} controls className="h-48 w-full rounded-xl object-contain" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{ folder, resourceType: "video", sources: ["local", "url"], maxFileSize: 100000000 }}
      onSuccess={handleSuccess}
      onClose={restoreBodyScroll}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/15 text-ink/40 transition-colors hover:border-gold-400/50 hover:text-gold-600"
        >
          <Film className="h-6 w-6" />
          <span className="text-base">Upload Video</span>
        </button>
      )}
    </CldUploadWidget>
  );
}
