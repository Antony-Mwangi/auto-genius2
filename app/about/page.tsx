"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize visibility state
    const totalSections = 6; // Hero, Who We Are, Auto, Genius, Vision & Mission, Values
    setVisibleSections(new Array(totalSections).fill(false));

    // Intersection Observer for each section
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

    // Cleanup observers
    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, []);

  // Animation classes for falling effect
  const getAnimationClass = (index: number) => {
    return visibleSections[index]
      ? "animate-slide-down opacity-100"
      : "opacity-0 -translate-y-10";
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col">
      
      {/* GLOBAL NAVIGATION */}
      <Navbar />

      {/* HERO */}
      <div
        ref={(el) => { sectionRefs.current[0] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(0)}`}
      >
        <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-orange-500">
            AUTOGENIUS SPARE PARTS LTD
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-white">
            PRECISION PARTS. SMARTER SOLUTIONS. ABSOLUTE RELIABILITY.
          </p>
        </section>
      </div>

      {/* WHO WE ARE */}
      <div
        ref={(el) => { sectionRefs.current[1] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(1)}`}
      >
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Who We Are</h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Autogenius Spare Parts Ltd is built on a foundation of Excellence, Innovation, and Reliability.
          </p>
        </section>
      </div>

      {/* GENIUS FACTOR */}
      <div
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(2)}`}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-400" />
              <h3 className="font-bold text-base sm:text-lg">The Auto</h3>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Represents the machine—Japanese automotive perfection, precision engineering, and specialized product knowledge.
            </p>
          </div>
        </section>
      </div>

      {/* GENIUS FACTOR - Second card */}
      <div
        ref={(el) => { sectionRefs.current[3] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(3)}`}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-400" />
              <h3 className="font-bold text-base sm:text-lg">The Genius</h3>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              Represents the system—smart execution, proactive planning, and structured flawless delivery.
            </p>
          </div>
        </section>
      </div>

      {/* VISION & MISSION */}
      <div
        ref={(el) => { sectionRefs.current[4] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(4)}`}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-base sm:text-lg font-bold mb-2 text-orange-400">Vision</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              To be the ultimate benchmark of automotive excellence and innovation, empowering every vehicle owner with smart, reliable spare parts solutions.
            </p>
          </div>
          <div className="p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-base sm:text-lg font-bold mb-2 text-teal-400">Mission</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              To eliminate downtime by providing high-quality Japanese automotive parts with a smart, data-driven supply chain.
            </p>
          </div>
        </section>
      </div>

      {/* VALUES */}
      <div
        ref={(el) => { sectionRefs.current[5] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(5)}`}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {["UNCOMPROMISING EXCELLENCE", "PROACTIVE INNOVATION", "ABSOLUTE RELIABILITY", "INTEGRITY IN MOTION"].map((value) => (
              <div key={value} className="p-4 sm:p-5 bg-white/5 rounded-lg border border-white/10 text-sm sm:text-base">
                {value}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* GLOBAL FOOTER */}
      <Footer />
    </main>
  );
}