"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Copy, Check, ChevronDown, Clock, ArrowUpRight, Instagram, Facebook, Youtube, Sparkles, MapPin, Navigation, ShieldCheck, Truck, Headphones } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "Can I get help choosing the right size?",
    a: "Yes, we can help! Just tell us your usual size and measurements on WhatsApp or via the form, and we will suggest the best fit for you.",
  },
  {
    q: "How fast do you ship orders across India?",
    a: "We ship all orders within 24 hours. Delivery usually takes 2 to 5 business days depending on your city.",
  },
  {
    q: "Do you offer bulk or corporate gifting?",
    a: "Yes, we do. We offer custom gift packs for weddings, corporate events, and parties. Contact us via the form or WhatsApp for bulk pricing.",
  },
  {
    q: "Can I exchange a product for a different size?",
    a: "Yes — unused items in original condition with tags can be exchanged for a different size within 7 days of delivery.",
  },
];

export default function ContactContent() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyAddress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(BRAND.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.238491823902!2d77.3054!3d28.3750!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdc7e937d2f9b%3A0x6b77ad59403d1544!2sSector%2023A%2C%20Faridabad%2C%20Haryana%20121005!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

  return (
    <div className="relative mx-auto max-w-wrap px-3 sm:px-6 md:px-12">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-10 h-[500px] w-[500px] rounded-full bg-gold-400/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -right-24 top-[40%] h-[600px] w-[600px] rounded-full bg-ink/10 blur-[140px]"
        />
      </div>

      {/* Hero Header */}
      <div className="relative mx-auto mb-8 sm:mb-16 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3.5 sm:mb-4 inline-flex items-center justify-center gap-2 sm:gap-6 max-w-full"
        >
          <span className="h-[1.5px] w-4 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gold-400/40 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-md text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] text-ink">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live Customer Support &bull; Replies in &lt; 2 Hours
          </span>
          <span className="h-[1.5px] w-4 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl font-black uppercase tracking-tight text-ink sm:text-6xl lg:text-7xl leading-tight"
        >
          Get In <span className="text-gold-600 font-black">Touch</span> With Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-3.5 sm:mt-4 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-ink/80"
        >
          Have questions about sizing, orders, or custom gifting? We are always here to assist you.
        </motion.p>
      </div>

      {/* Main Grid Section: Form on LEFT, Channels on RIGHT */}
      <div className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <ContactForm />
        </motion.div>

        {/* Right Column: Direct Channels & Information */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="h-full"
          >
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/30 bg-white/95 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-gold-500 hover:shadow-gold">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4 sm:items-center">
                  <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-ink/10 text-gold-600 shadow-inner transition-transform duration-500 group-hover:scale-110">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-600">
                      Email Support
                    </span>
                    <p className="font-display mt-0.5 text-base sm:text-lg font-bold text-ink transition-colors group-hover:text-gold-700 break-all">
                      {BRAND.email}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyEmail}
                  title="Copy Email"
                  className="shrink-0 rounded-xl border border-gold-400/30 bg-ivory p-2 text-ink/70 transition-all hover:border-gold-500 hover:text-gold-700"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </motion.button>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-gold-400/20 pt-3.5 sm:pt-4 text-xs sm:text-sm text-ink/80 font-medium">
                <span>Direct inquiries</span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex items-center gap-1 font-bold text-gold-600 transition-colors hover:text-gold-700"
                >
                  Send email <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="h-full"
          >
            <a
              href={whatsappLink("Hi Sakpack India, I would like to inquire about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-emerald-50/80 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4 sm:items-center">
                  <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/15 text-emerald-700 shadow-inner transition-transform duration-500 group-hover:scale-110">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
                      WhatsApp Support
                    </span>
                    <p className="font-display mt-0.5 text-base sm:text-lg font-bold text-ink transition-colors group-hover:text-emerald-800 break-all">
                      {BRAND.whatsappDisplay}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-700 transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-emerald-500/20 pt-3.5 sm:pt-4 text-xs sm:text-sm text-ink/80 font-medium">
                <span>Instant chat response</span>
                <span className="font-bold text-emerald-700 transition-colors group-hover:underline">Chat Now</span>
              </div>
            </a>
          </motion.div>

          {/* Business Hours Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="h-full"
          >
            <div className="flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-gold-400/30 bg-white/95 p-5 sm:p-7 shadow-xl backdrop-blur-md transition-all duration-500 hover:border-gold-500">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-ink/10 text-gold-600 shadow-inner">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-600">
                    Operating Hours
                  </span>
                  <p className="font-display mt-0.5 text-base sm:text-lg font-bold text-ink">Mon &ndash; Sat, 10 AM &ndash; 7 PM IST</p>
                </div>
              </div>
              <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm leading-relaxed text-ink/80 font-medium">
                Sunday Support: Active on WhatsApp for urgent order inquiries.
              </p>
            </div>
          </motion.div>

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-gold-400/30 bg-white/95 p-5 sm:p-6 shadow-xl backdrop-blur-md"
          >
            <span className="mb-3 block text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-600">
              Connect With Us
            </span>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: BRAND.instagram, label: "Instagram" },
                { icon: Facebook, href: BRAND.facebook, label: "Facebook" },
                { icon: Youtube, href: BRAND.youtube, label: "YouTube" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-gold-400/30 bg-ivory text-ink shadow-sm transition-all hover:border-gold-500 hover:bg-gold-gradient hover:text-ink"
                >
                  <s.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Google Maps Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-12 sm:mt-24"
      >
        <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/90 px-4 py-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-gold-600 shadow-md">
            <MapPin className="h-3.5 w-3.5 text-gold-600" /> Head Office &amp; Distribution
          </span>
          <h2 className="mt-2.5 font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink">
            Visit Our Store Location
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-ink/80 font-medium max-w-md">
            Located in Faridabad, Haryana &mdash; delivering style, comfort &amp; confidence across India.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-gold-400/35 bg-white shadow-2xl backdrop-blur-md">
          {/* Map Iframe */}
          <div className="relative h-[300px] sm:h-[480px] w-full">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sakpack India Location Map"
              className="h-full w-full"
            />
          </div>

          {/* Location Overlay Card */}
          <div className="relative sm:absolute sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md border-t sm:border border-gold-400/30 bg-white/95 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold-600">
                  Sakpack India Headquarters
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink mt-0.5">
                  Faridabad, Haryana
                </h3>
                <p className="mt-1 text-sm sm:text-base text-ink/80 font-medium leading-relaxed">
                  {BRAND.address}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyAddress}
                title="Copy Address"
                className="shrink-0 rounded-xl border border-gold-400/30 bg-ivory p-2 text-ink/70 transition-all hover:border-gold-500 hover:text-gold-700"
              >
                {copiedAddress ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </motion.button>
            </div>

            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gold-400/20 pt-3 sm:pt-4">
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Dispatch Center Open
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold group px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md"
              >
                Get Directions
                <Navigation className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges Strip */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-6">
        <div className="flex items-center gap-3.5 rounded-2xl sm:rounded-3xl border border-gold-400/25 bg-white/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-700">
            <Truck className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-ink uppercase tracking-wider">Fast Pan-India Delivery</h4>
            <p className="text-xs sm:text-sm text-ink/75 font-medium">Dispatched within 24 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl sm:rounded-3xl border border-gold-400/25 bg-white/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-700">
            <ShieldCheck className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-ink uppercase tracking-wider">100% Quality Assurance</h4>
            <p className="text-xs sm:text-sm text-ink/75 font-medium">Personally inspected fit &amp; fabric</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl sm:rounded-3xl border border-gold-400/25 bg-white/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-700">
            <Headphones className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-ink uppercase tracking-wider">Dedicated Support</h4>
            <p className="text-xs sm:text-sm text-ink/75 font-medium">WhatsApp &amp; Email assistance</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative mt-16 sm:mt-28 border-t border-gold-400/30 pt-12 sm:pt-20">
        {/* Background Radial Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />

        <Reveal className="mx-auto mb-10 sm:mb-16 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-6 mb-2.5">
            <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
            <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-gold-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> FREQUENTLY ASKED QUESTIONS
            </span>
            <span className="h-[1.5px] w-6 sm:w-20 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink">
            Everything You Need To Know
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-ink/80 font-medium">
            Got questions about sizing, delivery, or exchanges? We&apos;ve got quick answers for you.
          </p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-gold-400 bg-white shadow-xl shadow-gold/10"
                    : "border-gold-400/30 bg-white/90 hover:border-gold-400/60 shadow-md backdrop-blur-md"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-6 text-left transition-colors"
                >
                  <div className="flex items-center gap-3 pr-3">
                    {/* Number Badge */}
                    <span className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/15 text-xs sm:text-sm font-extrabold text-gold-700">
                      0{idx + 1}
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold text-ink">
                      {faq.q}
                    </span>
                  </div>

                  <span className={`flex h-7.5 w-7.5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen ? "border-gold-500 bg-gold-500 text-ink rotate-180" : "border-gold-400/30 bg-ivory text-gold-600"
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-gold-400/20 px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4"
                    >
                      <div className="border-l-2 border-gold-400 pl-3 sm:pl-4 text-sm sm:text-base font-medium leading-relaxed text-ink/80">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



