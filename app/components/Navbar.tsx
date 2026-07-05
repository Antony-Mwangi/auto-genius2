"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#111827]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="AUTOGENIUS" width={50} height={50} priority className="rounded-full" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500">AUTOGENIUS</h1>
            <p className="text-xs text-gray-400">Spare Parts LTD</p>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm justify-start md:justify-end">
          <Link className="hover:text-orange-400 transition" href="/shop">Shop</Link>
          <Link className="hover:text-orange-400 transition" href="/login">Login</Link>
          <Link className="rounded-lg bg-orange-500 px-4 py-2 font-semibold transition hover:bg-orange-400" href="/register">Register</Link>
          <Link className="hover:text-orange-400 transition" href="/about">About-us</Link>
        </nav>
      </div>
    </header>
  );
}