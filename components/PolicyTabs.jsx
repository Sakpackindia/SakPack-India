"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RefreshCcw, Truck, ShieldCheck, FileText } from "lucide-react";

const POLICY_TABS = [
  { name: "Refund & Returns", href: "/policies/refund", icon: RefreshCcw },
  { name: "Shipping Policy", href: "/policies/shipping", icon: Truck },
  { name: "Privacy Policy", href: "/policies/privacy", icon: ShieldCheck },
  { name: "Terms of Service", href: "/policies/terms", icon: FileText },
];

export default function PolicyTabs() {
  const pathname = usePathname();

  return (
    <div className="mt-6 sm:mt-8 w-full">
      {/* Mobile view: 2x2 Grid (100% text visible, zero dots/truncation, easy tap targets) */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {POLICY_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const TabIcon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-center border shadow-xs transition-all ${
                isActive
                  ? "border-gold-400/80 bg-ink text-gold-300 shadow-md shadow-ink/20 font-black"
                  : "border-gold-400/30 bg-white/95 text-ink/90 font-extrabold active:scale-95"
              }`}
            >
              <TabIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-gold-300" : "text-gold-600"}`} strokeWidth={2} />
              <span className="whitespace-normal leading-tight text-base uppercase tracking-wider">{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop / Tablet view: Centered Luxury Glassmorphic Pill Bar */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/95 p-1.5 shadow-md backdrop-blur-md">
          {POLICY_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            const TabIcon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base sm:text-base font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "border border-gold-400/80 bg-ink text-gold-300 shadow-md shadow-ink/20 scale-[1.02]"
                    : "text-ink/75 hover:bg-gold-400/15 hover:text-gold-700 active:scale-95"
                }`}
              >
                <TabIcon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="whitespace-nowrap">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
