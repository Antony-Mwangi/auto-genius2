"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side Validation: Match passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during registration.");
      }

      setSuccess(true);
      
      // CHANGED: Redirect directly to customer dashboard page instead of /login
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-[#111827] to-[#0b0f14] p-16">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpeg"
                alt="Autogenius"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-orange-500 tracking-wider">
                  AUTOGENIUS
                </h2>
                <p className="text-sm text-gray-400">Spare Parts LTD</p>
              </div>
            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Join Kenya's Trusted
              <br />
              <span className="text-orange-500">Spare Parts Store</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-gray-400">
              Create your account to order genuine auto spare parts, save your cart, track your orders, and enjoy a faster checkout experience.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
              <h3 className="font-semibold text-orange-400">Member Benefits</h3>
              <ul className="mt-5 space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">✓</span> Save multiple delivery addresses</li>
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">✓</span> Track every order live</li>
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">✓</span> Faster future checkouts</li>
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">✓</span> Exclusive member discounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-bold">Create Account</h2>
              <p className="mt-3 text-gray-400">Register to start tracking your automated purchases.</p>
            </div>

            {/* Error and Success states */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-400">
                Registration successful! Routing securely to your personal dashboard...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
              Already have an account?
              <Link href="/login" className="ml-2 font-semibold text-orange-400 hover:text-orange-300">
                Sign In
              </Link>
            </p>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <Link
              href="/shop"
              className="block rounded-xl border border-orange-500 py-3 text-center font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
            >
              Continue Shopping as Guest
            </Link>

            <p className="mt-12 text-center text-sm text-gray-500">
              © 2026 AUTOGENIUS Spare Parts LTD
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}