"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, ArrowRight, Settings, LogOut } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("Valued Customer");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data?.user) {
          setCustomerName(data.user.fullName);
          setCustomerEmail(data.user.email);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh(); // Ensure session state clears
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col font-sans">
      <Navbar />

      {/* DASHBOARD CONTENT */}
      <section className="max-w-5xl mx-auto w-full p-6 md:p-12 space-y-10 flex-grow">
        
        {/* HERO SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Welcome, {customerName}</h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and settings.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-semibold"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* ACCOUNT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><User size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Registered Name</p>
              <p className="font-bold text-lg">{customerName}</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Mail size={24} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Account Email</p>
              <p className="font-bold text-lg font-mono">{customerEmail}</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/shop" className="bg-[#111827] border border-white/10 p-6 rounded-2xl hover:border-orange-500/50 transition flex items-center justify-between group">
              <span className="font-bold flex items-center gap-3">
                <Settings size={20} className="text-orange-500" /> Browse Spare Parts
              </span>
              <ArrowRight size={20} className="text-gray-600 group-hover:text-white" />
            </a>
            
            <button className="bg-[#111827] border border-white/10 p-6 rounded-2xl hover:border-green-500/50 transition flex items-center justify-between group text-left">
              <span className="font-bold flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-500" /> Security Settings
              </span>
              <ArrowRight size={20} className="text-gray-600 group-hover:text-white" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}