// app/components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandMarquee from "./BrandMarquee";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="border-b border-white/10 bg-black shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Row 1: logo | nav + brand marquee | mobile toggle */}
        <div className="flex items-center justify-between gap-3 h-20 sm:h-24 md:h-28">
          {/* LOGO — animated */}
          <Link href="/" className="flex items-center select-none z-10 shrink-0">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.08 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center"
            >
              <Image
                src="/logo.jpeg"
                alt="AUTOGENIUS Spare Parts LTD"
                fill
                priority
                className="object-contain mix-blend-screen bg-transparent"
              />
            </motion.div>
          </Link>

          {/* DESKTOP: nav + real brand logos marquee */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
            <nav className="flex items-center gap-1 lg:gap-2 shrink-0">
              <Link
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base"
                href="/shop"
              >
                Shop
              </Link>
              <Link
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base"
                href="/about"
              >
                About Us
              </Link>
              <Link
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base"
                href="/ReturnPolicy"
              >
                Return Policy
              </Link>
            </nav>

            {/* Real brand logo marquee */}
            <div className="flex-1 min-w-0">
              <BrandMarquee />
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE: real brand logo strip */}
        <div className="md:hidden border-t border-white/10">
          <BrandMarquee />
        </div>

        {/* MOBILE NAVIGATION — animated drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="flex flex-col py-3 space-y-1">
                <Link
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base"
                  href="/shop"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                    Shop
                  </span>
                </Link>
                <Link
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base"
                  href="/about"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                    About Us
                  </span>
                </Link>
                <Link
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base"
                  href="/ReturnPolicy"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                    Return Policy
                  </span>
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}