"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <header className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="AUTOGENIUS Spare Parts LTD"
              width={50}
              height={50}
              priority
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
                AUTOGENIUS
              </h1>
              <p className="text-xs text-gray-400">Spare Parts LTD</p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm justify-start md:justify-end">
            <Link className="hover:text-orange-400 transition" href="/shop">
              Shop
            </Link>
            <Link className="hover:text-orange-400 transition" href="/login">
              Login
            </Link>
            <Link
              className="rounded-lg bg-orange-500 px-4 py-2 font-semibold transition hover:bg-orange-400"
              href="/register"
            >
              Register
            </Link>
            <Link className="hover:text-orange-400 transition" href="/about">
              About-us
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20 md:grid-cols-2">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Genuine <span className="text-orange-500">Auto Spare Parts</span>
            <br />
            Delivered Fast
          </h2>
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-400">
            AUTOGENIUS Spare Parts LTD supplies quality engine, suspension,
            braking and electrical parts for Toyota, Nissan, Subaru, Honda,
            Mazda, Mitsubishi and many other vehicles across Kenya.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="text-center rounded-lg bg-orange-500 px-6 py-3 font-semibold shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              Shop as a Guest
            </Link>
            <Link
              href="/login"
              className="text-center rounded-lg border border-teal-400 px-6 py-3 font-semibold transition hover:bg-teal-400 hover:text-black"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <h3 className="text-xl sm:text-2xl font-bold text-orange-400">
            AUTOGENIUS Spare Parts LTD
          </h3>
          <div className="mt-6 space-y-5 text-gray-300 text-sm sm:text-base">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Location</p>
                <p>
                  Kirinyaga Road <br />
                  MSP PLAZA <br />
                  Shop B-02
                </p>
              </div>
            </div>
            <a href="tel:+254714200500" className="flex items-start gap-3 hover:text-orange-500 transition">
              <FaPhoneAlt className="mt-1 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+254 714 200 500</p>
              </div>
            </a>
            <a href="mailto:autogeniusspares25@gmail.com" className="flex items-start gap-3 hover:text-orange-500 transition">
              <FaEnvelope className="mt-1 text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="break-words">autogeniusspares25@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#111827]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.jpeg" alt="AUTOGENIUS" width={45} height={45} className="rounded-full" />
              <div>
                <h3 className="text-lg font-bold text-orange-500">AUTOGENIUS</h3>
                <p className="text-xs text-gray-400">Spare Parts LTD</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-gray-400">
              Your trusted destination for genuine automotive spare parts, reliable service and fast delivery across Kenya.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <a href="tel:+254714200500" className="flex items-center gap-3 hover:text-orange-500 transition">
                <FaPhoneAlt className="text-orange-500" /> <span>+254 714 200 500</span>
              </a>
              <a href="mailto:autogeniusspares25@gmail.com" className="flex items-center gap-3 hover:text-orange-500 transition">
                <FaEnvelope className="text-orange-500" /> <span className="break-words">autogeniusspares25@gmail.com</span>
              </a>
              <div className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 text-orange-500" /> <span>Kirinyaga Rd, MSP PLAZA, Shop B-02</span></div>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">Sales Executive</h4>
            <p className="font-semibold text-orange-400">Ponciano Mutua</p>
            <div className="mt-5 flex items-center gap-3 text-gray-400">
              <FaClock className="text-orange-500" />
              <span>Mon - Sat <br /> 8:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">Connect</h4>
            <div className="flex gap-4">
              <a href="https://wa.me/254714200500" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-3 hover:bg-green-600 transition text-white">
                <FaWhatsapp size={20} />
              </a>
            </div>
            <Link href="/shop" className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold transition hover:bg-orange-400">Start Shopping</Link>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}