import { LogoMark } from "@/components/Logo";

export default function LoadingSpinner({ fullScreen = true, label = "Loading" }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#3d0d20] ${
        fullScreen ? "min-h-screen" : "min-h-[40vh] py-20"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-[140px]" />
      </div>

      <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center">
        {/* Static ring */}
        <span className="absolute inset-0 rounded-full border-2 border-gold-400/15" />
        {/* Spinning gold arc */}
        <span
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-gold-300 border-r-gold-300/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          style={{ animationDuration: "1.3s" }}
        />
        {/* Pulsing glow behind the logo */}
        <span className="absolute h-24 w-24 sm:h-28 sm:w-28 animate-pulse rounded-full bg-gold-400/25 blur-2xl" />
        {/* Logo */}
        <div className="relative h-22 w-22 sm:h-28 sm:w-28 animate-floatSlow">
          <LogoMark className="h-full w-full shadow-2xl" />
        </div>
      </div>

      <p className="relative mt-8 text-base sm:text-lg font-bold uppercase tracking-[0.35em] text-gold-300/80 animate-pulse">
        {label}
      </p>
    </div>
  );
}
