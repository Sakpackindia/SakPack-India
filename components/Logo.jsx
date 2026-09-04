import Link from "next/link";
import Image from "next/image";

const SIZES = {
  sm: "h-16 w-16 sm:h-18 sm:w-18",
  md: "h-20 w-20 sm:h-28 sm:w-28",
  lg: "h-28 w-28 sm:h-36 sm:w-36",
};

export function LogoMark({ className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-gold-400/40 bg-white/95 p-1 shadow-lg shadow-gold-500/15 backdrop-blur-xs overflow-hidden shrink-0 transition-all duration-300 ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Sakpack India"
        width={256}
        height={256}
        className="h-full w-full object-contain rounded-full scale-105"
      />
    </div>
  );
}

export default function Logo({ size = "md", href = "/", className = "" }) {
  const markSize = SIZES[size] || SIZES.md;
  const content = <LogoMark className={`${markSize} shrink-0 ${className}`} />;

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center group">
      {content}
    </Link>
  );
}
