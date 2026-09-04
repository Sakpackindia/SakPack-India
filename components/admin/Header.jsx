"use client";

import Link from "next/link";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

export default function AdminHeader({ adminName }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminName || "A").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gold-400/20 bg-white/90 px-4 backdrop-blur-md md:px-6">
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-ink/60 hover:text-ink lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-lg text-ink font-semibold">
          Welcome back, <span className="font-semibold text-gold-700">{adminName || "Admin"}</span>
        </p>
        <p className="text-base text-ink/35 font-semibold tracking-wide mt-0.5">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 text-base font-semibold text-ink/60 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-600 hover:shadow-[0_0_15px_rgba(212,163,89,0.05)] sm:flex"
        >
          View Store <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-8 w-px bg-gold-400/10 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-base font-semibold text-ink shadow-[0_2px_10px_rgba(202,161,75,0.25)]">
            {initial}
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-700 transition-all duration-300 hover:border-red-400/60 hover:bg-red-500/20 hover:text-red-800 shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
