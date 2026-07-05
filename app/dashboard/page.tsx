"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, ArrowRight, Settings, LogOut } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Valued Customer", email: "" });

  useEffect(() => {
    // Prevent state updates if component unmounts
    let isMounted = true;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (isMounted && data?.user) {
          setUser({ name: data.user.fullName, email: data.user.email });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return <main className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-gray-500">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <section className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome, {user.name}</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your account and settings.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors w-full sm:w-auto"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0"><User size={22} /></div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</p>
              <p className="font-bold truncate">{user.name}</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0"><Mail size={22} /></div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
              <p className="font-bold truncate text-sm md:text-base font-mono">{user.email}</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            
            <a href="/shop" className="bg-[#111827] border border-white/10 p-5 rounded-2xl hover:border-orange-500/50 transition flex items-center justify-between group">
              <span className="font-bold flex items-center gap-3">
                <Settings size={20} className="text-orange-500" /> Browse Spare Parts
              </span>
              <ArrowRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
            </a>
            
            <button className="bg-[#111827] border border-white/10 p-5 rounded-2xl hover:border-green-500/50 transition flex items-center justify-between group text-left">
              <span className="font-bold flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-500" /> Security Settings
              </span>
              <ArrowRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
            </button>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}