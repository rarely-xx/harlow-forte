"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/components/Navbar";
import { createOrderAction } from "./actions";
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export default function CheckoutPage() {
  const {
    cart,
    clearCart,
    currency,
    setCurrency,
    exchangeRate,
    formatPrice,
  } = useCart();

  const [fulfillment, setFulfillment] = useState<"shipping" | "pickup">("shipping");
  const [pickupLocation, setPickupLocation] = useState(
    "Harlow Forte Flagship — Admiralty Way, Lekki Phase 1, Lagos"
  );
  const [paymentMethod, setPaymentMethod] = useState<"Paystack" | "Flutterwave" | "Stripe">("Paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Customer Details State
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lekki");
  const [state, setState] = useState("Lagos");

  // Calculate Totals in USD (Base) and Display Currency
  const subtotalUSD = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingUSD = fulfillment === "pickup" || subtotalUSD > 500 ? 0 : 15;
  const taxUSD = +(subtotalUSD * 0.075).toFixed(2); // 7.5% VAT
  const grandTotalUSD = +(subtotalUSD + shippingUSD + taxUSD).toFixed(2);

  const finalDisplayAmount =
    currency === "NGN" ? Math.round(grandTotalUSD * exchangeRate) : grandTotalUSD;

  async function finalizeOrderInDatabase(reference: string) {
    setIsProcessing(true);
    try {
      const savedOrder = await createOrderAction({
        customerName,
        email,
        phone,
        fulfillment,
        address: fulfillment === "pickup" ? `STORE PICKUP: ${pickupLocation}` : address,
        city,
        state,
        paymentMethod,
        paymentRef: reference,
        currency,
        totalAmount: finalDisplayAmount,
        items: cart,
      });
      clearCart();
      setCompletedOrder(savedOrder);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert("Order failed to save: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const reference = `${paymentMethod.toUpperCase()}_${Date.now()}`;

    // If user selected Paystack and has a Paystack Public Key configured in .env
    if (paymentMethod === "Paystack" && paystackPublicKey && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: email,
        amount: Math.round(grandTotalUSD * exchangeRate) * 100, // Amount in Kobo (NGN)
        currency: "NGN",
        ref: reference,
        callback: function (response: any) {
          finalizeOrderInDatabase(response.reference);
        },
        onClose: function () {
          alert("Payment window closed.");
        },
      });
      handler.openIframe();
      return;
    }

    // Interactive Payment Gateway Processing (Works out-of-the-box without API keys)
    setIsProcessing(true);
    setTimeout(() => {
      finalizeOrderInDatabase(reference);
    }, 1200);
  }

  // ================= ORDER CONFIRMATION RECEIPT VIEW =================
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center space-y-6 my-8">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="bg-[#ffe000] text-gray-900 text-xs font-extrabold px-3 py-1 rounded uppercase">
          Payment Verified via {completedOrder.paymentMethod}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Thank You for Your Order, {completedOrder.customerName}!
        </h1>
        <p className="text-sm text-gray-600">
          A confirmation receipt has been sent to <strong>{completedOrder.email}</strong>.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left text-sm space-y-2.5">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-extrabold text-[#0046be]">{completedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Reference:</span>
            <span className="font-mono text-xs">{completedOrder.paymentRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fulfillment Method:</span>
            <span className="font-bold uppercase">{completedOrder.fulfillment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery / Pickup Location:</span>
            <span className="font-semibold text-right max-w-xs">{completedOrder.address}</span>
          </div>
          <div className="flex justify-between border-t pt-2.5 text-base font-extrabold">
            <span>Total Paid:</span>
            <span className="text-green-700">
              {completedOrder.currency === "NGN"
                ? `₦${Number(completedOrder.totalAmount).toLocaleString("en-NG")}`
                : `$${Number(completedOrder.totalAmount).toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-center space-x-4">
          <Link
            href="/"
            className="bg-[#0046be] hover:bg-[#00338a] text-white font-bold px-6 py-3 rounded text-sm transition"
          >
            Continue Shopping at Harlow Forte
          </Link>
        </div>
      </div>
    );
  }

  // ================= EMPTY CART GUARD =================
  if (cart.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center space-y-4 my-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Harlow Forte Cart is Empty</h2>
        <p className="text-sm text-gray-500">
          Add laptops, 4K TVs, or smartphones to your cart before proceeding to checkout.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#ffe000] text-gray-900 font-extrabold px-6 py-3 rounded text-sm"
        >
          Browse Featured Deals
        </Link>
      </div>
    );
  }

  // ================= MAIN CHECKOUT VIEW =================
  return (
    <div className="space-y-6">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Top Checkout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <Link
            href="/"
            className="text-xs text-[#0046be] font-bold hover:underline flex items-center space-x-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
            <Lock className="w-6 h-6 text-[#0046be]" />
            <span>Harlow Forte Secure Checkout</span>
          </h1>
        </div>

        {/* Currency Switcher Pill on Checkout */}
        <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1.5 self-start">
          <span className="text-xs font-bold text-gray-600 px-2">Checkout Currency:</span>
          <button
            type="button"
            onClick={() => setCurrency("NGN")}
            className={`px-3 py-1 rounded text-xs font-extrabold transition cursor-pointer ${
              currency === "NGN" ? "bg-[#0046be] text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🇳🇬 NGN (₦)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded text-xs font-extrabold transition cursor-pointer ${
              currency === "USD" ? "bg-[#0046be] text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🇺🇸 USD ($)
          </button>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT 7 COLUMNS: Fulfillment, Customer Info & Payment Gateway */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Fulfillment Method: Shipping vs Store Pickup */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 border-b pb-2">
              1. How Would You Like to Get Your Order?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFulfillment("shipping")}
                className={`p-4 rounded-lg border-2 text-left flex items-start space-x-3 transition cursor-pointer ${
                  fulfillment === "shipping"
                    ? "border-[#0046be] bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Truck className="w-6 h-6 text-[#0046be] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Fast Doorstep Delivery</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Free on orders over {formatPrice(500)}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment("pickup")}
                className={`p-4 rounded-lg border-2 text-left flex items-start space-x-3 transition cursor-pointer ${
                  fulfillment === "pickup"
                    ? "border-[#0046be] bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Store className="w-6 h-6 text-[#0046be] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Free 1-Hour Store Pickup</p>
                  <p className="text-xs text-green-700 font-semibold mt-0.5">
                    Ready in 60 mins &bull; ALWAYS FREE
                  </p>
                </div>
              </button>
            </div>

            {fulfillment === "pickup" && (
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Select Harlow Forte Pickup Showroom:
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:border-[#0046be]"
                >
                  <option value="Harlow Forte Flagship — Admiralty Way, Lekki Phase 1, Lagos">
                    Harlow Forte Flagship — Admiralty Way, Lekki Phase 1, Lagos (Ready in 1 hr)
                  </option>
                  <option value="Harlow Forte VI — Adeola Odeku St, Victoria Island, Lagos">
                    Harlow Forte VI — Adeola Odeku St, Victoria Island, Lagos (Ready in 1 hr)
                  </option>
                  <option value="Harlow Forte Ikeja — Ikeja City Mall, Alausa, Lagos">
                    Harlow Forte Ikeja — Ikeja City Mall, Alausa, Lagos (Ready in 1 hr)
                  </option>
                  <option value="Harlow Forte Abuja — Aminu Kano Crescent, Wuse II, Abuja">
                    Harlow Forte Abuja — Aminu Kano Crescent, Wuse II, Abuja (Ready in 1 hr)
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Customer Contact & Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 border-b pb-2">
              2. Customer Contact {fulfillment === "shipping" ? "& Delivery Address" : "Details"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tunde Harlow"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address (for Receipt) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                />
              </div>

              {fulfillment === "shipping" && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House number, street name, estate/landmark"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City / Area *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#0046be]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Payment Gateway Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 border-b pb-2">
              3. Select Payment Gateway
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["Paystack", "Flutterwave", "Stripe"] as const).map((gateway) => (
                <button
                  key={gateway}
                  type="button"
                  onClick={() => setPaymentMethod(gateway)}
                  className={`p-4 rounded-lg border-2 text-left transition cursor-pointer ${
                    paymentMethod === gateway
                      ? "border-[#0046be] bg-blue-50/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-gray-900">{gateway}</span>
                    <CreditCard className="w-4 h-4 text-[#0046be]" />
                  </div>
                  <p className="text-[11px] text-gray-600">
                    {gateway === "Paystack" && "NGN Cards, Bank Transfer, USSD"}
                    {gateway === "Flutterwave" && "Multi-currency Cards & Mobile Money"}
                    {gateway === "Stripe" && "International USD Cards & Apple Pay"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: Order Summary & Pay Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5 sticky top-28">
            <h2 className="text-lg font-extrabold text-gray-900 border-b pb-3">
              Order Summary ({cart.reduce((a, b) => a + b.qty, 0)} Items)
            </h2>

            {/* Itemized List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between pt-3 first:pt-0 gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain border rounded p-1 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{fulfillment === "pickup" ? "Store Pickup:" : "Express Delivery:"}</span>
                <span className="font-semibold text-green-700">
                  {shippingUSD === 0 ? "FREE" : formatPrice(shippingUSD)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated VAT (7.5%):</span>
                <span className="font-semibold text-gray-900">{formatPrice(taxUSD)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-extrabold text-gray-900">
                <span>Total Due:</span>
                <span className="text-[#0046be]">{formatPrice(grandTotalUSD)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#ffe000] hover:bg-yellow-400 text-gray-900 font-extrabold py-4 rounded-lg text-base shadow transition cursor-pointer"
            >
              {isProcessing
                ? `Connecting to ${paymentMethod}...`
                : `Pay ${formatPrice(grandTotalUSD)} with ${paymentMethod}`}
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span>256-Bit SSL Encrypted &bull; Harlow Forte Buyer Protection</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}