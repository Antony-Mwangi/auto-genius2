"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        
        {/* LEFT PANEL - White Background */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-50 to-white p-16 border-r border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Autogenius"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-orange-500/30"
                />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-orange-600 tracking-wider">
                  AUTOGENIUS
                </h2>
                <p className="text-sm text-gray-500">Spare Parts LTD</p>
              </div>
            </div>

            <motion.h1 
              className="mt-16 text-5xl font-extrabold leading-tight text-gray-900"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join Kenya's Trusted
              <br />
              <motion.span 
                className="text-orange-600 inline-block"
                animate={{ 
                  color: ["#ea580c", "#f97316", "#ea580c"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Spare Parts Store
              </motion.span>
            </motion.h1>

            <motion.p 
              className="mt-8 max-w-lg text-lg text-gray-600 leading-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create your account to order genuine auto spare parts, save your cart, track your orders, and enjoy a faster checkout experience.
            </motion.p>
          </motion.div>

          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-bold text-orange-600 text-lg">Member Benefits</h3>
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  "Save multiple delivery addresses",
                  "Track every order live",
                  "Faster future checkouts",
                  "Exclusive member discounts"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-orange-500 font-bold">✓</span> {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT PANEL - Registration Form */}
        <div className="flex items-center justify-center px-6 py-12 bg-white">
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-10">
              <motion.h2 
                className="text-4xl font-extrabold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                Create Account
              </motion.h2>
              <motion.p 
                className="mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Register to start tracking your automated purchases.
              </motion.p>
            </motion.div>

            {error && (
              <motion.div 
                className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-4 text-sm text-green-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Registration successful! Routing securely to your personal dashboard...
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-xl bg-orange-500 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </form>

            <motion.p 
              className="mt-8 text-center text-gray-600"
              variants={itemVariants}
            >
              Already have an account?
              <Link href="/login" className="ml-2 font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Sign In
              </Link>
            </motion.p>

            <motion.div 
              className="my-8 flex items-center gap-4"
              variants={itemVariants}
            >
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/shop"
                className="block rounded-xl border-2 border-orange-500 py-3.5 text-center font-semibold text-orange-600 transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200"
              >
                Continue Shopping as Guest
              </Link>
            </motion.div>

            <motion.p 
              className="mt-12 text-center text-sm text-gray-500"
              variants={itemVariants}
            >
              © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD
            </motion.p>
          </motion.div>
        </div>

      </div>
    </main>
  );
}