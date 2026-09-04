import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";
import Logo from "@/components/Logo";
import NewsletterForm from "@/components/NewsletterForm";
import { whatsappLink, settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";

export default async function Footer() {
  const dbSettings = (await getSiteSettings()) || {};
  const brandInfo = settingsToBrand(dbSettings);

  return (
    <footer className="bg-ivory border-t border-gold-400/20">
      {/* Top Newsletter Bar */}
      <div className="bg-[#f7f2ea] text-ink border-b border-ink/10">
        <div className="mx-auto flex max-w-wrap flex-col items-center gap-5 px-4 py-6 sm:py-8 text-center sm:flex-row sm:justify-between sm:text-left md:px-12">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            {/* Circular Gold Envelope Icon */}
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#caa14b] text-ink shadow-md p-2.5">
              <Mail className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-ink" strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-[0.15em] text-ink">
                Stay Updated
              </p>
              <p className="text-sm sm:text-base text-ink/85 mt-0.5 font-semibold max-w-lg">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main 4 Columns */}
      <div className="bg-[#f7f2ea] border-t border-ink/10">
        <div className="mx-auto max-w-wrap px-4 py-10 sm:py-12 md:py-16 md:px-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            
            {/* Column 1: Logo & Socials */}
            <div>
              <Logo theme="light" size="md" href="/" />
              <p className="mt-3 max-w-xs text-sm sm:text-sm font-medium leading-relaxed text-ink/85">
                Style, Comfort &amp; Confidence &mdash; Made for Every You.
              </p>

              {/* Dark Maroon Social Circles */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={brandInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory transition-all duration-300 hover:bg-gold-500 hover:text-ink shadow-sm"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={brandInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory transition-all duration-300 hover:bg-gold-500 hover:text-ink shadow-sm"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={whatsappLink("", brandInfo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory transition-all duration-300 hover:bg-gold-500 hover:text-ink shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 2: QUICK LINKS */}
            <div>
              <p className="font-display text-base sm:text-base font-extrabold uppercase tracking-[0.18em] text-ink mb-3">
                Quick Links
              </p>
              <ul className="space-y-2 text-sm sm:text-sm text-ink/85 font-medium">
                <li><Link href="/" className="transition-colors hover:text-gold-600">Home</Link></li>
                <li><Link href="/shop" className="transition-colors hover:text-gold-600">Shop</Link></li>
                <li><Link href="/shop?sort=newest" className="transition-colors hover:text-gold-600">New Arrivals</Link></li>
                <li><Link href="/shop?sort=popular" className="transition-colors hover:text-gold-600">Best Sellers</Link></li>
                <li><Link href="/about" className="transition-colors hover:text-gold-600">About Us</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-gold-600">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: CUSTOMER SERVICE */}
            <div>
              <p className="font-display text-base sm:text-base font-extrabold uppercase tracking-[0.18em] text-ink mb-3">
                Customer Service
              </p>
              <ul className="space-y-2 text-sm sm:text-sm text-ink/85 font-medium">
                <li><Link href="/account/orders" className="transition-colors hover:text-gold-600">Track Order</Link></li>
                <li><Link href="/policies/refund" className="transition-colors hover:text-gold-600">Returns &amp; Refunds</Link></li>
                <li><Link href="/policies/shipping" className="transition-colors hover:text-gold-600">Shipping Policy</Link></li>
                <li><Link href="/policies/privacy" className="transition-colors hover:text-gold-600">Privacy Policy</Link></li>
                <li><Link href="/policies/terms" className="transition-colors hover:text-gold-600">Terms &amp; Conditions</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-gold-600">FAQs</Link></li>
              </ul>
            </div>

            {/* Column 4: CONTACT US */}
            <div>
              <p className="font-display text-base sm:text-base font-extrabold uppercase tracking-[0.18em] text-ink mb-3">
                Contact Us
              </p>
              <ul className="space-y-3 text-sm sm:text-sm text-ink/85 font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-ink font-bold" />
                  <span>2012, Sector 23A, Near NIMS Hospital, Faridabad, Haryana 121005</span>
                </li>

                <li>
                  <a href={whatsappLink("", brandInfo)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-gold-600">
                    <Phone className="h-4 w-4 shrink-0 text-ink font-bold" />
                    <span>9582083441</span>
                  </a>
                </li>

                <li className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5 text-ink font-bold" />
                  <span>Mon &ndash; Sat: 10AM &ndash; 7PM<br />Sunday: Closed</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar (Dark Wine / Ink) */}
      <div className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-wrap flex-col items-center gap-2 px-4 py-3.5 text-center text-sm sm:text-sm text-ivory/85 font-medium sm:flex-row sm:justify-between md:px-12">
          <p>&copy; {new Date().getFullYear()} Sakpack India. All Rights Reserved.</p>
          <p>We deliver style, comfort &amp; confidence. <span className="text-gold-400">💛</span></p>
        </div>
      </div>
    </footer>
  );
}



