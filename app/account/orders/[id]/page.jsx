import { notFound } from "next/navigation";
import { splitVariantName } from "@/lib/variantDisplay";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HangerGlyph from "@/components/HangerGlyph";
import { createClient } from "@/lib/supabase/server";
import DelhiveryTracking from "./_components/DelhiveryTracking";

export const metadata = { title: "Order Details" };

const STATUS_STYLES = {
  pending: "text-ink/70 bg-ink/5 border-ink/15",
  processing: "text-gold-700 bg-gold-400/15 border-gold-400/35",
  shipped: "text-blue-600 bg-blue-500/15 border-blue-500/30",
  delivered: "text-emerald-600 bg-emerald-500/15 border-emerald-500/30",
  cancelled: "text-red-600 bg-red-500/15 border-red-500/30",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, bundle_discount, coupon_code, total_amount, payment_method, payment_status, order_status, created_at, razorpay_payment_id, tracking_number, courier_name, shipment_status, tracking_url, order_items ( id, product_name, variant_name, color_hex, quantity, line_total, products ( featured_image_url ) ), addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code )"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.addresses;
  const statusStyle = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-ivory pb-28 pt-8 sm:pt-14">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-ink/5 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
          <Link
            href="/account"
            className="group mb-6 sm:mb-8 inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-ink/60 transition-colors hover:text-gold-600"
          >
            <ArrowLeft className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-x-1" /> Back to My Account
          </Link>

          <Reveal className="mb-8 sm:mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-gold-400/15 pb-6 sm:pb-8">
            <div className="min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight break-words">
                Order{" "}
                <span className="text-transparent bg-clip-text bg-gold-gradient-text">
                  {order.order_number}
                </span>
              </h1>
              <p className="mt-2.5 text-base sm:text-lg text-ink/70 font-semibold">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest ${statusStyle}`}>
              {order.order_status}
            </span>
          </Reveal>

          <div className="space-y-6">
            {/* Items */}
            <Reveal className="card-panel p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-ink text-gold-300 shadow-md">
                  <Package className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">Items</h2>
              </div>
              <ul className="divide-y divide-ink/10">
                {order.order_items.map((item) => {
                  const { color, size } = splitVariantName(item.variant_name);
                  return (
                    <li key={item.id} className="flex items-center gap-3.5 py-4 text-base sm:text-lg">
                      <div className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border border-gold-400/25 bg-white shadow-inner">
                        {item.products?.featured_image_url ? (
                          <Image src={item.products.featured_image_url} alt="" fill sizes="72px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <HangerGlyph className="h-8 w-auto text-ink/20" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-ink font-bold">{item.product_name}</p>
                        <p className="flex flex-wrap items-center gap-1.5 text-ink/60 mt-1 text-sm sm:text-base font-semibold">
                          {item.color_hex && (
                            <span
                              className="h-5 w-5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                              style={{ backgroundColor: item.color_hex }}
                            />
                          )}
                          {color && <span>{color}</span>}
                          {color && size && <span className="text-ink/30">·</span>}
                          {size && <span>Size - {size} X{item.quantity}</span>}
                          {!size && <span>Qty {item.quantity}</span>}
                        </p>
                      </div>
                      <span className="shrink-0 text-base sm:text-xl font-extrabold text-gold-700">
                        ₹{Number(item.line_total).toLocaleString("en-IN")}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-2.5 border-t border-ink/10 pt-5 text-base sm:text-lg font-semibold">
                <div className="flex justify-between text-ink/60">
                  <span>Subtotal</span>
                  <span className="text-ink font-bold">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Shipping</span>
                  <span className="text-ink font-bold">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
                </div>
                {order.quantity_discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Bulk Discount</span>
                    <span>-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.coupon_discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span>-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.bundle_discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Bundle Discount</span>
                    <span>-₹{Number(order.bundle_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.quantity_discount === 0 && order.coupon_discount === 0 && order.bundle_discount === 0 && order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span>-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-ink/10 pt-4 font-display text-xl sm:text-2xl">
                  <span className="text-gold-700 font-extrabold">Total</span>
                  <span className="font-black text-ink">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Reveal>

            {/* Shipment Tracking */}
            {order.tracking_number && (
              <DelhiveryTracking
                orderId={order.id}
                trackingNumber={order.tracking_number}
                trackingUrl={order.tracking_url}
                courierName={order.courier_name}
                cachedStatus={order.shipment_status}
              />
            )}

            {/* Shipping Address */}
            {address && (
              <Reveal delay={80} className="card-panel p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-ink text-gold-300 shadow-md">
                    <MapPin className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">Shipping Address</h2>
                </div>
                <p className="text-base sm:text-xl text-ink font-bold">
                  {address.full_name} · {address.phone}
                </p>
                <p className="text-base sm:text-lg text-ink/70 mt-2 font-medium">
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                </p>
                <p className="text-base sm:text-lg text-ink/70 font-medium">
                  {address.city}, {address.state} {address.postal_code}
                </p>
              </Reveal>
            )}

            {/* Payment */}
            <Reveal delay={160} className="card-panel p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-ink text-gold-300 shadow-md">
                  <CreditCard className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">Payment</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-base sm:text-lg font-semibold">
                <span className="text-ink/60 font-bold">Method:</span>
                <span className="text-ink font-bold">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
                </span>
                <span className="text-ink/20 hidden sm:inline">|</span>
                <span className="text-ink/60 font-bold">Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm sm:text-base font-extrabold capitalize ${order.payment_status === "paid"
                    ? "text-emerald-600 bg-emerald-500/15 border-emerald-500/30"
                    : order.payment_status === "failed"
                      ? "text-red-600 bg-red-500/15 border-red-500/30"
                      : "text-ink/70 bg-ink/5 border-ink/15"
                    }`}
                >
                  {order.payment_status === "paid" && <CheckCircle2 className="h-4 w-4" />}
                  {order.payment_status}
                </span>
              </div>
              {order.payment_method === "RAZORPAY" && order.razorpay_payment_id && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/50">Payment ID</span>
                  <span className="font-mono text-sm sm:text-base text-ink/80 select-all font-semibold">{order.razorpay_payment_id}</span>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
