// "use client";

// import Image from "next/image";
// import Link from "next/link";

// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaWhatsapp,
//   FaClock,
// } from "react-icons/fa";

// export default function HomePage() {
//   return (
//     <main className="min-h-screen bg-[#0b0f14] text-white overflow-x-hidden">
//       {/* NAVBAR */}
//       <header className="border-b border-white/10 bg-[#111827]">
//         <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4">
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-3">
//             <Image
//               src="/logo.jpeg"
//               alt="AUTOGENIUS Spare Parts LTD"
//               width={50}
//               height={50}
//               priority
//               className="rounded-full"
//             />
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
//                 AUTOGENIUS
//               </h1>
//               <p className="text-xs text-gray-400">Spare Parts LTD</p>
//             </div>
//           </Link>

//           {/* NAVIGATION */}
//           <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm justify-start md:justify-end">
//             <Link className="hover:text-orange-400 transition" href="/shop">
//               Shop
//             </Link>
//             <Link className="hover:text-orange-400 transition" href="/login">
//               Login
//             </Link>
//             <Link
//               className="rounded-lg bg-orange-500 px-4 py-2 font-semibold transition hover:bg-orange-400"
//               href="/register"
//             >
//               Register
//             </Link>
//             <Link className="hover:text-orange-400 transition" href="/about">
//               About-us
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20 md:grid-cols-2">
//         {/* LEFT */}
//         <div>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
//             Genuine <span className="text-orange-500">Auto Spare Parts</span>
//             <br />
//             Delivered Fast
//           </h2>
//           <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-400">
//             AUTOGENIUS Spare Parts LTD supplies quality engine, suspension,
//             braking and electrical parts for Toyota, Nissan, Subaru, Honda,
//             Mazda, Mitsubishi and many other vehicles across Kenya.
//           </p>
//           <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
//             <Link
//               href="/shop"
//               className="text-center rounded-lg bg-orange-500 px-6 py-3 font-semibold shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
//             >
//               Shop as a Guest
//             </Link>
//             <Link
//               href="/login"
//               className="text-center rounded-lg border border-teal-400 px-6 py-3 font-semibold transition hover:bg-teal-400 hover:text-black"
//             >
//               Login
//             </Link>
//           </div>
//         </div>

//         {/* RIGHT CARD */}
//         <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
//           <h3 className="text-xl sm:text-2xl font-bold text-orange-400">
//             AUTOGENIUS Spare Parts LTD
//           </h3>
//           <div className="mt-6 space-y-5 text-gray-300 text-sm sm:text-base">
//             <div className="flex items-start gap-3">
//               <FaMapMarkerAlt className="mt-1 text-orange-500 flex-shrink-0" />
//               <div>
//                 <p className="font-semibold text-white">Location</p>
//                 <p>
//                   Kirinyaga Road <br />
//                   MSP PLAZA <br />
//                   Shop B-02
//                 </p>
//               </div>
//             </div>
//             <a href="tel:+254714200500" className="flex items-start gap-3 hover:text-orange-500 transition">
//               <FaPhoneAlt className="mt-1 text-orange-500 flex-shrink-0" />
//               <div>
//                 <p className="font-semibold text-white">Phone</p>
//                 <p>+254 714 200 500</p>
//               </div>
//             </a>
//             <a href="mailto:autogeniusspares25@gmail.com" className="flex items-start gap-3 hover:text-orange-500 transition">
//               <FaEnvelope className="mt-1 text-orange-500 flex-shrink-0" />
//               <div>
//                 <p className="font-semibold text-white">Email</p>
//                 <p className="break-words">autogeniusspares25@gmail.com</p>
//               </div>
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="border-t border-white/10 bg-[#111827]">
//         <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
//           <div>
//             <div className="flex items-center gap-3">
//               <Image src="/logo.jpeg" alt="AUTOGENIUS" width={45} height={45} className="rounded-full" />
//               <div>
//                 <h3 className="text-lg font-bold text-orange-500">AUTOGENIUS</h3>
//                 <p className="text-xs text-gray-400">Spare Parts LTD</p>
//               </div>
//             </div>
//             <p className="mt-5 text-sm text-gray-400">
//               Your trusted destination for genuine automotive spare parts, reliable service and fast delivery across Kenya.
//             </p>
//           </div>

//           <div>
//             <h4 className="mb-5 text-lg font-semibold text-white">Contact</h4>
//             <div className="space-y-4 text-sm text-gray-400">
//               <a href="tel:+254714200500" className="flex items-center gap-3 hover:text-orange-500 transition">
//                 <FaPhoneAlt className="text-orange-500" /> <span>+254 714 200 500</span>
//               </a>
//               <a href="mailto:autogeniusspares25@gmail.com" className="flex items-center gap-3 hover:text-orange-500 transition">
//                 <FaEnvelope className="text-orange-500" /> <span className="break-words">autogeniusspares25@gmail.com</span>
//               </a>
//               <div className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 text-orange-500" /> <span>Kirinyaga Rd, MSP PLAZA, Shop B-02</span></div>
//             </div>
//           </div>

//           <div>
//             <h4 className="mb-5 text-lg font-semibold text-white">Sales Executive</h4>
//             <p className="font-semibold text-orange-400">Ponciano Mutua</p>
//             <div className="mt-5 flex items-center gap-3 text-gray-400">
//               <FaClock className="text-orange-500" />
//               <span>Mon - Sat <br /> 8:00 AM - 6:00 PM</span>
//             </div>
//           </div>

//           <div>
//             <h4 className="mb-5 text-lg font-semibold text-white">Connect</h4>
//             <div className="flex gap-4">
//               <a href="https://wa.me/254714200500" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-3 hover:bg-green-600 transition text-white">
//                 <FaWhatsapp size={20} />
//               </a>
//             </div>
//             <Link href="/shop" className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold transition hover:bg-orange-400">Start Shopping</Link>
//           </div>
//         </div>

//         <div className="border-t border-white/10 py-5 text-center text-xs sm:text-sm text-gray-500">
//           © {new Date().getFullYear()} AUTOGENIUS Spare Parts LTD. All Rights Reserved.
//         </div>
//       </footer>
//     </main>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
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
      {/* NAVBAR - Dark Background - Fixed */}
      <header className="border-b border-white/10 bg-[#111827] shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                src="/logo.jpeg"
                alt="AUTOGENIUS Spare Parts LTD"
                width={50}
                height={50}
                priority
                className="rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 transition-colors"
              />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
                AUTOGENIUS
              </h1>
              <p className="text-xs text-gray-400">Spare Parts LTD</p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap gap-3 sm:gap-4 text-sm justify-start md:justify-end items-center">
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10" 
              href="/shop"
            >
              Shop
            </Link>
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10" 
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              href="/register"
            >
              Register
            </Link>
            <Link 
              className="text-gray-300 hover:text-orange-400 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10" 
              href="/about"
            >
              About-us
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[88px] md:h-[96px]"></div>

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

      {/* FOOTER - Dark Background */}
      <motion.footer 
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="border-t border-white/10 bg-[#111827] mt-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3">
                <Image src="/logo.jpeg" alt="AUTOGENIUS" width={45} height={45} className="rounded-full border-2 border-orange-500/30" />
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