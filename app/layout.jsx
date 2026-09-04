import { Plus_Jakarta_Sans, Jost, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartDrawer from "@/components/CartDrawer";
import { BRAND } from "@/lib/constants";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import Script from "next/script";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakpack.in";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sakpack India | Premium Women's Handbags, Tote Bags & Accessories",
    template: "%s | Sakpack India",
  },
  description:
    "Explore Sakpack India for premium handcrafted women's handbags, luxury tote bags, shoulder bags, and fashion accessories. Elegant designs, soft durable fabrics, and 5–7 day express delivery across India.",
  keywords: [
    "Sakpack",
    "Sakpack India",
    "women's handbags",
    "tote bags",
    "luxury bags India",
    "shoulder bags",
    "handbags for women",
    "fashion accessories",
    "online handbag store India",
  ],
  authors: [{ name: "Sakpack India" }],
  creator: "Sakpack India",
  publisher: "Sakpack India",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Sakpack India | Premium Women's Handbags & Tote Bags",
    description:
      "Explore Sakpack India for premium handcrafted women's handbags, luxury tote bags, shoulder bags, and fashion accessories.",
    url: baseUrl,
    siteName: "Sakpack India",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Sakpack India Brand Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakpack India | Premium Women's Handbags & Tote Bags",
    description:
      "Explore Sakpack India for premium handcrafted women's handbags, luxury tote bags, and fashion accessories.",
    images: [`${baseUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sakpack India",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    "Premium handcrafted women's handbags, luxury tote bags, shoulder bags, and fashion accessories.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9582083441",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.instagram.com/sakpackindia",
    "https://www.facebook.com/people/Sakpack-India/61594175631081/",
    "https://youtube.com/@sakpackindia",
  ],
};

export default async function RootLayout({ children }) {
  const [quantityDiscount, bundleSettings] = await Promise.all([getQuantityDiscountSettings(), getBundleSettings()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3B35X4N265"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3B35X4N265');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer quantityDiscount={quantityDiscount} bundleSettings={bundleSettings} />
            <FloatingWhatsApp />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

