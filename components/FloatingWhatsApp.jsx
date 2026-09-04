"use client";

import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  // Hide on admin, bundle, or product details pages (e.g. /shop/soft-palazzo)
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/bundle") ||
    (pathname?.startsWith("/shop/") && pathname.split("/").length > 2)
  ) {
    return null;
  }

  return (
    <a
      href={whatsappLink("Hi Sakpack India, I'd like to know more about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
    >
      <FaWhatsapp className="h-7 w-7 text-white" />
    </a>
  );
}
