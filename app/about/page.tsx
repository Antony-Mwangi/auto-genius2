"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardHover = {
  hover: {
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const totalSections = 6;
    setVisibleSections(new Array(totalSections).fill(false));

    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, []);

  const getAnimationClass = (index: number) => {
    return visibleSections[index]
      ? "animate-slide-down opacity-100"
      : "opacity-0 -translate-y-10";
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      
      {/* GLOBAL NAVIGATION */}
      <Navbar />

      {/* HERO */}
      <motion.div
        ref={(el) => { sectionRefs.current[0] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(0)}`}
        initial="hidden"
        animate={visibleSections[0] ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <section className="text-center py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-orange-50 to-white">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide text-orange-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            AUTOGENIUS SPARE PARTS LTD
          </motion.h1>
          <motion.p 
            className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            PRECISION PARTS. SMARTER SOLUTIONS. ABSOLUTE RELIABILITY.
          </motion.p>
          <motion.div 
            className="mt-6 w-24 h-1 bg-orange-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </section>
      </motion.div>

      {/* WHO WE ARE */}
      <motion.div
        ref={(el) => { sectionRefs.current[1] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(1)}`}
        variants={fadeInUp}
        initial="hidden"
        animate={visibleSections[1] ? "visible" : "hidden"}
      >
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-4 text-orange-600 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={visibleSections[1] ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block w-1 h-8 bg-orange-500 rounded-full"></span>
            Who We Are
          </motion.h2>
          <motion.p 
            className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            animate={visibleSections[1] ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Autogenius Spare Parts Ltd is built on a foundation of Excellence, Innovation, and Reliability. 
            We are committed to providing the highest quality automotive spare parts with exceptional service 
            and support to our customers across Kenya.
          </motion.p>
        </section>
      </motion.div>

      {/* THE AUTO & THE GENIUS - Two columns */}
      <motion.div
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(2)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[2] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* THE AUTO */}
          <motion.div 
            className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-orange-200 shadow-md hover:shadow-xl transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#f97316" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <h3 className="font-bold text-xl text-orange-600">The Auto</h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Represents the machine—Japanese automotive perfection, precision engineering, and specialized product knowledge. 
              We understand every component and its role in keeping your vehicle running at peak performance.
            </p>
          </motion.div>

          {/* THE GENIUS */}
          <motion.div 
            className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-teal-200 shadow-md hover:shadow-xl transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.02, borderColor: "#14b8a6" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <h3 className="font-bold text-xl text-teal-600">The Genius</h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Represents the system—smart execution, proactive planning, and structured flawless delivery. 
              We ensure that every order is processed efficiently and delivered on time, every time.
            </p>
          </motion.div>
        </section>
      </motion.div>

      {/* VISION & MISSION */}
      <motion.div
        ref={(el) => { sectionRefs.current[3] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(3)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[3] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* VISION */}
          <motion.div 
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 shadow-md hover:shadow-xl transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👁️</span>
              <h3 className="text-xl font-bold text-orange-600">Vision</h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              To be the ultimate benchmark of automotive excellence and innovation, empowering every vehicle owner with smart, reliable spare parts solutions.
            </p>
          </motion.div>

          {/* MISSION */}
          <motion.div 
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 shadow-md hover:shadow-xl transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <h3 className="text-xl font-bold text-teal-600">Mission</h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              To eliminate downtime by providing high-quality Japanese automotive parts with a smart, data-driven supply chain that ensures availability and reliability.
            </p>
          </motion.div>
        </section>
      </motion.div>

      {/* VALUES */}
      <motion.div
        ref={(el) => { sectionRefs.current[4] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(4)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[4] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 text-orange-600 flex items-center gap-3"
            variants={fadeInUp}
          >
            <span className="inline-block w-1 h-8 bg-orange-500 rounded-full"></span>
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "UNCOMPROMISING EXCELLENCE", icon: "⭐", color: "orange" },
              { value: "PROACTIVE INNOVATION", icon: "💡", color: "blue" },
              { value: "ABSOLUTE RELIABILITY", icon: "🔒", color: "green" },
              { value: "INTEGRITY IN MOTION", icon: "🤝", color: "purple" },
            ].map((item, index) => (
              <motion.div 
                key={item.value}
                className={`p-5 sm:p-6 rounded-xl bg-white border-2 border-${item.color}-200 shadow-md hover:shadow-xl transition-all duration-300 text-center group cursor-default`}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: item.color === 'orange' ? '#f97316' : 
                               item.color === 'blue' ? '#3b82f6' :
                               item.color === 'green' ? '#22c55e' : '#a855f7',
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className={`font-bold text-${item.color}-600 text-sm sm:text-base`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      {/* CTA SECTION */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Experience the Autogenius Difference?
          </motion.h2>
          <motion.p 
            className="text-white/90 text-base sm:text-lg mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Shop genuine spare parts with confidence. Quality guaranteed, delivered fast.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/shop"
              className="inline-block bg-white text-orange-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Shopping Now →
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* GLOBAL FOOTER */}
      <Footer />
    </main>
  );
}