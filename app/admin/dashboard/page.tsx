"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // State for form tracking
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Session Logout Handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        // Soft route clear
        router.push("/admin/login");
        router.refresh();
        
        // ✅ Hard fallback to safely clear out state contexts across browser windows
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 100);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ text: "Please select a local image file to upload.", isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Build the Multi-part FormData container payload
    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("category", category);
    data.append("image", imageFile);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data, 
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ text: "Product published and uploaded successfully!", isError: false });
        setName("");
        setPrice("");
        setCategory("");
        setImageFile(null);
        
        // Wipe file input UI value reference state manually
        const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setMessage({ text: result.message || "Failed to create item.", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Something went wrong during data sync.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      {/* PORTAL NAVIGATION HEADER */}
      <header className="border-b border-white/10 bg-[#111827] px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-orange-500 tracking-wider">AUTOGENIUS</span>
            <span className="bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20 px-2.5 py-0.5 rounded-full">
              Management Portal
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/shop" 
              className="text-sm font-medium text-gray-400 hover:text-white transition"
            >
              View Shop Front
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/30 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95 cursor-pointer"
            >
              Disconnect Session
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BOX */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Add New Spare Part</h2>
          <p className="text-gray-400 text-sm mt-1">Upload parts catalog data instantly from your local hardware directory.</p>
        </div>

        {/* FEEDBACK SYSTEM NOTIFICATIONS */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            message.isError 
              ? "bg-red-500/10 border-red-500/30 text-red-400" 
              : "bg-green-500/10 border-green-500/30 text-green-400"
          }`}>
            {message.text}
          </div>
        )}

        {/* COMPACT PRODUCT INVENTORY FORM */}
        <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
              Spare Part Name
            </label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Toyota Hilux Brake Pads (Front)"
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 outline-none text-white focus:border-orange-500 transition text-sm" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                Price (Ksh)
              </label>
              <input 
                type="number" 
                required 
                placeholder="4500"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 outline-none text-white focus:border-orange-500 transition text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                Category Group
              </label>
              <input 
                type="text" 
                required 
                placeholder="Brakes, Engine, Suspension" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 outline-none text-white focus:border-orange-500 transition text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
              Select Image from Local Device
            </label>
            <input 
              id="file-upload-input"
              type="file" 
              required 
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-orange-400 hover:file:bg-white/10 file:cursor-pointer cursor-pointer p-2 border border-dashed border-white/10 rounded-xl bg-[#0b0f14]"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-50 active:scale-[0.99] shadow-lg shadow-orange-500/10 mt-2 cursor-pointer"
          >
            {loading ? "Processing Asset Upload..." : "Publish to Storefront"}
          </button>
        </form>
      </div>
    </main>
  );
}