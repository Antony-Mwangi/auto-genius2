"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from "react-icons/fa";

export default function Footer() {
  return (
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
          <p className="mt-5 text-sm text-gray-400">Your trusted destination for genuine automotive spare parts across Kenya.</p>
        </div>

        <div>
          <h4 className="mb-5 text-lg font-semibold text-white">Contact</h4>
          <div className="space-y-4 text-sm text-gray-400">
            <a href="tel:+254714200500" className="flex items-center gap-3 hover:text-orange-500 transition">
              <FaPhoneAlt className="text-orange-500" /> <span>+254 714 200 500</span>
            </a>
            <a href="mailto:autogeniusspares25@gmail.com" className="flex items-center gap-3 hover:text-orange-500 transition">
              <FaEnvelope className="text-orange-500" /> <span>autogeniusspares25@gmail.com</span>
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
  );
}