"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Custom Status Notification States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Billing fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"M-Pesa" | "Cash on Delivery">("M-Pesa");

  useEffect(() => {
    const savedCart = localStorage.getItem("autogenius_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const total = cart.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, paymentMethod, cart, total }),
      });

      if (res.ok) {
        localStorage.removeItem("autogenius_cart");
        setShowSuccessModal(true);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.message || "Failed to finalize parameters.");
      }
    } catch (err) {
      setErrorMessage("Network synchronization error. Please check your connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white p-4 sm:p-6 flex items-center justify-center relative antialiased font-sans">
      
      {/* SUCCESS MODAL WINDOW CONTAINER */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">Order Placed Successfully!</h2>
              <p className="text-xs text-gray-400 leading-relaxed">The administrative warehouse catalog terminal has been alerted to launch shipping logistics.</p>
            </div>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/shop");
              }}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer shadow-md shadow-orange-500/10"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      )}

      {/* CORE CHECKOUT FORM PANEL */}
      <form onSubmit={handlePlaceOrder} className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Checkout Node</h1>
            <p className="text-xs text-gray-400 mt-1">Finalize parameters to execute delivery protocols.</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-gray-400 hover:text-white transition">
            Cancel
          </Link>
        </div>

        {/* INLINE ERROR DISPLAY CONTAINER */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-black text-gray-400 mb-1 tracking-wider">Your Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Antony Mwangi" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm font-semibold text-white placeholder-gray-600 outline-none focus:border-orange-500 transition" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-black text-gray-400 mb-1 tracking-wider">M-Pesa / Delivery Phone Number</label>
            <input 
              type="tel" 
              required 
              placeholder="e.g. 0712345678" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm font-semibold text-white placeholder-gray-600 outline-none focus:border-orange-500 transition" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase font-black text-gray-400 tracking-wider">Payment Channel Settlement</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={() => setPaymentMethod("M-Pesa")} 
              className={`p-3 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer text-center ${
                paymentMethod === "M-Pesa" 
                  ? "border-green-500 bg-green-500/10 text-green-400 shadow-md shadow-green-500/5" 
                  : "border-white/10 bg-[#0b0f14] text-gray-400 hover:border-white/20"
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" className={paymentMethod === "M-Pesa" ? "text-green-400" : "text-gray-600"} />
              </svg>
              M-Pesa
            </button>
            <button 
              type="button" 
              onClick={() => setPaymentMethod("Cash on Delivery")} 
              className={`p-3 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer text-center ${
                paymentMethod === "Cash on Delivery" 
                  ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-md shadow-orange-500/5" 
                  : "border-white/10 bg-[#0b0f14] text-gray-400 hover:border-white/20"
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5m-3-2.625t.75-.75h7.5M4.5 9h10.125c.621 0 1.125.504 1.125 1.125v4.5m-12.375 0h.008v.008H3.375v-.008Z" />
              </svg>
              Delivery
            </button>
          </div>
        </div>

        <div className="bg-[#0b0f14] p-4 rounded-xl border border-white/5 flex justify-between items-center text-sm font-semibold">
          <span className="text-gray-400">Total Settlement Due:</span>
          <span className="text-white font-black text-lg tracking-wide">Ksh {total.toLocaleString()}</span>
        </div>

        <button 
          type="submit" 
          disabled={loading || cart.length === 0} 
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Filing Order Entry...</span>
            </>
          ) : paymentMethod === "M-Pesa" ? (
            "Initiate M-Pesa Request"
          ) : (
            "Complete Order Placement"
          )}
        </button>
      </form>
    </main>
  );
}