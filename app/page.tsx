"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  const footerVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* NAVBAR - Pure Black Background - Fixed - Responsive */}
      <header className="border-b border-white/10 bg-black shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center select-none z-10 shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                <Image
                  src="/logo5.jpeg"
                  alt="AUTOGENIUS Spare Parts LTD"
                  fill
                  priority
                  className="object-contain mix-blend-screen bg-transparent"
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link 
                className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 text-sm lg:text-base" 
                href="/shop"
              >
                Shop
              </Link>
              <Link 
                className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 text-sm lg:text-base" 
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-lg border border-white/20 bg-white/5 px-4 sm:px-5 py-2 font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 hover:text-orange-400 active:scale-95 text-sm lg:text-base"
                href="/register"
              >
                Register
              </Link>
              <Link 
                className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 text-sm lg:text-base" 
                href="/about"
              >
                About-us
              </Link>
            </nav>

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

          {/* MOBILE NAVIGATION - Collapsible */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col pb-4 space-y-1 border-t border-white/10 pt-4">
              <Link 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base flex items-center gap-3" 
                href="/shop"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Shop
              </Link>
              <Link 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base flex items-center gap-3" 
                href="/login"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Login
              </Link>
              <Link 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base flex items-center gap-3" 
                href="/register"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Register
              </Link>
              <Link 
                onClick={closeMobileMenu}
                className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base flex items-center gap-3" 
                href="/about"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                About-us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20 sm:h-24 md:h-28"></div>

      {/* HERO - White Content */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20"
      >
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* LEFT */}
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Genuine{" "}
              <motion.span 
                className="text-orange-500 inline-block"
                animate={{ 
                  color: ["#f97316", "#ea580c", "#f97316"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Auto Spare Parts
              </motion.span>
              <br />
              <span className="text-gray-800">Delivered Fast</span>
            </motion.h2>
            <motion.p 
              className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AUTOGENIUS Spare Parts LTD supplies quality engine, suspension,
              braking and electrical parts for Toyota, Nissan, Subaru, Honda,
              Mazda, Mitsubishi and many other vehicles across Kenya.
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/shop"
                className="text-center rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-300 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Shop as a Guest</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="text-center rounded-full border-2 border-orange-500 px-8 py-4 font-semibold text-orange-600 transition-all duration-200 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 active:scale-95"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div 
            variants={cardVariants}
            className="rounded-3xl border-2 border-orange-200 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.h3 
              className="text-2xl font-extrabold text-orange-600 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <span className="inline-block w-1 h-8 bg-orange-500 rounded-full"></span>
              AUTOGENIUS Spare Parts LTD
            </motion.h3>
            <motion.div 
              className="mt-8 space-y-6 text-gray-700"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="flex items-start gap-4 hover:bg-orange-50 p-3 rounded-xl transition-colors duration-200">
                <FaMapMarkerAlt className="mt-1 text-orange-500 flex-shrink-0 text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">
                    Kirinyaga Road <br />
                    MSP PLAZA <br />
                    Shop B-02
                  </p>
                </div>
              </motion.div>
              <motion.a 
                variants={itemVariants}
                href="tel:+254714200500" 
                className="flex items-start gap-4 hover:bg-orange-50 p-3 rounded-xl transition-colors duration-200 group"
              >
                <FaPhoneAlt className="mt-1 text-orange-500 flex-shrink-0 text-xl group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600 group-hover:text-orange-600 transition-colors">+254 714 200 500</p>
                </div>
              </motion.a>
              <motion.a 
                variants={itemVariants}
                href="mailto:autogeniusspares25@gmail.com" 
                className="flex items-start gap-4 hover:bg-orange-50 p-3 rounded-xl transition-colors duration-200 group"
              >
                <FaEnvelope className="mt-1 text-orange-500 flex-shrink-0 text-xl group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 break-words group-hover:text-orange-600 transition-colors">autogeniusspares25@gmail.com</p>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER - Pure Black Background */}
      <motion.footer 
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="border-t border-white/10 bg-black mt-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3">
                <Image src="/logo.jpeg" alt="AUTOGENIUS" width={45} height={45} className="rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-orange-500">AUTOGENIUS</h3>
                  <p className="text-xs text-gray-400">Spare Parts LTD</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-gray-400 leading-relaxed">
                Your trusted destination for genuine automotive spare parts, reliable service and fast delivery across Kenya.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-orange-500 rounded-full"></span>
                Contact
              </h4>
              <div className="space-y-4 text-sm text-gray-400">
                <a href="tel:+254714200500" className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200 group">
                  <FaPhoneAlt className="text-orange-500 group-hover:scale-110 transition-transform" /> 
                  <span className="group-hover:text-orange-400">+254 714 200 500</span>
                </a>
                <a href="mailto:autogeniusspares25@gmail.com" className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200 group">
                  <FaEnvelope className="text-orange-500 group-hover:scale-110 transition-transform" /> 
                  <span className="break-words group-hover:text-orange-400">autogeniusspares25@gmail.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-orange-500" /> 
                  <span className="text-gray-400">Kirinyaga Rd, MSP PLAZA, Shop B-02</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-orange-500 rounded-full"></span>
                Sales Executive
              </h4>
              <p className="font-semibold text-orange-400 text-lg">Ponciano Mutua</p>
              <div className="mt-6 flex items-center gap-3 text-gray-400">
                <FaClock className="text-orange-500 text-xl" />
                <span>
                  Mon - Sat <br /> 
                  <span className="font-semibold text-gray-300">8:00 AM - 6:00 PM</span>
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-orange-500 rounded-full"></span>
                Connect
              </h4>
              <motion.a 
                href="https://wa.me/254714200500" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex rounded-full bg-green-500 p-4 text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/50 hover:scale-110"
                whileHover={{ rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaWhatsapp size={24} />
              </motion.a>
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.02 }}
              >
                <Link 
                  href="/shop" 
                  className="inline-block rounded-full bg-orange-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/50 active:scale-95 flex items-center gap-2 group"
                >
                  <span>Start Shopping</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="border-t border-white/10 py-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD. All Rights Reserved.
        </motion.div>
      </motion.footer>
    </main>
  );
}