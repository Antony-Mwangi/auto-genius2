"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

// ==================== Constants & Types ====================

const SHIPPING_LOCATIONS = {
  "Nairobi Area": { label: "Nairobi Area", cost: 300 },
  "Outside Nairobi": { label: "Outside Nairobi", cost: 600 },
  "Pickup at Shop": { label: "Pickup at Shop", cost: 0 },
} as const;

type ShippingLocation = keyof typeof SHIPPING_LOCATIONS;
type PaymentMethod = "M-Pesa" | "Cash on Delivery";

type PaymentStatus = "idle" | "creating_order" | "initiating" | "pending" | "success" | "failed";

interface CartItem {
  product: {
    _id?: string;
    name: string;
    price: number;
    image?: string;
  };
  selectedVariant?: { _id?: string; name?: string; price?: number };
  quantity: number;
}

// ==================== Animation Variants ====================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const modalVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } },
};

// ==================== Component ====================

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("M-Pesa");
  const [shippingLocation, setShippingLocation] =
    useState<ShippingLocation>("Pickup at Shop");

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  // ---- Load cart + autofill profile ----
  useEffect(() => {
    const savedCart = localStorage.getItem("autogenius_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart:", err);
      }
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setName(data.user.fullName || "");
          setEmail(data.user.email || "");
          if (data.user.phone) setPhone(data.user.phone);
        }
      } catch (err) {
        console.error("Autofill failed:", err);
      }
    })();
  }, []);

  // ---- Derived totals ----
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.selectedVariant?.price ?? item.product.price) * item.quantity,
    0
  );
  const shippingCost = SHIPPING_LOCATIONS[shippingLocation].cost;
  const total = subtotal + shippingCost;

  // ==================== Helpers ====================

  const createOrder = async (): Promise<{ orderId: string; paymentAccessToken: string }> => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        paymentMethod,
        cart,
        shippingLocation,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err.message || err.error || "Failed to create your order."
      );
    }

    const data = await res.json();
    const orderId = data.orderId || data._id || data.order?._id;
    if (!orderId) throw new Error("Order created but no ID returned.");
    if (typeof data.paymentAccessToken !== "string") {
      throw new Error("Order created but payment access could not be initialized.");
    }
    return { orderId, paymentAccessToken: data.paymentAccessToken };
  };

  /**
   * Initiate the Daraja STK push.
   * Returns the CheckoutRequestID used to track the request.
   */
  const initiateStkPush = async (orderId: string, paymentAccessToken: string): Promise<void> => {
    const res = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        phone,
        amount: Math.round(total),
        paymentAccessToken,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.checkoutRequestId || data.message !== "STK push sent, awaiting confirmation") {
      throw new Error(data.error || "Failed to initiate M-Pesa payment.");
    }
  };

  // ==================== Main Submit Handler ====================

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || loading) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      setPaymentStatus("creating_order");
      const { orderId, paymentAccessToken } = await createOrder();

      // Cash on Delivery completes immediately
      if (paymentMethod === "Cash on Delivery") {
        localStorage.removeItem("autogenius_cart");
        setPaymentStatus("success");
        setShowSuccessModal(true);
        setLoading(false);
        return;
      }

      // M-Pesa — send STK push, then poll by CheckoutRequestID
      setPaymentStatus("initiating");
      await initiateStkPush(orderId, paymentAccessToken);
      sessionStorage.setItem(`mpesa-order-token:${orderId}`, paymentAccessToken);
      setPaymentStatus("pending");
      router.push(`/checkout/pending/${orderId}`);
    } catch (err: any) {
      console.error("Order error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setPaymentStatus("failed");
      setLoading(false);
    }
  };

  // ==================== Render ====================

  return (
    <main className="min-h-screen bg-white text-gray-900 p-4 sm:p-8 md:p-12 flex items-center justify-center relative antialiased font-sans">
      {/* ---------------- SUCCESS MODAL ---------------- */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border-2 border-green-200 rounded-3xl w-full max-w-sm p-8 text-center space-y-4 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="w-16 h-16 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </motion.div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900">
                  Order Placed Successfully!
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {paymentMethod === "M-Pesa"
                    ? "Your M-Pesa payment was received and your order is being processed."
                    : "Your order has been received and will be processed shortly."}
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/dashboard");
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-orange-200 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- CHECKOUT FORM ---------------- */}
      <motion.form
        onSubmit={handlePlaceOrder}
        className="w-full max-w-6xl bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4 gap-3"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">📦</span> Checkout
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Fill in your details to complete your order
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            Cancel
          </Link>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="text-xl leading-none">⚠️</span>
              <span className="flex-1">{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-700 font-bold"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-orange-500 rounded-full"></span>
              Personal Information
            </h2>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-600 mb-1.5 tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Antony Mwangi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-200 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-600 mb-1.5 tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-200 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-600 mb-1.5 tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all duration-200 disabled:opacity-60"
              />
              {paymentMethod === "M-Pesa" && (
                <p className="text-[11px] text-gray-500 mt-1.5">
                  The M-Pesa prompt will be sent to this number.
                </p>
              )}
            </div>
          </motion.div>

          {/* Shipping + Payment */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-orange-500 rounded-full"></span>
              Delivery & Payment
            </h2>

            {/* Shipping Location */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-600 tracking-wider">
                Delivery Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(SHIPPING_LOCATIONS).map(
                  ([key, { label, cost }]) => (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() =>
                        setShippingLocation(key as ShippingLocation)
                      }
                      disabled={loading}
                      className={`p-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed ${
                        shippingLocation === key
                          ? cost === 0
                            ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                            : "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      <span className="text-sm font-bold">{label}</span>
                      <span className="text-[10px] font-medium opacity-80">
                        {cost === 0
                          ? "No shipping fee"
                          : `+ Ksh ${cost.toLocaleString()}`}
                      </span>
                      {shippingLocation === key && (
                        <span className="text-[8px] mt-0.5 font-bold uppercase tracking-wider text-orange-600">
                          ✓ Selected
                        </span>
                      )}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-gray-600 tracking-wider">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("M-Pesa")}
                  disabled={loading}
                  className={`p-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed ${
                    paymentMethod === "M-Pesa"
                      ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <span className="text-lg">📱</span>
                  M-Pesa
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  disabled={loading}
                  className={`p-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  <span className="text-lg">🚚</span>
                  Cash on Delivery
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 border-2 border-gray-200 p-4 sm:p-6 rounded-xl space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900 font-semibold">
                Ksh {subtotal.toLocaleString()}
              </span>
            </div>

            {shippingCost > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Shipping ({SHIPPING_LOCATIONS[shippingLocation].label}):
                </span>
                <span className="text-orange-600 font-semibold">
                  + Ksh {shippingCost.toLocaleString()}
                </span>
              </div>
            )}

            {shippingCost === 0 && shippingLocation === "Pickup at Shop" && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-purple-600 font-semibold">
                  Free (Pickup)
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm col-span-1 sm:col-span-2 lg:col-span-1">
              <span className="text-sm font-bold text-gray-800">Total:</span>
              <span className="text-gray-900 font-black text-xl tracking-wide">
                Ksh {total.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200 hover:shadow-xl flex items-center justify-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>
                  {paymentStatus === "creating_order"
                    ? "Creating order..."
                    : paymentStatus === "initiating"
                    ? "Sending M-Pesa request..."
                    : paymentStatus === "pending"
                    ? "Waiting for payment..."
                    : "Processing..."}
                </span>
              </>
            ) : paymentMethod === "M-Pesa" ? (
              `Pay Ksh ${total.toLocaleString()} via M-Pesa`
            ) : (
              `Place Order - Ksh ${total.toLocaleString()}`
            )}
          </motion.button>

          {cart.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500">
              Your cart is empty.
              <Link
                href="/shop"
                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors ml-1"
              >
                Continue shopping
              </Link>
            </p>
          )}
        </motion.div>
      </motion.form>
    </main>
  );
}