"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 bg-black shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center select-none z-10 shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
              <Image
                src="/logo.jpeg"
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
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base" 
              href="/shop"
            >
              Shop
            </Link>
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base" 
              href="/login"
            >
              Login
            </Link>
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base" 
              href="/register"
            >
              Register
            </Link>
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5 text-sm lg:text-base" 
              href="/about"
            >
              About Us
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
              className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base" 
              href="/shop"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Shop
              </span>
            </Link>
            <Link 
              onClick={closeMobileMenu}
              className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base" 
              href="/login"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Login
              </span>
            </Link>
            <Link 
              onClick={closeMobileMenu}
              className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base" 
              href="/register"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Register
              </span>
            </Link>
            <Link 
              onClick={closeMobileMenu}
              className="text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-base" 
              href="/about"
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                About Us
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}