import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[85vh] items-center justify-center bg-ivory px-6 py-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[130px] animate-pulse-glow" />
          <div className="absolute -bottom-[10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-ink/5 blur-[130px]" />
        </div>

        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
