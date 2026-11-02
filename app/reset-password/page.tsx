// app/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isTokenMissing = !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Invalid / missing token state
  if (isTokenMissing) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <Image
              src="/logo.jpeg"
              alt="Autogenius"
              width={60}
              height={60}
              className="rounded-full border-2 border-orange-500/30"
            />
            <span className="text-2xl font-bold text-orange-600 tracking-wider">
              AUTOGENIUS
            </span>
          </Link>

          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-md">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h1>
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or has expired. Please request a
              new one.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
            >
              Request New Link
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-50 to-white p-16 border-r border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
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
                <p className="text-gray-500 text-sm">Spare Parts LTD</p>
              </div>
            </Link>

            <motion.h1
              className="mt-16 text-5xl font-extrabold leading-tight text-gray-900"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create a
              <br />
              <motion.span
                className="text-orange-600 inline-block"
                animate={{ color: ["#ea580c", "#f97316", "#ea580c"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                New Password
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-8 max-w-lg text-lg text-gray-600 leading-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Choose a strong password to keep your account secure. Use at least 8
              characters with a mix of letters, numbers, and symbols.
            </motion.p>
          </motion.div>

          <motion.div
            className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="font-bold text-orange-600 text-lg">Password Tips</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              {[
                "At least 8 characters long",
                "Mix uppercase and lowercase letters",
                "Include at least one number",
                "Add a special character (e.g. ! @ #)",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                >
                  <span className="text-orange-500 font-bold">✔</span> {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="flex items-center justify-center px-6 py-12 bg-white">
          <motion.div
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group mb-8"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to login
              </Link>

              <h2 className="text-4xl font-extrabold text-gray-900 mt-6">
                Create New Password
              </h2>
              <p className="mt-3 text-gray-600">
                Enter your new password below. Make sure it&apos;s at least 8
                characters.
              </p>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Password reset successfully!
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Redirecting you to login...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <motion.div variants={itemVariants}>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pl-12 pr-12 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 pl-12 pr-12 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 text-gray-900 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-orange-500 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </motion.button>
              </form>
            )}

            <motion.p
              className="mt-8 text-center text-gray-600"
              variants={itemVariants}
            >
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Back to login
              </Link>
            </motion.p>

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

// Loading fallback for Suspense (required because useSearchParams)
function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}