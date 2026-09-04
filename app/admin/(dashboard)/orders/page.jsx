import Link from "next/link";
import { ShoppingCart, Clock, Truck, XCircle, Eye } from "lucide-react";
import { getAllOrdersAdmin } from "@/actions/admin/orders";

export const metadata = { title: "Orders" };

const STATUS_STYLES = {
  pending: "bg-ink/10 text-ink/70 border-ink/15",
  processing: "bg-gold-400/15 text-gold-700 border-gold-400/30",
  shipped: "bg-blue-400/15 text-blue-600 border-blue-400/20",
  delivered: "bg-green-400/15 text-green-600 border-green-400/20",
  cancelled: "bg-red-400/15 text-red-600 border-red-400/20",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const cancelledCount = orders.filter((o) => o.order_status === "cancelled").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart },
    { label: "Pending", value: pendingCount, icon: Clock },
    { label: "Shipped", value: shippedCount, icon: Truck },
    { label: "Cancelled", value: cancelledCount, icon: XCircle },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Order <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Management</span>
        </h1>
        <p className="text-base text-ink/60 font-semibold mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed so far.
        </p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3.5 rounded-2xl border border-gold-400/20 bg-white/85 px-4 py-3.5 shadow-xs"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/60 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-base font-semibold text-ink/50">No orders yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/20 text-xs uppercase tracking-widest text-ink/60 font-semibold">
                <th className="pb-4 font-semibold pl-2">Order</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold">Date</th>
                <th className="pb-4 font-semibold">Payment</th>
                <th className="pb-4 font-semibold">Total</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {orders.map((o) => (
                <tr key={o.id} className="group/row transition-colors duration-300 hover:bg-ink/[0.03]">
                  <td className="py-4 pr-4 pl-2">
                    <Link href={`/admin/orders/${o.id}`} className="text-sm font-semibold text-ink group-hover/row:text-gold-700 transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-xs font-semibold text-ink/70">{o.profiles?.full_name || o.profiles?.email || "—"}</td>
                  <td className="py-4 pr-4 text-xs font-semibold text-ink/50">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4 pr-4 text-xs font-semibold capitalize text-ink/70">
                    {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ink">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs font-semibold text-gold-700 transition-all duration-300 hover:border-gold-300/50 hover:bg-gold-400/20"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-base font-semibold text-ink/50">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block rounded-2xl border border-gold-400/20 bg-ink/[0.04] p-4 transition-colors hover:bg-gold-400/5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{o.order_number}</span>
                    <span className="text-sm font-semibold text-ink">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-ink/60">{o.profiles?.full_name || o.profiles?.email || "—"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                    <span className="rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-xs font-semibold capitalize text-ink/60">
                      {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-ink/40">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
