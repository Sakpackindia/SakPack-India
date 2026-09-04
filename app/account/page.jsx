import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";
import AccountTabs from "./_components/AccountTabs";
import AccountHero from "./_components/AccountHero";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, created_at, tracking_number, tracking_url, courier_name, order_items ( product_name, variant_name, color_hex, quantity, products ( featured_image_url ) )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-ivory pb-24 pt-8 sm:pt-14">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-300/15 blur-[150px]" />
          <div className="absolute bottom-[5%] left-[15%] w-[450px] h-[450px] rounded-full bg-ink/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
          <AccountHero profile={profile} orderCount={orders?.length || 0} logoutAction={logout} />

          <AccountTabs profile={profile} orders={orders} />
        </div>
      </main>
      <Footer />
    </>
  );
}
