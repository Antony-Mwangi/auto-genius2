"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  status: "Pending" | "Dispatched";
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Valued Customer");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync customer session metadata and fetch their orders
  useEffect(() => {
    async function fetchCustomerDashboardData() {
      try {
        // Fetch orders using the standard customer validation endpoint
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to synchronize profile transactions.");
        
        const data = await res.json();
        
        /* NOTE: In a production MERN/NextAuth flow, you would filter by the logged-in customer's session token.
           For this setup, it dynamically parses the order ledger.
        */
        setOrders(data);
        
        if (data.length > 0) {
          setCustomerName(data[0].customerName);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("autogenius_cart");
        router.push("/login");
        router.refresh();
        setTimeout(() => { window.location.href = "/login"; }, 100);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Derive simple account summary metrics
  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
  const activeTrackCount = orders.filter(o => o.status === "Pending").length;

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
      {/* RESPONSIVE DASHBOARD HEADER */}
      <header className="w-full bg-[#111827] border-b border-white/10 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/shop" className="text-xl font-black text-orange-500 tracking-wider">
              AUTOGENIUS
            </Link>
            <span className="hidden sm:inline-block text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
              Client Portal
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/shop" className="text-xs font-bold text-gray-300 hover:text-white transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              Back to Store
            </Link>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Logout Account
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
            </svg>
          </button>
        </div>

        {/* Responsive Mobile Menu Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111827] border-t border-white/5 mt-3 pt-3 flex flex-col gap-3 animate-fadeIn">
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-gray-300 p-2 rounded-xl hover:bg-white/5 flex items-center gap-2"
            >
              Back to Store
            </Link>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
              className="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl w-full text-left flex items-center gap-2"
            >
              Logout Account
            </button>
          </div>
        )}
      </header>

      {/* CORE CONTENT LAYOUT */}
      <section className="max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-10 flex-1 space-y-8">
        
        {/* User Hero Greeting */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome Back, {customerName}</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Monitor your continuous account orders, fulfillment updates, and secure payment logs.</p>
        </div>

        {/* ACCOUNT INSIGHT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.879a1.25 1.25 0 0 0 1.768 0l4.082-4.083m-4.961-.04a2.5 2.5 0 1 1 2.484-2.444M12 3c4.968 0 9 3.582 9 8s-4.032 8-9 8-9-3.582-9-8 4.032-8 9-8Z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Spent</span>
              <span className="text-xl font-black text-white mt-0.5 block">Ksh {totalSpent.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 4.5h8.25a2.25 2.25 0 0 1 2.25 2.25v7.5m-15 0h15m-15 0v-7.5A2.25 2.25 0 0 1 5.25 4.5h3" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Transit Consignments</span>
              <span className="text-xl font-black text-white mt-0.5 block">{activeTrackCount} Active Shipments</span>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl shadow-xl flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 10.5 2.25h3a2.25 2.25 0 0 1 2.248 2.003M9 3.75c-1.13 0-2.072.802-2.244 1.913L5.345 15.625c-.172 1.11.636 2.125 1.761 2.125H9.75V3.75Z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Order History</span>
              <span className="text-xl font-black text-white mt-0.5 block">{orders.length} Placed Vouchers</span>
            </div>
          </div>
        </div>

        {/* ORDER TRACKING TRACK MATRIX */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold tracking-tight text-white">Track Order Status</h2>

          {loading && <p className="text-xs text-gray-400 font-semibold animate-pulse">Syncing logistics matrix...</p>}
          {error && <p className="text-xs text-red-400 font-bold">⚠️ Error: {error}</p>}
          
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-16 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-sm">
              No recent shopping operations cataloged on this profile yet.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => {
                const shortId = order._id.substring(order._id.length - 6).toUpperCase();
                return (
                  <div key={order._id} className="bg-[#111827] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
                    
                    {/* Voucher Summary Segment */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            #{shortId}
                          </span>
                          <span className="text-xs font-bold text-gray-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 font-medium pt-1">
                          Items: <span className="text-white font-bold">{order.itemsSummary}</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Total Charge</span>
                        <span className="text-base font-black text-orange-400">Ksh {order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* LIVE VISUAL TRACKER STEPPER */}
                    <div className="relative w-full py-2">
                      <div className="absolute top-[17px] left-4 right-4 h-0.5 bg-white/10 -z-0" />
                      {/* Active green track bar fill if order is Dispatched */}
                      {order.status === "Dispatched" && (
                        <div className="absolute top-[17px] left-4 right-4 h-0.5 bg-green-500 -z-0 transition-all duration-500" />
                      )}

                      <div className="flex justify-between items-start relative z-10">
                        {/* Step 1: Confirmed / Pending */}
                        <div className="flex flex-col items-center text-center max-w-[100px]">
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs border-4 border-[#111827]">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-extrabold text-white mt-2">Order Filed</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{order.paymentMethod}</span>
                        </div>

                        {/* Step 2: Dispatched */}
                        <div className="flex flex-col items-center text-center max-w-[100px]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-4 border-[#111827] transition-all duration-300 ${
                            order.status === "Dispatched" 
                              ? "bg-green-500 text-white" 
                              : "bg-[#0b0f14] text-gray-500 border-white/10"
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 4.5h8.25a2.25 2.25 0 0 1 2.25 2.25v7.5m-15 0h15m-15 0v-7.5A2.25 2.25 0 0 1 5.25 4.5h3" />
                            </svg>
                          </div>
                          <span className={`text-[11px] font-extrabold mt-2 ${order.status === "Dispatched" ? "text-green-400" : "text-gray-500"}`}>
                            Dispatched
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">
                            {order.status === "Dispatched" ? "In Transit" : "Awaiting"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#111827] py-6 text-center text-xs text-gray-500 mt-auto">
        &copy; 2026 AUTOGENIUS Automotive Hub. All Rights Reserved.
      </footer>
    </main>
  );
}