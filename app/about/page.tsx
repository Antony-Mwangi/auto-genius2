"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

/* ---------------- SVG ICONS (no emojis) ---------------- */
type IconProps = { className?: string };

const IconEye = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTarget = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const IconSparkle = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

const IconBolt = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

const IconShieldCheck = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconHandshake = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m11 17 2 2a2 2 0 0 0 3-3" />
    <path d="m14 14 2.5 2.5a2 2 0 0 0 3-3l-4-4a2 2 0 0 0-2.8 0L11 11" />
    <path d="m3 8 3-3 4 4" />
    <path d="m6 5 4-2 5 5-4 4" />
    <path d="M3 8v6l4 4" />
  </svg>
);

const IconCar = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 16h14" />
    <path d="M6 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
    <path d="M15 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
    <path d="M4 16v-4l2-5h12l2 5v4" />
    <circle cx="7.5" cy="13" r="1" />
    <circle cx="16.5" cy="13" r="1" />
  </svg>
);

const IconStore = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9 5 4h14l2 5" />
    <path d="M4 9v10h16V9" />
    <path d="M9 19v-5h6v5" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
);

const IconTruck = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

const IconChat = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.6 7.2L4 20l1.2-4.2A8 8 0 1 1 21 12Z" />
    <path d="M9 11h6M9 14h4" />
  </svg>
);

const IconGenuine = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    <path d="M12 8v4M12 15h.01" />
  </svg>
);

const IconLock = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v3" />
  </svg>
);

const IconArrowRight = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---------------- ANIMATION VARIANTS ---------------- */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

/* ---------------- DATA ---------------- */
const values = [
  { title: "UNCOMPROMISING EXCELLENCE", Icon: IconSparkle, tone: "text-orange-600" },
  { title: "PROACTIVE INNOVATION", Icon: IconBolt, tone: "text-teal-600" },
  { title: "ABSOLUTE RELIABILITY", Icon: IconShieldCheck, tone: "text-orange-600" },
  { title: "INTEGRITY IN MOTION", Icon: IconHandshake, tone: "text-teal-600" },
];

const whyBuyItems = [
  { label: "Quality-Checked Parts", Icon: IconShieldCheck },
  { label: "Japanese Vehicle Specialists", Icon: IconCar },
  { label: "Physical Shop in Nairobi", Icon: IconStore },
  { label: "Fast Parts Sourcing", Icon: IconTruck },
  { label: "WhatsApp Support", Icon: IconChat },
  { label: "Genuine & Quality Aftermarket Options", Icon: IconGenuine },
  { label: "Secure Payments", Icon: IconLock },
];

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
                const next = [...prev];
                next[index] = true;
                return next;
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
      observers.forEach((o) => o && o.disconnect());
    };
  }, []);

  const getAnimationClass = (index: number) =>
    visibleSections[index]
      ? "animate-slide-down opacity-100"
      : "opacity-0 -translate-y-10";

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
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
            <span className="inline-block w-1 h-8 bg-orange-500 rounded-full" />
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

      {/* THE AUTO & THE GENIUS — flat two-column with hairline divider */}
      <motion.div
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(2)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[2] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
            <motion.div className="md:pr-12" variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
                  <span className="font-bold text-sm">A</span>
                </span>
                <h3 className="font-bold text-xl text-orange-600">The Auto</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Represents the machine—Japanese automotive perfection, precision engineering, and specialized product knowledge.
                We understand every component and its role in keeping your vehicle running at peak performance.
              </p>
            </motion.div>

            <div className="hidden md:block w-px bg-gray-200" aria-hidden="true" />

            <motion.div className="md:pl-12" variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-500 text-white">
                  <span className="font-bold text-sm">G</span>
                </span>
                <h3 className="font-bold text-xl text-teal-600">The Genius</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Represents the system—smart execution, proactive planning, and structured flawless delivery.
                We ensure that every order is processed efficiently and delivered on time, every time.
              </p>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* VISION & MISSION — flat two-column with hairline divider */}
      <motion.div
        ref={(el) => { sectionRefs.current[3] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(3)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[3] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
            <motion.div className="md:pr-12" variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4 text-orange-600">
                <IconEye className="w-6 h-6" />
                <h3 className="text-xl font-bold">Vision</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                To be the ultimate benchmark of automotive excellence and innovation, empowering every vehicle owner
                with smart, reliable spare parts solutions.
              </p>
            </motion.div>

            <div className="hidden md:block w-px bg-gray-200" aria-hidden="true" />

            <motion.div className="md:pl-12" variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-4 text-teal-600">
                <IconTarget className="w-6 h-6" />
                <h3 className="text-xl font-bold">Mission</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                To eliminate downtime by providing high-quality Japanese automotive parts with a smart, data-driven
                supply chain that ensures availability and reliability.
              </p>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* OUR VALUES — plain typography + icons */}
      <motion.div
        ref={(el) => { sectionRefs.current[4] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(4)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[4] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-8 text-orange-600 flex items-center gap-3"
            variants={fadeInUp}
          >
            <span className="inline-block w-1 h-8 bg-orange-500 rounded-full" />
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map(({ title, Icon, tone }) => (
              <motion.div
                key={title}
                className="flex items-start gap-3"
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
              >
                <span className={`mt-0.5 ${tone}`}>
                  <Icon className="w-6 h-6" />
                </span>
                <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug">
                  {title}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      {/* WHY BUY FROM AUTOGENIUS — flat checklist grid */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 flex items-center gap-3">
          <span className="inline-block w-1 h-8 bg-orange-500 rounded-full" />
          Why Buy From Autogenius?
        </h2>
        <p className="mt-4 text-gray-700 text-base sm:text-lg max-w-2xl">
          Everything you need from one trusted Nairobi-based partner—quality parts, fast sourcing, and support you can count on.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
          {whyBuyItems.map(({ label, Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-teal-600 mt-0.5">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-gray-800 font-medium leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA — flat editorial band, no card */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="border-t-2 border-orange-500 pt-10 sm:pt-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Ready to Experience the Autogenius Difference?
              </h2>
              <p className="mt-3 text-gray-700 text-base sm:text-lg">
                Shop genuine spare parts with confidence. Quality guaranteed, delivered fast.
              </p>
            </div>

            <motion.div
              className="shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors duration-200"
              >
                Start Shopping Now <IconArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}