"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // MongoDB login route will be added later
    console.log({
      email,
      password,
    });
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#111827] to-[#0b0f14] p-16 border-r border-white/10">

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

                <p className="text-gray-400 text-sm">
                  Spare Parts LTD
                </p>
              </div>
            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Genuine Spare Parts
              <br />
              <span className="text-orange-500">
                For Every Journey
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg text-gray-400 leading-8">
              Find genuine automotive spare parts for Toyota,
              Nissan, Mazda, Subaru, Honda, Mitsubishi and many
              more. Quality guaranteed with fast delivery across
              Kenya.
            </p>
          </div>

          <div className="space-y-6">

            <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
              <h3 className="font-semibold text-orange-400">
                Why Choose Us?
              </h3>

              <ul className="mt-4 space-y-3 text-gray-300">
                <li>✔ Genuine OEM Spare Parts</li>
                <li>✔ Affordable Prices</li>
                <li>✔ Fast Countrywide Delivery</li>
                <li>✔ Professional Customer Support</li>
              </ul>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="mb-10 text-center lg:text-left">

              <h2 className="text-4xl font-bold">
                Welcome Back
              </h2>

              <p className="mt-3 text-gray-400">
                Login to your account to continue shopping.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111827]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500/30
                "
                />

              </div>

              <div>

                <div className="mb-2 flex justify-between">

                  <label className="text-sm text-gray-300">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111827]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500/30
                "
                />

              </div>

              <button
                type="submit"
                className="
                w-full
                rounded-xl
                bg-orange-500
                py-3
                font-semibold
                transition
                hover:bg-orange-400
                active:scale-[0.98]
              "
              >
                Sign In
              </button>

            </form>

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-white/10"></div>

              <span className="text-sm text-gray-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10"></div>

            </div>

            <Link
              href="/shop"
              className="
              block
              rounded-xl
              border
              border-orange-500
              py-3
              text-center
              font-semibold
              text-orange-400
              transition
              hover:bg-orange-500
              hover:text-white
            "
            >
              Continue as Guest
            </Link>

            <p className="mt-8 text-center text-gray-400">

              Don't have an account?

              <Link
                href="/register"
                className="ml-2 font-semibold text-orange-400 hover:text-orange-300"
              >
                Create Account
              </Link>

            </p>

            <p className="mt-12 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}