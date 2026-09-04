"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Package, User, Mail, Phone, ChevronRight, Truck, ExternalLink, Pencil, AlertCircle, X } from "lucide-react";
import HangerGlyph from "@/components/HangerGlyph";
import { splitVariantName } from "@/lib/variantDisplay";
import { updateProfile } from "@/actions/account";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-ivory-deep/60 px-4 py-3 text-base sm:text-lg text-ink placeholder:text-ink/40 font-medium transition-all duration-300 focus:border-gold-400/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20";

const STATUS_STYLES = {
  pending: "text-ink/70 bg-ink/5 border-ink/15",
  processing: "text-gold-700 bg-gold-400/15 border-gold-400/35",
  shipped: "text-blue-600 bg-blue-500/15 border-blue-500/30",
  delivered: "text-emerald-600 bg-emerald-500/15 border-emerald-500/30",
  cancelled: "text-red-600 bg-red-500/15 border-red-500/30",
};

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "profile", label: "My Profile", icon: User },
];

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function ProfileEditForm({ profile, onDone }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-base text-red-600 font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" /> {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm sm:text-base uppercase tracking-wider font-extrabold text-ink/60">Full Name</label>
        <input name="full_name" defaultValue={profile?.full_name || ""} required className={inputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm sm:text-base uppercase tracking-wider font-extrabold text-ink/60">Phone Number</label>
        <input
          name="phone"
          type="tel"
          maxLength={10}
          defaultValue={profile?.phone || ""}
          placeholder="10-digit phone number"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-gold w-fit px-6 py-3 text-base sm:text-lg font-bold disabled:opacity-60">
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex w-fit items-center justify-center gap-1.5 rounded-xl border border-ink/20 px-5 py-3 text-base sm:text-lg font-semibold text-ink/70 hover:text-ink hover:border-gold-400/50"
        >
          <X className="h-4.5 w-4.5" /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function AccountTabs({ profile, orders }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProfile, setEditingProfile] = useState(false);

  const filteredOrders =
    statusFilter === "all" ? orders : (orders || []).filter((o) => o.order_status === statusFilter);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="relative flex gap-2 rounded-2xl border border-gold-400/25 bg-white/90 p-1.5 w-full sm:w-fit shadow-md backdrop-blur-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 text-base sm:text-lg font-extrabold tracking-wide transition-colors duration-300 ${
                isActive ? "text-ivory" : "text-ink/70 hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="account-tab-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-ink to-ink-soft shadow-lg shadow-ink/25 ring-1 ring-gold-400/30"
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="mt-6 sm:mt-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mb-4 sm:mb-6">Order History</h2>

          {orders && orders.length > 0 && (
            <div className="mb-5 sm:mb-6 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.key;
                const count = f.key === "all" ? orders.length : orders.filter((o) => o.order_status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm sm:text-base font-extrabold transition-all duration-300 ${
                      isActive
                        ? "border-transparent bg-ink text-ivory shadow-md"
                        : "border-ink/20 bg-white text-ink/80 hover:border-gold-400/50 hover:text-ink"
                    }`}
                  >
                    {f.label}
                    <span className={`text-sm sm:text-base font-extrabold ${isActive ? "text-gold-300" : "text-ink/50"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {!orders || orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-gold-400/30 bg-gradient-to-b from-white to-ivory-deep/60 py-16 text-center"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
                <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[80px]" />
              </div>
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center"
                >
                  <span className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl" />
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-ink to-ink-soft text-gold-300 shadow-xl ring-2 ring-gold-400/30">
                    <Package className="h-9 w-9" strokeWidth={1.5} />
                  </span>
                </motion.div>
                <p className="font-display text-xl font-bold text-ink">No orders yet</p>
                <p className="mt-2 text-base sm:text-lg text-ink/60">Your future favorites are waiting in the shop.</p>
                <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link href="/shop" className="btn-gold mt-6 inline-flex px-8 py-3.5 text-base sm:text-lg font-bold">
                    Start Shopping
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center">
              <p className="text-xl text-ink/50 font-medium">No {statusFilter} orders found.</p>
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {filteredOrders.map((order, i) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="card-panel relative overflow-hidden p-5 sm:p-7"
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      order.order_status === "delivered"
                        ? "bg-emerald-400"
                        : order.order_status === "cancelled"
                          ? "bg-red-400"
                          : "bg-gold-gradient"
                    }`}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-lg sm:text-xl font-extrabold text-ink break-words">{order.order_number}</p>
                      <p className="text-sm sm:text-base text-ink/70 mt-0.5 font-semibold">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg sm:text-xl font-black text-ink mb-1">₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
                      <span className={`inline-block rounded-full border px-3 py-1 sm:px-3.5 sm:py-1 text-xs sm:text-sm font-extrabold uppercase tracking-wide ${STATUS_STYLES[order.order_status] || "text-ink/70 bg-ink/5 border-ink/15"}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4 text-sm sm:text-base text-ink/80 font-semibold">
                    {order.order_items.map((item, idx) => {
                      const { color, size } = splitVariantName(item.variant_name);
                      return (
                        <li key={idx} className="flex items-center gap-2.5">
                          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-lg border border-gold-400/25 bg-white shadow-inner">
                            {item.products?.featured_image_url ? (
                              <Image src={item.products.featured_image_url} alt="" fill sizes="48px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <HangerGlyph className="h-5 w-auto text-ink/20" />
                              </div>
                            )}
                          </div>
                          <span className="min-w-0 flex-1 truncate">
                            {item.product_name}{" "}
                            {(color || item.color_hex || size) && (
                              <span className="inline-flex items-center gap-1.5">
                                (
                                {item.color_hex && (
                                  <span
                                    className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                                    style={{ backgroundColor: item.color_hex }}
                                  />
                                )}
                                {color && <span>{color}</span>}
                                {color && size && <span className="text-ink/30">·</span>}
                                {size && <span>Size - {size}</span>}
                                )
                              </span>
                            )}{" "}
                            X{item.quantity}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {order.tracking_number && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl sm:rounded-2xl border border-gold-400/30 bg-gold-400/10 px-3.5 py-3 sm:px-4.5 sm:py-3.5">
                      <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-ink text-gold-300 shadow-sm">
                        <Truck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        {order.order_status !== "delivered" && (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-gold-700">
                          {order.courier_name || "Delhivery"} · {order.order_status === "delivered" ? "Delivered" : "On the way"}
                        </p>
                        <p className="truncate font-mono text-sm sm:text-base text-ink font-bold">{order.tracking_number}</p>
                      </div>
                      <a
                        href={order.tracking_url || `https://www.delhivery.com/track/package/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/35 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-gold-700 transition-all duration-300 hover:border-gold-400/60 hover:bg-gold-400/10 shadow-sm"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Track
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end border-t border-ink/10 pt-3.5">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group/link inline-flex items-center gap-1 text-sm sm:text-base font-extrabold uppercase tracking-widest text-gold-700 hover:text-gold-600 transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* My Profile Tab */}
      {activeTab === "profile" && (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">My Profile</h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-gold-400/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-700 transition-all duration-300 hover:border-gold-400/60 hover:bg-gold-400/20"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )}
          </div>
          <div className="card-panel p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-4 sm:gap-6 pb-6 border-b border-ink/10">
              <div className="flex h-14 w-14 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-full bg-ink text-gold-300 shadow-lg">
                <User className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-3xl font-black text-ink break-words">{profile?.full_name || "Sakpack Customer"}</p>
                <p className="text-xs sm:text-sm uppercase tracking-widest text-gold-700 mt-1 font-extrabold">Customer Account</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {editingProfile ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <ProfileEditForm profile={profile} onDone={() => setEditingProfile(false)} />
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-base sm:text-xl">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
                    <span className="text-ink/60 font-bold min-w-[70px]">Email:</span>
                    <span className="text-ink font-semibold break-all">{profile?.email || "—"}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-base sm:text-xl">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-gold-600 shrink-0" />
                    <span className="text-ink/60 font-bold min-w-[70px]">Phone:</span>
                    <span className="text-ink font-semibold break-all">{profile?.phone || "Not provided"}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
