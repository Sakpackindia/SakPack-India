import Link from "next/link";
import { XCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import OrderConfirmation from "../_components/OrderConfirmation";
import ClearCartOnSuccess from "../_components/ClearCartOnSuccess";

export const metadata = { title: "Order Status" };

export default async function CheckoutCompletePage({ searchParams }) {
  const { order: orderNumber } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let order = null;
  if (user && orderNumber) {
    const { data } = await supabase
      .from("orders")
      .select("order_number, payment_status, payu_payment_id")
      .eq("order_number", orderNumber)
      .eq("user_id", user.id)
      .maybeSingle();
    order = data;
  }

  const isPaid = order?.payment_status === "paid";

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-ivory via-white to-ivory pb-12 pt-6 sm:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.08)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {isPaid ? (
            <>
              <ClearCartOnSuccess />
              <OrderConfirmation orderNumber={order.order_number} paymentId={order.payu_payment_id} />
            </>
          ) : (
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-red-400/30 bg-white p-5 sm:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <XCircle className="h-7 w-7" strokeWidth={2} />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink leading-tight">
                Payment Not Completed
              </h2>
              <p className="mt-3.5 text-base sm:text-lg text-ink/70 font-semibold max-w-sm mx-auto leading-relaxed">
                {order
                  ? "Your payment didn't go through. No amount has been charged for this order. Please try again."
                  : "We couldn't find this order, or you're not signed in to the account that placed it."}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/checkout" className="w-full sm:w-auto rounded-full bg-ink px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-gold-300 shadow-md hover:bg-gold-400 hover:text-ink transition-all whitespace-nowrap">
                  Try Again
                </Link>
                <Link href="/account" className="w-full sm:w-auto rounded-full border border-gold-400/40 bg-white px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-ink hover:border-gold-400 hover:bg-gold-400/10 transition-all whitespace-nowrap">
                  View My Orders
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
