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
  Car: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5m-3-2.625t.75-.75h7.5M4.5 9h10.125c.621 0 1.125.504 1.125 1.125v4.5m-12.375 0h.008v.008H3.375v-.008Z" />
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
  Globe: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Scale: () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  ),
};

// Policy section data
const policySections = [
  {
    id: "introduction",
    number: "1",
    title: "Return Policy",
    icon: <Icons.DocumentText />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>
          At Autogenius Spare Parts Ltd, we are committed to providing quality automotive spare parts, reliable service and a convenient shopping experience. Our goal is to ensure that every customer receives the correct parts for their vehicle and enjoys confidence when shopping with us.
        </p>
        <p>
          This policy explains the conditions under which customers may request a return, exchange or refund for purchases made through the Autogenius e-commerce website or our authorized sales channels.
        </p>
      </div>
    ),
  },
  {
    id: "eligibility",
    number: "2",
    title: "Eligibility for Returns and Exchanges",
    icon: <Icons.CheckCircle />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">Customers may request a return or exchange under the following circumstances:</p>
        <ul className="space-y-2">
          {[
            { label: "Incorrect item supplied", desc: "The item delivered does not match the item ordered." },
            { label: "Incorrect vehicle compatibility", desc: "The part supplied does not fit the vehicle despite the customer providing accurate vehicle details and Autogenius confirming compatibility." },
            { label: "Damaged item", desc: "The item arrives damaged before or during delivery, subject to verification." },
            { label: "Defective item", desc: "The part is found to have a manufacturing defect, subject to applicable warranty terms and assessment." },
            { label: "Order discrepancy", desc: "The quantity, specification or description of the supplied item differs materially from the confirmed order." },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">{item.label}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 text-base leading-relaxed">
          All requests will be reviewed individually and handled in accordance with this policy and applicable Kenyan law.
        </p>
      </div>
    ),
  },
  {
    id: "timeframe",
    number: "3",
    title: "Return Timeframe",
    icon: <Icons.Calendar />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>
          Customers should notify Autogenius of any return or exchange request within <strong className="text-gray-900">7 calendar days</strong> of receiving the item, provided the item meets the eligibility conditions outlined in this policy.
        </p>
        <p>
          For defective products, statutory rights and any applicable warranty terms will continue to apply, even where the above notification period has passed.
        </p>
        <p>
          Customers should contact our customer support team as soon as an issue is discovered and provide the order number, a description of the problem and clear photographs or videos where relevant.
        </p>
      </div>
    ),
  },
  {
    id: "conditions",
    number: "4",
    title: "Conditions for Returned Items",
    icon: <Icons.ClipboardCheck />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">
          Except where the item is defective, damaged, incorrectly supplied or otherwise subject to a legal remedy, returned products should meet the following conditions:
        </p>
        <ul className="space-y-2">
          {[
            "The item must be unused, uninstalled and in its original condition.",
            "Original packaging, labels, accessories and accompanying documents should be retained.",
            "The item must not show signs of improper handling, physical damage, alteration or misuse.",
            "The item must be accompanied by proof of purchase, such as an order confirmation, receipt or invoice.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 text-base leading-relaxed">
          <strong className="text-gray-900">Important to note:</strong> Automotive parts that have been installed, modified, used or damaged after delivery may require technical inspection before a return, exchange or warranty claim can be approved. This does not limit any remedies available under applicable law.
        </p>
      </div>
    ),
  },
  {
    id: "compatibility",
    number: "5",
    title: "Vehicle Compatibility and Correct Part Selection",
    icon: <Icons.Car />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>
          Autogenius supplies spare parts for a wide range of Japanese and other vehicle makes and models, including Toyota, Nissan, Subaru, Mazda, Mitsubishi, Suzuki and Honda.
        </p>
        <p>Customers are encouraged to provide accurate vehicle information, including:</p>
        <ul className="space-y-2">
          {[
            "Vehicle make and model.",
            "Year of manufacture and model generation.",
            "Engine capacity or engine code, where applicable.",
            "Chassis number or VIN, where available.",
            "Part number, photographs or other relevant specifications.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          Where Autogenius confirms compatibility using the information provided, and the supplied item is nevertheless incompatible, the customer may request an assessment for an exchange or refund.
        </p>
        <p>
          Where the customer independently selects an item without a compatibility confirmation from Autogenius and provides incomplete or inaccurate vehicle information, the request will be assessed based on the circumstances and applicable consumer rights.
        </p>
        <p>Customers should verify part compatibility before installation. Professional installation is recommended.</p>
      </div>
    ),
  },
  {
    id: "non-returnable",
    number: "6",
    title: "Non-Returnable Items",
    icon: <Icons.XCircle />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">
          Subject to applicable law and any defect, misdescription or other legally recognized remedy, the following items may not qualify for a change-of-mind return:
        </p>
        <ul className="space-y-2">
          {[
            "Special-order, customized or specially sourced parts.",
            "Electrical or electronic components that have been installed, connected or damaged through improper handling.",
            "Used, dismantled or salvage parts sold with their condition clearly disclosed.",
            "Items damaged through improper installation, misuse, unauthorized modification or failure to follow manufacturer instructions.",
            "Items sold under a clearly disclosed final-sale arrangement, where permitted by law.",
            "Parts ordered incorrectly by the customer when the item supplied matches the order and the compatibility information provided.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 text-base leading-relaxed">
          This section does not exclude a customer's statutory rights where an item is defective, misdescribed, not fit for its represented purpose or otherwise qualifies for a legal remedy.
        </p>
      </div>
    ),
  },
  {
    id: "special-orders",
    number: "7",
    title: "Special Orders and Internationally Sourced Products",
    icon: <Icons.Globe />,
    content: (
      <div className="space-y-3 text-gray-700 text-base leading-relaxed">
        <p>
          Products specially ordered, sourced, or imported by Autogenius from international suppliers or overseas markets specifically at a customer's request may be subject to additional terms and conditions, which will be communicated to the customer before the order is confirmed.
        </p>
        <p>
          Once a special order has been confirmed and the sourcing, procurement, or importation process has commenced, cancellation or refund requests may be subject to costs already reasonably and irreversibly incurred by Autogenius on the customer's behalf, including supplier payments, international shipping, handling, customs clearance, and other directly related expenses, to the extent permitted by applicable law.
        </p>
        <p>
          Where a special-order product cannot be supplied, is unavailable from the supplier, or cannot be delivered for reasons attributable to Autogenius or its supplier, Autogenius will communicate the available options, which may include a replacement, an agreed alternative product, or a refund, as appropriate under the circumstances and applicable law.
        </p>
        <p>
          If a special-order product arrives damaged, defective, incorrect, or materially different from the specifications agreed upon with the customer, Autogenius will assess the claim and provide an appropriate remedy in accordance with applicable law.
        </p>
        <p>
          Customers are responsible for providing accurate vehicle details, part specifications, and other information necessary to identify the correct product. However, this requirement does not exclude any rights or remedies available to customers where a product is incorrectly supplied, misrepresented, or otherwise fails to meet applicable legal requirements.
        </p>
        <p>
          Any non-refundable supplier deposits or other special-order commitments will be disclosed to the customer before payment or order confirmation. Autogenius will not apply blanket exclusions, arbitrary deductions, or non-refundable terms that are prohibited by applicable law.
        </p>
        <p>
          By confirming a special order, the customer acknowledges the specific sourcing arrangements, estimated delivery timelines, and applicable terms communicated before the order is placed.
        </p>
      </div>
    ),
  },
  {
    id: "refunds",
    number: "8",
    title: "Refund Policy",
    icon: <Icons.Banknotes />,
    content: (
      <div className="space-y-3">
        <p className="text-gray-700 text-base leading-relaxed">
          Where a refund is approved, Autogenius will communicate the applicable refund method and processing timeframe to the customer.
        </p>
        <ul className="space-y-2">
          {[
            "Refunds will generally be made through the original payment method where reasonably available.",
            "Where the original method cannot be used, an alternative mutually agreed method may be arranged.",
            "Refunds for eligible M-Pesa, bank, card or other electronic payments will be processed in accordance with the relevant payment provider's procedures.",
            "Any refund will reflect the amount the customer is legally entitled to recover under the circumstances.",
            "Autogenius Spare Parts Ltd aims to process approved refunds within 5–10 business days after approval. The time required for funds to reflect in the customer's account may depend on the payment provider.",
            "Delivery charges, return transport costs and other related charges will be handled in accordance with applicable law and the reason for the return.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-base leading-relaxed">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 text-base leading-relaxed">
          Autogenius will not impose an arbitrary restocking fee or deduction where prohibited by law.
        </p>
      </div>
    ),
  },
  {
    id: "consumer-rights",
    number: "9",
    title: "Consumer Rights",
    icon: <Icons.Scale />,
    content: (
      <p className="text-gray-700 text-base leading-relaxed">
        Nothing in this policy excludes or limits any mandatory consumer rights available under Kenyan law. Customers retain all statutory rights and remedies in respect of defective, misdescribed or unfit products.
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
            Autogenius Spare Parts Ltd is committed to providing quality automotive spare parts, reliable service and a convenient shopping experience. This policy outlines how returns, exchanges and refunds are handled for purchases made through our website or authorized sales channels, in accordance with applicable Kenyan law.
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