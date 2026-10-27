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
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// SVG Icons
const Icons = {
  ShieldCheck: () => (
    <svg className="w-16 h-16 text-orange-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  ClipboardCheck: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  ArrowsRightLeft: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  Banknotes: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5m-3-2.625t.75-.75h7.5M4.5 9h10.125c.621 0 1.125.504 1.125 1.125v4.5m-12.375 0h.008v.008H3.375v-.008Z" />
    </svg>
  ),
  DocumentText: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  Scale: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  ),
  PencilSquare: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
};

// Policy section data
const policySections = [
  {
    id: "return-period",
    number: "1",
    title: "Return Period",
    icon: <Icons.Calendar />,
    content: (
      <p className="text-gray-700 text-base leading-relaxed">
        Customers may request a return within <strong className="text-gray-900">7 calendar days</strong> of receiving their order, provided the item meets the eligibility conditions outlined in this policy.
      </p>
    ),
  },
  {
    id: "eligible-returns",
    number: "2",
    title: "Eligible Returns",
    icon: <Icons.CheckCircle />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">Returns may be accepted under the following circumstances:</p>
        <ul className="space-y-2">
          {[
            { label: "Wrong item delivered", desc: "The item received differs from the item ordered." },
            { label: "Damaged item", desc: "The item arrives damaged before or during delivery." },
            { label: "Defective item", desc: "The part has a manufacturing defect, subject to inspection and applicable warranty terms." },
            { label: "Incorrect fitment", desc: "The part is incompatible with the vehicle despite the customer providing accurate vehicle details and Autogenius Spare Parts Ltd confirming compatibility." },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">{item.label}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "conditions-for-returns",
    number: "3",
    title: "Conditions for Returns",
    icon: <Icons.ClipboardCheck />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">To qualify for a return:</p>
        <ul className="space-y-2">
          {[
            "The item must be unused, uninstalled, and in its original condition, except where reasonable inspection is necessary to identify a defect.",
            "Original packaging, labels, and accessories should be included where reasonably possible.",
            "Proof of purchase, such as an order number or receipt, must be provided.",
            "The return request must be submitted within the applicable return period.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "non-returnable-items",
    number: "4",
    title: "Non-Returnable Items",
    icon: <Icons.XCircle />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">
          The following items are generally not eligible for return unless defective, incorrectly supplied, misdescribed, or otherwise covered by applicable law:
        </p>
        <ul className="space-y-2">
          {[
            "Parts that have been installed, used, modified, or damaged after delivery.",
            "Parts ordered incorrectly by the customer when the item supplied matches the order and the compatibility information provided.",
            "Custom-made or specially ordered parts where the return restriction was disclosed before purchase.",
            "Items without sufficient proof of purchase.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "incorrect-orders",
    number: "5",
    title: "Incorrect Orders and Compatibility Issues",
    icon: <Icons.ArrowsRightLeft />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>
          Customers are encouraged to confirm their vehicle's make, model, year, engine type, and part number before placing an order.
        </p>
        <p>
          If a customer orders the wrong part, a return or exchange may be considered if the item remains unused, uninstalled, and eligible under this policy. The customer may be responsible for return shipping costs.
        </p>
        <p>
          If Autogenius Spare Parts Ltd confirms compatibility but supplies an incompatible part despite receiving accurate vehicle information, the company will arrange an appropriate replacement, exchange, or refund.
        </p>
      </div>
    ),
  },
  {
    id: "refunds",
    number: "6",
    title: "Refunds",
    icon: <Icons.Banknotes />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>All returned items are subject to inspection before a refund is approved.</p>
        <p>Approved refunds will be processed through the original payment method where possible or another mutually agreed method.</p>
        <p>
          Autogenius Spare Parts Ltd aims to process approved refunds within <strong className="text-gray-900">5–10 business days</strong> after approval. The time required for funds to reflect in the customer's account may depend on the payment provider.
        </p>
        <p>Where required by law or appropriate because of the company's error, applicable delivery charges will also be refunded.</p>
      </div>
    ),
  },
  {
    id: "exchanges",
    number: "7",
    title: "Exchanges and Replacements",
    icon: <Icons.Refresh />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>Customers may request an exchange or replacement instead of a refund, subject to product availability and approval.</p>
        <p>Replacement items will generally be dispatched after the returned item has been received and inspected, unless another arrangement is agreed upon.</p>
      </div>
    ),
  },
  {
    id: "return-shipping",
    number: "8",
    title: "Return Shipping Costs",
    icon: <Icons.Truck />,
    content: (
      <ul className="space-y-2">
        {[
          { label: "Wrong item supplied or qualifying defective item", desc: "Autogenius Spare Parts Ltd will arrange or cover reasonable return shipping costs, as applicable." },
          { label: "Customer ordering error", desc: "The customer may be responsible for return shipping costs." },
          { label: "Other approved returns", desc: "Applicable shipping costs will be communicated before the return is completed." },
        ].map((item) => (
          <li key={item.label} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span>
              <strong className="text-gray-900">{item.label}:</strong> {item.desc}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "return-procedure",
    number: "9",
    title: "Return Procedure",
    icon: <Icons.DocumentText />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>Customers requesting a return must provide the following information through the return request process on the website:</p>
        <ol className="space-y-2 list-none">
          {[
            "Order number or proof of purchase.",
            "Name and part number of the item.",
            "Reason for the return.",
            "Photographs or videos showing the issue, where applicable.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p>Customers must receive return instructions before sending items back. Returned items should be sent to the designated return address provided by the company.</p>
      </div>
    ),
  },
  {
    id: "warranty",
    number: "10",
    title: "Warranty and Consumer Rights",
    icon: <Icons.Scale />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>Certain spare parts may be covered by manufacturer or supplier warranties. Applicable warranty terms and claim procedures will be communicated where relevant.</p>
        <p>Nothing in this policy excludes or limits any mandatory consumer rights available under Kenyan law.</p>
      </div>
    ),
  },
  {
    id: "policy-amendments",
    number: "11",
    title: "Policy Amendments",
    icon: <Icons.PencilSquare />,
    content: (
      <p className="text-gray-700 text-base leading-relaxed">
        Autogenius Spare Parts Ltd reserves the right to update this policy when necessary. Any revisions will be published on the company's website and will apply in accordance with applicable law.
      </p>
    ),
  },
];

export default function ReturnPolicyPage() {
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const totalSections = 3; // Hero, Intro, List
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
          <Icons.ShieldCheck />
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide text-orange-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            RETURN &amp; REFUND POLICY
          </motion.h1>
          <motion.p
            className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            TRANSPARENT RETURNS. FAIR REFUNDS. ABSOLUTE RELIABILITY.
          </motion.p>
          <motion.div
            className="mt-6 w-24 h-1 bg-orange-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </section>
      </motion.div>

      {/* INTRO */}
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
            Our Commitment
          </motion.h2>
          <motion.p
            className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            animate={visibleSections[1] ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Autogenius Spare Parts Ltd is committed to providing quality automotive spare parts and ensuring customer satisfaction.
            This policy outlines the conditions and procedures for returning items purchased through our e-commerce website.
          </motion.p>
        </section>
      </motion.div>

      {/* POLICY SECTIONS */}
      <motion.div
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(2)}`}
        variants={staggerContainer}
        initial="hidden"
        animate={visibleSections[2] ? "visible" : "hidden"}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
          {policySections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 mt-0.5">{section.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-orange-600 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex-shrink-0">
                    {section.number}
                  </span>
                  {section.title}
                </h3>
              </div>
              <div className="pl-0 sm:pl-8">
                {section.content}
              </div>
            </motion.div>
          ))}
        </section>
      </motion.div>

      {/* CTA */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-4 text-orange-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Need Help With a Return?
          </motion.h2>
          <motion.p
            className="text-gray-700 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our team is ready to assist you with any return, exchange, or refund request.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-200 hover:shadow-xl transition-all duration-200"
            >
              Start Shopping Now →
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}