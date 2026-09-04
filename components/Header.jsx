"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, User, Sparkles, ChevronDown, ChevronRight, LayoutDashboard, LogOut, LogIn, Search, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";
import Logo from "@/components/Logo";
import HangerGlyph from "@/components/HangerGlyph";

const STATIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function AnnouncementBar({ message }) {
  if (!message) return null;

  return (
    <div className="relative overflow-hidden border-b border-gold-400/20 bg-ink">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.08] blur-[60px]" />
      <div className="relative mx-auto flex max-w-wrap items-center justify-center gap-2.5 px-10 py-2 sm:px-12">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-300 animate-pulse" />
        <p className="text-center text-base font-semibold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 sm:text-base sm:tracking-[0.2em]">
          {message}
        </p>
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-300 animate-pulse" />
      </div>
    </div>
  );
}

export default function Header({ categories = [], announcement, isLoggedIn = false, bundleEnabled = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = bundleEnabled
    ? [...STATIC_LINKS.slice(0, 2), { label: "Gift Set", href: "/bundle" }, ...STATIC_LINKS.slice(2)]
    : STATIC_LINKS;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-gold-400/25 transition-colors duration-300 ${mobileOpen ? "bg-[#380b1b]" : "bg-[#380b1b] shadow-xl"
      }`}>
      <AnnouncementBar message={announcement} />

      {/* Shimmering bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-6 px-4 py-1.5 sm:px-8 sm:py-2 md:px-12">

        {/* Left Side: Mobile Hamburger + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-[#4a1029] text-ivory transition-colors hover:border-gold-400 hover:text-gold-300 md:hidden"
          >
            <Menu className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Brand Logo (Left) */}
          <Link href="/" className="group flex shrink-0 items-center transition-transform duration-300 hover:opacity-95">
            <Logo theme="dark" size="sm" className="sm:hidden" href={null} />
            <Logo theme="dark" size="md" className="hidden sm:inline-flex" href={null} />
          </Link>
        </div>

        {/* Center: High-End Fashion Navigation Links */}
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.label === "Shop") {
              return (
                <div key={link.href} className="group relative py-2">
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1.5 text-base font-extrabold uppercase tracking-[0.25em] transition-colors duration-300 ${
                      pathname?.startsWith("/shop")
                        ? "text-gold-300"
                        : "text-ivory/80 hover:text-gold-300"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4 stroke-[2.5] text-gold-400 group-hover:rotate-180 transition-transform duration-300" />
                    {pathname?.startsWith("/shop") && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gold-gradient" />
                    )}
                  </Link>

                  {/* Dropdown Mega-Menu (Ultra-Luxurious Light Glass Panel) */}
                  {categories.length > 0 && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                      {/* This wrapper's own padding-top bridges the gap to the trigger above,
                          so the whole hover area stays continuous instead of dropping the
                          dropdown mid-transition when the cursor crosses that gap. */}
                      <div className="relative w-[580px] scale-95 rounded-[2rem] border border-gold-400/35 bg-white p-5 shadow-[0_30px_90px_rgba(74,16,41,0.24)] backdrop-blur-2xl transition-transform duration-300 group-hover:scale-100">
                        {/* Caret pointer */}
                        <div className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t border-gold-400/35 bg-white" />

                        {/* Ambient radial background glow */}
                        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_top,rgba(202,161,75,0.12),transparent_70%)]" />

                        <div className="relative z-10">
                          {/* Top Header Row */}
                          <div className="flex items-center justify-between px-1.5 pb-2.5 pt-0.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-gold-600 animate-pulse" />
                              <span className="text-xs font-black uppercase tracking-[0.22em] text-gold-700">
                                Browse Categories
                              </span>
                            </div>
                            <span className="rounded-full border border-gold-400/35 bg-gold-400/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-gold-700 shadow-xs">
                              {categories.length} Collections
                            </span>
                          </div>

                          {/* Shimmering Gold Divider */}
                          <div className="mb-3 h-px bg-gradient-to-r from-gold-400/60 via-gold-400/25 to-transparent" />

                          {/* Content Grid: Left Categories + Right Spotlight Card */}
                          <div className="grid grid-cols-12 gap-3.5 items-stretch">
                            {/* Left Column: Category Items (capped so the panel never overflows) */}
                            <div className="col-span-7 space-y-1">
                              {categories.slice(0, 10).map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/shop?category=${cat.id}`}
                                  className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-1.5 transition-all duration-300 hover:border-gold-400/40 hover:bg-gradient-to-r hover:from-gold-400/15 hover:via-gold-400/5 hover:to-transparent hover:shadow-xs"
                                >
                                  {/* Category Icon / Thumbnail Avatar */}
                                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold-400/35 bg-gold-400/10 text-gold-700 shadow-xs transition-all duration-300 group-hover/item:border-gold-500 group-hover/item:scale-105 group-hover/item:bg-gold-400/25">
                                    {cat.image_url ? (
                                      <img src={cat.image_url} alt={cat.name} className="h-10 w-10 aspect-square object-cover rounded-xl" />
                                    ) : (
                                      <HangerGlyph className="h-4.5 w-4.5" />
                                    )}
                                  </div>

                                  {/* Category Title */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-ink transition-colors duration-300 group-hover/item:text-gold-700">
                                      {cat.name}
                                    </p>
                                  </div>

                                  {/* Sliding Right Arrow */}
                                  <ChevronRight className="h-4 w-4 shrink-0 text-gold-600 opacity-0 -translate-x-2 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                </Link>
                              ))}
                            </div>

                            {/* Right Column: Featured Spotlight Card */}
                            <div className="col-span-5 flex flex-col items-center justify-center gap-3.5 overflow-hidden rounded-2xl border border-gold-400/35 bg-gradient-to-br from-[#4a1029] via-[#380c1e] to-[#1e030e] p-5 text-center shadow-md">
                              <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/20 text-gold-300 shadow-[0_0_20px_rgba(202,161,75,0.3)]">
                                  <Sparkles className="h-5.5 w-5.5 animate-pulse" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.22em] text-gold-300">
                                  Luxury Collection
                                </span>
                                <h4 className="mt-1 font-display text-base font-black uppercase tracking-wider text-ivory">
                                  Everyday Luxe
                                </h4>
                                <p className="mt-1 text-xs leading-relaxed text-ivory/85 font-medium px-1">
                                  Handcrafted fits designed for supreme comfort & silhouette.
                                </p>
                              </div>

                              <Link
                                href="/shop"
                                className="group/cta relative w-full flex items-center justify-center gap-1.5 overflow-hidden rounded-full border border-gold-400/50 bg-gold-gradient px-4 py-2.5 text-xs font-black uppercase tracking-wider text-ink shadow-[0_0_20px_rgba(202,161,75,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(202,161,75,0.6)]"
                              >
                                <span>Explore All</span>
                                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                              </Link>
                            </div>
                          </div>

                          {/* Footer Link */}
                          <div className="mt-3.5 flex items-center justify-between border-t border-gold-400/20 px-1.5 pt-3 text-xs">
                            <span className="flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-ink/70">
                              ✨ Premium Quality Guaranteed
                            </span>
                            <Link
                              href="/shop"
                              className="font-black uppercase tracking-widest text-gold-700 transition-colors hover:text-gold-800 hover:underline"
                            >
                              View All Products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-base font-extrabold uppercase tracking-[0.25em] transition-colors duration-300 ${
                  isActive
                    ? "text-gold-300"
                    : "text-ivory/80 hover:text-gold-300"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gold-gradient" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Search Icon */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition-all duration-300 ${
              searchOpen
                ? "border-gold-400 bg-gold-400/20 text-gold-300"
                : "border-gold-400/30 bg-gold-400/10 text-ivory hover:border-gold-400/60 hover:text-gold-300"
            }`}
          >
            <Search className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Account Icon */}
          <Link
            href="/account"
            aria-label="Account"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-ivory transition-all duration-300 hover:border-gold-400/60 hover:text-gold-300"
          >
            <User className="h-5 w-5 stroke-[2.5]" />
          </Link>

          {/* Cart Bag Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="group relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/50 bg-gold-gradient text-ink shadow-[0_0_20px_rgba(202,161,75,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(202,161,75,0.5)]"
          >
            <ShoppingBag className="h-5 w-5 text-ink stroke-[2.5]" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-gold-400/40 bg-ink px-1 text-[11px] font-black text-gold-300 shadow-md">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-gold-400/40 bg-[#380b1b] shadow-2xl animate-fadeUp">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap items-center gap-2 sm:gap-3 px-3 py-3 sm:px-6 md:px-12">
            <Search className="h-5 w-5 shrink-0 text-gold-300 stroke-[2.5]" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bras, shapewear, gift sets..."
              className="flex-1 bg-transparent px-2 py-1 text-base sm:text-lg font-medium text-ivory placeholder:text-ivory/40 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider shrink-0 rounded-full">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 text-ivory/80 transition-all hover:border-gold-300 hover:text-gold-300"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#380b1b] md:hidden animate-fadeUp flex flex-col">
          <div className="absolute inset-0 bg-radial-gradient opacity-[0.03] pointer-events-none" />
          
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/20 shrink-0 bg-[#2d0916]">
            {/* Logo */}
            <Logo theme="dark" size="sm" href={null} />

            {/* Close Toggle */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-2.5 rounded-full border border-gold-400/40 bg-gold-400/10 text-ivory hover:text-gold-300 hover:border-gold-300 transition-all shadow-sm"
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {/* Mobile Search Bar in Drawer */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex items-center gap-3 rounded-2xl border border-gold-400/45 bg-white/10 px-4.5 py-3 shadow-md backdrop-blur-sm">
              <Search className="h-5 w-5 text-gold-300 shrink-0 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, collections..."
                className="flex-1 bg-transparent text-base font-semibold text-ivory placeholder:text-ivory/50 focus:outline-none"
              />
              <button type="submit" className="rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-black uppercase tracking-wider text-ink shadow-sm">
                Go
              </button>
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-5 py-3.5 font-display text-lg sm:text-xl font-extrabold uppercase tracking-wider transition-all ${
                    pathname === link.href
                      ? "bg-gold-400/20 text-gold-200 border border-gold-400/35 shadow-md"
                      : "text-ivory hover:bg-gold-400/10 hover:text-gold-300"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-5 w-5 text-gold-400/70" />
                </Link>
              ))}

              {isLoggedIn ? (
                <div className="flex items-center gap-2.5 mt-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-1 items-center gap-3 rounded-2xl px-5 py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-gold-200 bg-gold-400/15 border border-gold-400/30 hover:bg-gold-400/20 transition-all shadow-sm"
                  >
                    <LayoutDashboard className="h-5.5 w-5.5 text-gold-300" />
                    Account
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      aria-label="Log out"
                      className="flex h-13 w-13 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-ivory hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300 transition-all shadow-sm"
                    >
                      <LogOut className="h-5.5 w-5.5" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold flex items-center justify-center gap-2.5 py-4 text-base sm:text-lg font-black tracking-widest uppercase rounded-2xl mt-2 shadow-xl"
                >
                  <LogIn className="h-5 w-5" />
                  Login / Account
                </Link>
              )}
            </nav>

            {/* Categories Section */}
            {categories.length > 0 && (
              <div className="border-t border-gold-400/20 pt-6">
                <div className="flex items-center justify-between px-1 pb-3.5">
                  <p className="flex items-center gap-2 text-base font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-gold-100 to-gold-400">
                    <Sparkles className="h-4 w-4 text-gold-300 animate-pulse" />
                    Browse Collections
                  </p>
                  <span className="text-xs font-extrabold text-gold-300/80 uppercase tracking-widest bg-gold-400/15 border border-gold-400/30 px-2.5 py-1 rounded-full">{categories.length} Items</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between rounded-2xl border border-gold-400/25 bg-gold-400/10 p-3.5 text-ivory transition-all active:scale-[0.98] hover:border-gold-400/50 hover:bg-gold-400/20 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-400/35 bg-gold-400/15 text-gold-300 overflow-hidden shadow-xs">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="h-full w-full rounded-xl object-cover" />
                          ) : (
                            <HangerGlyph className="h-5 w-5" />
                          )}
                        </div>
                        <p className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-ivory group-hover:text-gold-200 truncate">{cat.name}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-gold-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
