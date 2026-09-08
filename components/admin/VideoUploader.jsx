"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Film, X, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE_BYTES = 100000000; // 100MB — Cloudinary's own account-level video limits still apply on top of this

export default function VideoUploader({ value, onChange, folder = "sakpack/products" }) {
  const [error, setError] = useState(null);

  const restoreBodyScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.documentElement.style.overflow = "";
    }
  };

  const handleSuccess = (result) => {
    restoreBodyScroll();
    setError(null);
    const url = result?.info?.secure_url;
    if (url) onChange(url);
  };

  // Cloudinary's widget reports failures (file too large, unsupported
  // format, account quota exceeded, network drop mid-upload, etc.) through
  // this callback rather than throwing — without handling it the admin just
  // sees the modal close with nothing happening, which reads as a silent
  // bug rather than "your video didn't meet the upload limits."
  const handleError = (err) => {
    restoreBodyScroll();
    const raw = typeof err === "string" ? err : err?.statusText || err?.status || "";
    let message = "Video upload failed. Please try again.";
    if (/size/i.test(raw)) {
      message = "This video is too large (max 100MB). Trim it or compress it and try again.";
    } else if (/format/i.test(raw)) {
      message = "This video format isn't supported. Try MP4 (H.264) instead.";
    } else if (raw) {
      message = `Video upload failed: ${raw}`;
    }
    setError(message);
    console.error("Cloudinary video upload error:", err);
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
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        options={{ folder, resourceType: "video", sources: ["local", "url"], maxFileSize: MAX_FILE_SIZE_BYTES }}
        onSuccess={handleSuccess}
        onError={handleError}
        onClose={restoreBodyScroll}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => {
              setError(null);
              open();
            }}
            className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/15 text-ink/40 transition-colors hover:border-gold-400/50 hover:text-gold-600"
          >
            <Film className="h-6 w-6" />
            <span className="text-base">Upload Video</span>
            <span className="text-sm text-ink/30">Max 100MB, MP4 recommended</span>
          </button>
        )}
      </CldUploadWidget>
      {error && (
        <p className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-red-500">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
