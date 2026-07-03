"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // MongoDB route will be added later
    console.log(formData);
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

                <h2 className="text-2xl font-bold text-orange-500">
                  AUTOGENIUS
                </h2>

                <p className="text-sm text-gray-400">
                  Spare Parts LTD
                </p>

              </div>

            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Join Kenya's Trusted
              <br />
              <span className="text-orange-500">
                Spare Parts Store
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-gray-400">
              Create your account to order genuine auto spare parts,
              save your cart, track your orders and enjoy a faster
              checkout experience.
            </p>

          </div>

          <div className="space-y-5">

            <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">

              <h3 className="font-semibold text-orange-400">
                Member Benefits
              </h3>

              <ul className="mt-5 space-y-3 text-gray-300">
                <li>✔ Save multiple delivery addresses</li>
                <li>✔ Track every order</li>
                <li>✔ Faster future checkout</li>
                <li>✔ Exclusive member offers</li>
              </ul>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="mb-10">

              <h2 className="text-4xl font-bold">
                Create Account
              </h2>

              <p className="mt-3 text-gray-400">
                Register to start shopping genuine spare parts.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />

              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-400 active:scale-[0.98]"
              >
                Create Account
              </button>

            </form>

            <p className="mt-8 text-center text-gray-400">
              Already have an account?

              <Link
                href="/login"
                className="ml-2 font-semibold text-orange-400 hover:text-orange-300"
              >
                Sign In
              </Link>

            </p>

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-white/10"></div>

              <span className="text-sm text-gray-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10"></div>

            </div>

            <Link
              href="/shop"
              className="block rounded-xl border border-orange-500 py-3 text-center font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
            >
              Continue Shopping as Guest
            </Link>

            <p className="mt-12 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}