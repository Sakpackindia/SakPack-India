import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactContent from "./_components/ContactContent";

export const metadata = {
  title: "Contact Us | Sakpack India",
  description: "Get in touch with Sakpack India for sizing help, gifting options, and order support.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-ivory pb-24 pt-10 text-ink selection:bg-gold-400/30 selection:text-ink sm:pt-14">
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}



