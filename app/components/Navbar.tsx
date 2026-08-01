"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-black shadow-lg">
      {/* Increased height to accommodate the large, borderless logo */}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 h-28 md:h-32">
        
        {/* LOGO - Large, Borderless, Blended, with spacing above */}
        <Link href="/" className="flex items-center justify-center select-none pt-2 md:pt-4 z-10">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            <Image
              src="/logo.jpeg"
              alt="AUTOGENIUS Spare Parts LTD"
              fill
              priority
              className="object-contain mix-blend-screen bg-transparent"
            />
          </div>
        </Link>

        {/* NAVIGATION - Clean, dark-mode text links */}
        <nav className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm justify-end ml-auto w-full md:w-auto">
          <Link 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-white/5" 
            href="/shop"
          >
            Shop
          </Link>
          <Link 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-white/5" 
            href="/login"
          >
            Login
          </Link>
          <Link 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-white/5" 
            href="/register"
          >
            Register
          </Link>
          <Link 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-white/5" 
            href="/about"
          >
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}