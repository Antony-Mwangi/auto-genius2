"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
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

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, paymentMethod, cart, total }),
      });

      if (res.ok) {
        localStorage.removeItem("autogenius_cart");
        alert("🎉 Order placed successfully! The admin terminal has been alerted.");
        router.push("/shop");
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      alert("Network synchronization error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white p-6 flex items-center justify-center">
      <form onSubmit={handlePlaceOrder} className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Checkout Node</h1>
          <p className="text-xs text-gray-400 mt-1">Finalize payment parameters to launch shipping operations.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Your Full Name</label>
            <input type="text" required placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">M-Pesa / Delivery Phone Number</label>
            <input type="tel" required placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-gray-400">Payment Channel Settlement</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setPaymentMethod("M-Pesa")} className={`p-3 rounded-xl border font-bold text-xs transition cursor-pointer text-center ${paymentMethod === "M-Pesa" ? "border-green-500 bg-green-500/10 text-green-400" : "border-white/10 text-gray-400"}`}>🟢 M-Pesa</button>
            <button type="button" onClick={() => setPaymentMethod("Cash on Delivery")} className={`p-3 rounded-xl border font-bold text-xs transition cursor-pointer text-center ${paymentMethod === "Cash on Delivery" ? "border-orange-500 bg-orange-500/10 text-orange-400" : "border-white/10 text-gray-400"}`}>🚚 Cash on Delivery</button>
          </div>
        </div>

        <div className="bg-[#0b0f14] p-4 rounded-xl border border-white/5 flex justify-between items-center text-sm font-semibold">
          <span className="text-gray-400">Total Settlement Due:</span>
          <span className="text-white font-black text-lg">Ksh {total.toLocaleString()}</span>
        </div>

        <button type="submit" disabled={loading || cart.length === 0} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow-xl">
          {loading ? "Filing Order Entry..." : paymentMethod === "M-Pesa" ? "Initiate M-Pesa Request" : "Complete Order Placement"}
        </button>
      </form>
    </main>
  );
}