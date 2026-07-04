"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setSuccess(true);
      setTimeout(() => {
        // ✅ FIXED: Using an absolute path and stripped the physical "app/" directory segment out
        router.push("/admin/dashboard"); 
        router.refresh();

        // ⚡ Secure fallback to break out of relative path traps completely
        setTimeout(() => {
          if (window.location.pathname !== "/admin/dashboard") {
            window.location.href = `${window.location.origin}/admin/dashboard`;
          }
        }, 150);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <span className="text-2xl text-orange-500 font-black tracking-widest">AG</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AUTOGENIUS Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Administrative Terminal Access Only</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400">
            Access Granted. Redirecting to Management Panel...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Secure Email ID</label>
            <input
              type="email"
              required
              placeholder="admin@autogenius.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Security Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 py-3 rounded-xl font-bold transition mt-2 text-sm text-white cursor-pointer"
          >
            {loading ? "Decrypting Credentials..." : "Authorize Login"}
          </button>
        </form>
      </div>
    </main>
  );
}