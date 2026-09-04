import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  Tag,
  Settings,
  Star,
  MessageSquare,
  LayoutTemplate,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
  { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-ink/10 text-ink/70",
  processing: "bg-gold-400/15 text-gold-700",
  shipped: "bg-blue-400/15 text-blue-600",
  delivered: "bg-green-400/15 text-green-600",
  cancelled: "bg-red-400/15 text-red-600",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, sub: `${stats.pendingOrders} pending` },
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "Users", value: stats.customerCount, icon: Users },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            Admin <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Dashboard</span>
          </h1>
          <p className="text-base text-ink/50 font-semibold mt-1">A snapshot of how the store is doing.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="group relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold-400/20 bg-white/85 p-4 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-[0_0_30px_rgba(212,163,89,0.04)] shadow-xs"
          >
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-400/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-400/10 text-gold-600 border border-gold-400/20 transition-all duration-500 group-hover:scale-105 group-hover:bg-gold-400/15">
                <c.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            <p className="mt-3 sm:mt-5 text-xs sm:text-xs uppercase tracking-widest text-ink/60 font-semibold truncate">{c.label}</p>
            <p className="mt-1 sm:mt-1.5 font-display text-xl sm:text-3xl leading-none text-ink font-semibold group-hover:text-gold-700 transition-colors truncate">
              {c.value}
            </p>
            {c.sub && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-xs text-emerald-700 flex items-center gap-1.5 font-semibold bg-emerald-400/15 px-2.5 py-1 rounded-full w-fit border border-emerald-400/30 truncate">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                {c.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions + Needs Attention */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 shadow-xs">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-gold-400/20 bg-ink/[0.04] px-3 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-gold-400/5 shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 border border-gold-400/20">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ink/80 group-hover:text-gold-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 shadow-xs">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Needs Attention</h2>
          <div className="space-y-3">
            <Link
              href="/admin/reviews"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/20 bg-ink/[0.04] px-4 py-3.5 transition-colors hover:border-gold-400/35 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 text-gold-600 border border-gold-400/20">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-ink/80 group-hover:text-ink">Reviews to approve</span>
              </div>
              <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-xs font-semibold text-gold-800 border border-gold-400/30">
                {stats.pendingReviewCount}
              </span>
            </Link>

            <Link
              href="/admin/inquiries"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/20 bg-ink/[0.04] px-4 py-3.5 transition-colors hover:border-gold-400/35 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-600 border border-blue-400/20">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-ink/80 group-hover:text-ink">Unresolved inquiries</span>
              </div>
              <span className="rounded-full bg-blue-400/15 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-400/30">
                {stats.unresolvedInquiryCount}
              </span>
            </Link>

            <Link
              href="/admin/orders"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/20 bg-ink/[0.04] px-4 py-3.5 transition-colors hover:border-gold-400/35 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-600 border border-red-400/20">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-ink/80 group-hover:text-ink">Orders pending</span>
              </div>
              <span className="rounded-full bg-red-400/15 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-400/30">
                {stats.pendingOrders}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Alert */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        
        {/* Recent Orders Panel */}
        <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 md:p-8 backdrop-blur-md shadow-xs">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-ink">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-1.5 text-xs font-semibold text-gold-700 transition-colors hover:text-gold-800 uppercase tracking-wider"
            >
              View all <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <p className="py-12 text-center text-base font-semibold text-ink/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gold-400/10">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="group -mx-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl px-3 py-4 text-sm font-semibold transition-all duration-300 hover:bg-ink/[0.04]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20 group-hover:scale-105 transition-transform duration-300">
                        <ShoppingCart className="h-4.5 w-4.5" />
                      </div>
                      <span className="truncate font-semibold text-ink group-hover:text-gold-700 transition-colors">{o.order_number}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <span className="text-ink/80 font-semibold">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize sm:px-3 border border-gold-400/20 ${STATUS_STYLES[o.order_status] || ""}`}>
                        {o.order_status}
                      </span>
                      <ChevronRight className="hidden h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-ink/60 sm:block" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low Stock Panel */}
        <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 md:p-8 backdrop-blur-md shadow-xs">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-600 border border-red-400/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-ink">Low Stock</h2>
          </div>
          
          {stats.lowStock.length === 0 ? (
            <p className="py-6 text-center text-base font-semibold text-ink/50">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {stats.lowStock.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-red-500/15 bg-red-500/[0.03] px-4 py-3.5 text-sm font-semibold hover:bg-red-500/[0.06] transition-colors"
                >
                  <span className="truncate text-ink/80 font-semibold">
                    {v.products?.name} <span className="text-xs text-ink/50 font-semibold">— {v.variant_name}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-red-400/15 px-3 py-1 text-xs font-semibold text-red-700 border border-red-400/30">
                    {v.stock_quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
