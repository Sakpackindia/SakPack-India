"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banknote, CreditCard } from "lucide-react";
import { splitVariantName } from "@/lib/variantDisplay";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { processCheckout, validateCoupon } from "@/actions/checkout";
import { calculateQuantityDiscount, calculateBundleDiscount, nonBundleCartQuantity } from "@/lib/constants";
import OrderConfirmation from "./OrderConfirmation";

const inputClass =
  "w-full rounded-2xl border border-gold-400/35 bg-white/95 px-4 sm:px-5 py-3.5 text-base sm:text-lg font-bold text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20 hover:border-gold-400/60 shadow-sm";
const labelClass = "mb-1.5 block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/80";

export default function CheckoutForm({ codEnabled, payuEnabled, shipping, quantityDiscount, bundleSettings }) {
  const { cart, cartSubtotal, cartCount, clearCart, updateQuantity, appliedCoupon, applyCouponCode, removeCoupon } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(codEnabled ? "COD" : payuEnabled ? "PAYU" : null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errors, setErrors] = useState({});

  const shippingCost = cartSubtotal >= shipping.free_threshold ? 0 : shipping.flat_rate;
  const codCost = paymentMethod === "COD" ? shipping.cod_charge : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const nonBundleQty = nonBundleCartQuantity(cart);
  const qtyDiscount = calculateQuantityDiscount(nonBundleQty, quantityDiscount);
  const bundleDiscount = calculateBundleDiscount(cart, bundleSettings);
  const total = Math.max(0, cartSubtotal + shippingCost + codCost - couponDiscount - qtyDiscount - bundleDiscount);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setApplyingCoupon(true);
    const result = await applyCouponCode(couponInput);
    setApplyingCoupon(false);
    if (!result.success) {
      showToast(result.error || "Invalid coupon.", "error");
      return;
    }
    showToast("Coupon applied!");
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!form.fullName || form.fullName.trim().length < 3 || !/^[a-zA-Z\s]*$/.test(form.fullName)) {
      tempErrors.fullName = "Name must only contain letters and spaces (min. 3 characters).";
    }
    if (!form.phone || !/^[6-9][0-9]{9}$/.test(form.phone)) {
      tempErrors.phone = "Enter a valid 10-digit Indian phone number.";
    }
    if (!form.addressLine1 || form.addressLine1.trim() === "") {
      tempErrors.addressLine1 = "Address is required.";
    }
    if (!form.city || form.city.trim() === "") {
      tempErrors.city = "City is required.";
    }
    if (!form.state || form.state.trim() === "") {
      tempErrors.state = "State is required.";
    }
    if (!form.postalCode || !/^[0-9]{6}$/.test(form.postalCode)) {
      tempErrors.postalCode = "Enter a valid 6-digit postal code.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((err) => ({ ...err, [key]: "" }));
    }
  };

  const cartForServer = () =>
    cart.map((i) => ({
      variantId: i.variantId,
      productId: i.productId,
      name: i.name,
      variantName: i.variantName,
      colorHex: i.colorHex,
      price: i.price,
      quantity: i.quantity,
      bundleGroupId: i.bundleGroupId,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!paymentMethod) {
      showToast("No payment method is available right now.", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setSubmitting(true);
    const result = await processCheckout(form, cartForServer(), paymentMethod, appliedCoupon?.code);
    setSubmitting(false);

    if (!result.success) {
      showToast(result.error || "Something went wrong. Please try again.", "error");
      return;
    }

    if (result.isPayu) {
      openPayu(result);
      return;
    }

    clearCart();
    setConfirmedOrder({ orderNumber: result.orderNumber });
  };

  const openPayu = (result) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.payuActionUrl;

    Object.entries(result.payuFields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  if (confirmedOrder) {
    return <OrderConfirmation orderNumber={confirmedOrder.orderNumber} paymentId={confirmedOrder.paymentId} />;
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gold-400/40 bg-white/60 py-20 text-center px-4 backdrop-blur-md">
        <p className="font-display text-2xl sm:text-3xl font-black uppercase text-ink">Your bag is empty</p>
        <p className="mt-2 text-base sm:text-lg text-ink/70 font-semibold">Add some items before checking out.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-ink px-8 py-3.5 text-base sm:text-lg font-black uppercase tracking-widest text-gold-300 shadow-md hover:bg-gold-400 hover:text-ink transition-all">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="relative overflow-hidden rounded-3xl border border-gold-400/35 bg-white p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4 mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm sm:text-base font-black text-gold-300 shadow-md ring-1 ring-gold-400/40">
                  1
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-ink">
                  Shipping Address
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                Fast Dispatch
              </span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={form.fullName}
                    onChange={update("fullName")}
                    minLength={3}
                    className={inputClass}
                  />
                  {errors.fullName && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={update("phone")}
                    maxLength={10}
                    className={inputClass}
                  />
                  {errors.phone && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Address Line 1 *</label>
                <input required placeholder="Flat, House no., Building, Street, Area" value={form.addressLine1} onChange={update("addressLine1")} className={inputClass} />
                {errors.addressLine1 && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className={labelClass}>Address Line 2 (Optional)</label>
                <input placeholder="Landmark, Suite, Unit, etc." value={form.addressLine2} onChange={update("addressLine2")} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>City *</label>
                  <input required placeholder="e.g. Mumbai" value={form.city} onChange={update("city")} className={inputClass} />
                  {errors.city && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <input required placeholder="e.g. Maharashtra" value={form.state} onChange={update("state")} className={inputClass} />
                  {errors.state && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.state}</p>}
                </div>
                <div>
                  <label className={labelClass}>PIN Code *</label>
                  <input
                    required
                    placeholder="6-digit PIN code"
                    value={form.postalCode}
                    onChange={update("postalCode")}
                    maxLength={6}
                    className={inputClass}
                  />
                  {errors.postalCode && <p className="text-rose-600 text-sm font-bold mt-1.5 animate-fadeUp">{errors.postalCode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="relative overflow-hidden rounded-3xl border border-gold-400/35 bg-white p-5 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-400/20 pb-4 mb-5 sm:mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm sm:text-base font-black text-gold-300 shadow-md ring-1 ring-gold-400/40">
                  2
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-ink">
                  Payment Method
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-gold-700 uppercase tracking-wider bg-gold-400/15 border border-gold-400/35 px-3 py-1 rounded-full shadow-xs">
                🔒 100% Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {codEnabled && (
                <label
                  className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
                    paymentMethod === "COD"
                      ? "border-gold-500 bg-gold-400/15 shadow-md ring-2 ring-gold-400/30"
                      : "border-gold-400/30 bg-ivory/40 hover:border-gold-400/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="sr-only"
                  />

                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    paymentMethod === "COD" ? "border-gold-600 bg-gold-600 shadow-sm" : "border-ink/30 bg-white"
                  }`}>
                    <div className={`h-2 w-2 rounded-full bg-white transition-transform duration-300 ${paymentMethod === "COD" ? "scale-100" : "scale-0"}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <Banknote className={`h-5 w-5 shrink-0 ${paymentMethod === "COD" ? "text-gold-700" : "text-ink/60"}`} />
                        <span className="font-display text-base font-black uppercase tracking-wider text-ink">Cash on Delivery</span>
                      </div>
                      <span className="self-start sm:self-auto text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full shrink-0">
                        +₹{shipping.cod_charge} COD Fee
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-ink/75 font-medium leading-relaxed">
                      Pay cash upon delivery. Nominal ₹{shipping.cod_charge} COD handling &amp; verification fee applies.
                    </p>
                  </div>
                </label>
              )}

              {payuEnabled && (
                <label
                  className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
                    paymentMethod === "PAYU"
                      ? "border-gold-500 bg-gold-400/15 shadow-md ring-2 ring-gold-400/30"
                      : "border-gold-400/30 bg-ivory/40 hover:border-gold-400/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === "PAYU"}
                    onChange={() => setPaymentMethod("PAYU")}
                    className="sr-only"
                  />

                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    paymentMethod === "PAYU" ? "border-gold-600 bg-gold-600 shadow-sm" : "border-ink/30 bg-white"
                  }`}>
                    <div className={`h-2 w-2 rounded-full bg-white transition-transform duration-300 ${paymentMethod === "PAYU" ? "scale-100" : "scale-0"}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className={`h-5 w-5 shrink-0 ${paymentMethod === "PAYU" ? "text-gold-700" : "text-ink/60"}`} />
                        <span className="font-display text-base font-black uppercase tracking-wider text-ink">Pay Online</span>
                      </div>
                      <span className="self-start sm:self-auto text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-400/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full shrink-0">
                        Fastest
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-ink/75 font-medium leading-relaxed">
                      Instant &amp; secure payment via UPI (GPay, PhonePe, Paytm), Cards &amp; Netbanking.
                    </p>
                  </div>
                </label>
              )}
            </div>


            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !paymentMethod}
              className="mt-6 sm:mt-8 w-full rounded-full bg-ink py-4 sm:py-4.5 text-base sm:text-lg font-black uppercase tracking-widest text-gold-300 shadow-xl transition-all duration-300 hover:bg-gold-400 hover:text-ink disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-300 border-t-transparent" />
                  Processing Order…
                </span>
              ) : (
                `Place Order — ₹${total.toLocaleString("en-IN")}`
              )}
            </motion.button>
          </div>
        </form>

        {/* Right Side: Order Summary */}
        <div className="h-fit rounded-3xl border border-gold-400/35 bg-white p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] backdrop-blur-md space-y-4 sm:space-y-5">
          <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-ink border-b border-gold-400/20 pb-3">
            Order Summary ({cartCount} {cartCount === 1 ? "item" : "items"})
          </h2>

          <ul className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <li key={item.variantId} className="flex gap-3.5 items-center pb-3.5 border-b border-gold-400/15 last:border-b-0 last:pb-0">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-2xl border border-gold-400/30 bg-ivory shadow-inner">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover object-top"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-base sm:text-lg font-bold text-ink">{item.name}</h4>
                  {item.variantName && (() => {
                    const { color, size } = splitVariantName(item.variantName);
                    return (
                      <span className="inline-flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-700">
                        {item.colorHex && (
                          <span
                            className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 rounded-full border-2 border-gold-400/40 shadow-sm"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        {color && <span>{color}</span>}
                        {color && size && <span className="text-gold-700/40">·</span>}
                        {size && <span>Size - {size}</span>}
                        {!color && !size && <span>{item.variantName}</span>}
                      </span>
                    );
                  })()}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm sm:text-base font-semibold text-ink/75">Qty: {item.quantity}</span>
                    <span className="text-base sm:text-lg font-black text-ink">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-gold-400/20 pt-4 text-base sm:text-lg font-semibold text-ink/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-ink">₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-ink">{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
            </div>
            {codCost > 0 && (
              <div className="flex justify-between">
                <span>COD Charge</span>
                <span className="font-bold text-ink">₹{codCost}</span>
              </div>
            )}
            {qtyDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-extrabold">
                <span>Bulk Savings</span>
                <span>-₹{qtyDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-extrabold">
                <span>Bundle Savings</span>
                <span>-₹{bundleDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-extrabold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-gold-400/20 pt-3 text-lg sm:text-xl font-black text-ink uppercase tracking-wider">
              <span className="text-gold-700">Total Payable</span>
              <span className="font-display font-black text-ink">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50 px-4 py-2.5 shadow-sm text-sm sm:text-base font-extrabold text-emerald-700">
              <span>✓ Coupon {appliedCoupon.code} Applied</span>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-500 hover:text-red-700 underline ml-2"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2 border-t border-gold-400/20 pt-4">
              <input
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="min-w-0 flex-1 rounded-full border border-gold-400/35 bg-white px-4 py-2.5 text-sm sm:text-base font-bold text-ink placeholder:text-ink/40 transition-all focus:border-gold-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon || !couponInput}
                className="rounded-full bg-ink px-5 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-300 hover:bg-gold-400 hover:text-ink disabled:opacity-50 transition-all"
              >
                {applyingCoupon ? "Checking…" : "Apply"}
              </button>
            </div>
          )}

          {/* Sakpack Luxury Assurance Box */}
          <div className="mt-4 rounded-2xl border border-gold-400/25 bg-gold-400/5 p-4 space-y-2.5 text-sm sm:text-base text-ink/80 font-semibold">
            <div className="flex items-center gap-2.5 font-bold text-ink">
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
              <span>Sakpack Promise</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-ink/75">
              <li className="flex items-center gap-2">
                <span className="text-gold-600 font-extrabold">✓</span> Express 5-7 Day All-India Delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-600 font-extrabold">✓</span> 100% Quality &amp; Fit Guarantee
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
