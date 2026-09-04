import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { getOrderById } from "@/actions/admin/orders";
import OrderStatusManager from "./_components/OrderStatusManager";
import DelhiveryShipmentManager from "./_components/DelhiveryShipmentManager";
import HangerGlyph from "@/components/HangerGlyph";
import { splitVariantName } from "@/lib/variantDisplay";

export const metadata = { title: "Order Detail" };

const panelClass =
  "rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md md:p-8";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.addresses;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-5 inline-flex items-center gap-2 text-base sm:text-lg font-bold text-ink/60 transition-colors hover:text-gold-600"
      >
        <ArrowLeft className="h-4.5 w-4.5" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Order <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{order.order_number}</span>
          </h1>
          <p className="mt-1.5 text-base sm:text-lg text-ink/70 font-semibold">Placed {new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20 shadow-sm">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink">Items</h2>
            </div>
            <ul className="mt-4 divide-y divide-gold-400/10">
              {order.order_items.map((item) => {
                const { color, size } = splitVariantName(item.variant_name);
                return (
                <li key={item.id} className="flex items-center gap-3.5 py-4 text-base sm:text-lg font-bold">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gold-400/25 bg-white shadow-inner">
                    {item.products?.featured_image_url ? (
                      <Image src={item.products.featured_image_url} alt="" fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <HangerGlyph className="h-7 w-auto text-ink/20" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-ink font-bold text-base sm:text-lg">{item.product_name}</p>
                    <p className="flex flex-wrap items-center gap-2 text-ink/60 font-semibold text-sm sm:text-base mt-1">
                      {item.color_hex && (
                        <span
                          className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                          style={{ backgroundColor: item.color_hex }}
                          title={item.color_hex}
                        />
                      )}
                      {color && <span>{color}</span>}
                      {color && size && <span className="text-ink/30">·</span>}
                      <span>Size - {size || item.variant_name} X{item.quantity}</span>
                    </p>
                  </div>
                  <span className="shrink-0 font-extrabold text-gold-700 text-base sm:text-lg">₹{Number(item.line_total).toLocaleString("en-IN")}</span>
                </li>
                );
              })}
            </ul>
            <div className="mt-5 space-y-2 border-t border-gold-400/20 pt-5 text-base sm:text-lg font-semibold">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span className="text-ink font-bold">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Shipping</span>
                <span className="text-ink font-bold">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
              </div>
              {order.quantity_discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-extrabold">
                  <span>Bulk Discount</span>
                  <span>-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-extrabold">
                  <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.bundle_discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-extrabold">
                  <span>Bundle Discount</span>
                  <span>-₹{Number(order.bundle_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.quantity_discount === 0 && order.coupon_discount === 0 && order.bundle_discount === 0 && order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-extrabold">
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gold-400/20 pt-3 font-display text-xl sm:text-2xl font-extrabold text-ink">
                <span>Total</span>
                <span className="text-gold-700 font-black">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink">Customer &amp; Shipping</h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 text-base sm:text-lg font-medium sm:grid-cols-2">
              <div>
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/50">Customer</p>
                <p className="mt-1.5 text-ink font-bold text-base sm:text-xl">{order.profiles?.full_name}</p>
                <p className="text-ink/70 font-semibold mt-0.5">{order.profiles?.email}</p>
                <p className="text-ink/70 font-semibold mt-0.5">{order.profiles?.phone}</p>
              </div>
              {address && (
                <div>
                  <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/50">Shipping Address</p>
                  <p className="mt-1.5 text-ink font-bold text-base sm:text-xl">{address.full_name} · {address.phone}</p>
                  <p className="text-ink/70 font-semibold mt-0.5">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</p>
                  <p className="text-ink/70 font-semibold mt-0.5">{address.city}, {address.state} {address.postal_code}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${panelClass} h-fit min-w-0`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20 shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink">Manage Status</h2>
          </div>
          <OrderStatusManager order={order} />
          <p className="mt-5 text-base sm:text-lg font-semibold text-ink/70">
            Payment method: <span className="text-ink font-bold">{order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}</span>
          </p>
          {order.payment_method === "RAZORPAY" && order.razorpay_payment_id && (
            <div className="mt-4 border-t border-gold-400/20 pt-4 text-sm sm:text-base font-semibold">
              <span className="block text-ink/50 uppercase tracking-wider font-extrabold">Razorpay Payment ID</span>
              <span className="font-mono text-ink font-bold select-all">{order.razorpay_payment_id}</span>
            </div>
          )}
          <DelhiveryShipmentManager order={order} />
        </div>
      </div>
    </div>
  );
}
