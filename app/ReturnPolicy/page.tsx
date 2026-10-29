"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useEffect, useRef, useState, ReactNode } from "react";

// SVG Icons
const Icons = {
  ShieldCheck: () => (
    <svg className="w-16 h-16 text-[#F4761E] mx-auto mb-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  ClipboardCheck: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Car: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5m-3-2.625t.75-.75h7.5M4.5 9h10.125c.621 0 1.125.504 1.125 1.125v4.5m-12.375 0h.008v.008H3.375v-.008Z" />
    </svg>
  ),
  Banknotes: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 13.875h1.5a1.125 1.125 0 0 1 1.125 1.125v1.5m-3-2.625t.75-.75h7.5M4.5 9h10.125c.621 0 1.125.504 1.125 1.125v4.5m-12.375 0h.008v.008H3.375v-.008Z" />
    </svg>
  ),
  DocumentText: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Scale: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  ),
  ArrowsRightLeft: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  Wrench: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  ChatBubble: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.25 18.75 5.972 5.972 0 0 1 3 16.305A9.764 9.764 0 0 1 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  ),
  XMark: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  ClipboardDocument: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  PencilSquare: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 text-[#F4761E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
};

interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

// Body text style — Inter Regular
const bodyText = "font-inter font-normal text-gray-700 text-base leading-relaxed";
const bodyStrong = "font-inter font-semibold text-[#1A1A1A]";

const policySections: PolicySection[] = [
  {
    id: "introduction",
    number: "1",
    title: "Return Policy",
    icon: <Icons.DocumentText />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
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
        <p className={bodyText}>Customers may request a return or exchange under the following circumstances:</p>
        <ul className="space-y-2">
          {[
            { label: "Incorrect item supplied", desc: "The item delivered does not match the item ordered." },
            { label: "Incorrect vehicle compatibility", desc: "The part supplied does not fit the vehicle despite the customer providing accurate vehicle details and Autogenius confirming compatibility." },
            { label: "Damaged item", desc: "The item arrives damaged before or during delivery, subject to verification." },
            { label: "Defective item", desc: "The part is found to have a manufacturing defect, subject to applicable warranty terms and assessment." },
            { label: "Order discrepancy", desc: "The quantity, specification or description of the supplied item differs materially from the confirmed order." },
          ].map((item) => (
            <li key={item.label} className={`flex items-start gap-3 ${bodyText}`}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F4761E] flex-shrink-0" />
              <span>
                <strong className={bodyStrong}>{item.label}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>
        <p className={bodyText}>
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
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          Customers should notify Autogenius of any return or exchange request within <strong className={bodyStrong}>7 calendar days</strong> of receiving the item, provided the item meets the eligibility conditions outlined in this policy.
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
        <p className={bodyText}>
          Except where the item is defective, damaged, incorrectly supplied or otherwise subject to a legal remedy, returned products should meet the following conditions:
        </p>
        <ul className="space-y-2">
          {[
            "The item must be unused, uninstalled and in its original condition.",
            "Original packaging, labels, accessories and accompanying documents should be retained.",
            "The item must not show signs of improper handling, physical damage, alteration or misuse.",
            "The item must be accompanied by proof of purchase, such as an order confirmation, receipt or invoice.",
          ].map((item, i) => (
            <li key={i} className={`flex items-start gap-3 ${bodyText}`}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F4761E] flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={bodyText}>
          <strong className={bodyStrong}>Important to note:</strong> Automotive parts that have been installed, modified, used or damaged after delivery may require technical inspection before a return, exchange or warranty claim can be approved. This does not limit any remedies available under applicable law.
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
      <div className={`space-y-3 ${bodyText}`}>
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
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F4761E] flex-shrink-0" />
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
        <p className={bodyText}>
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
            <li key={i} className={`flex items-start gap-3 ${bodyText}`}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F4761E] flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={bodyText}>
          This section does not exclude a customer's statutory rights where an item is defective, misdescribed, not fit for its represented purpose or otherwise qualifies for a legal remedy.
        </p>
      </div>
    ),
  },
  {
    id: "refunds",
    number: "7",
    title: "Refund Policy",
    icon: <Icons.Banknotes />,
    content: (
      <div className="space-y-3">
        <p className={bodyText}>
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
            <li key={i} className={`flex items-start gap-3 ${bodyText}`}>
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#F4761E]/10 text-[#F4761E] text-xs font-inter font-semibold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={bodyText}>
          Autogenius will not impose an arbitrary restocking fee or deduction where prohibited by law.
        </p>
      </div>
    ),
  },
  {
    id: "special-orders",
    number: "8",
    title: "Special Orders and Internationally Sourced Products",
    icon: <Icons.Globe />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
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
    id: "exchanges",
    number: "9",
    title: "Exchanges",
    icon: <Icons.ArrowsRightLeft />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          Where an exchange is approved, Autogenius will make reasonable efforts to supply the correct replacement part, subject to availability.
        </p>
        <p>
          If the replacement item has a different price, the price difference and any applicable delivery costs will be communicated before the exchange is completed.
        </p>
        <p>
          If a suitable replacement is unavailable, Autogenius will discuss an appropriate alternative or refund, as applicable under the circumstances and Kenyan law.
        </p>
      </div>
    ),
  },
  {
    id: "shipping-costs",
    number: "10",
    title: "Return Shipping and Transport Costs",
    icon: <Icons.Truck />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          Where a return is necessary because Autogenius supplied an incorrect item, or where a defect or other issue attributable to Autogenius is confirmed, reasonable return and replacement transport arrangements will be communicated to the customer and handled in accordance with applicable law.
        </p>
        <p>
          For approved change-of-mind returns, where legally permitted, the customer may be responsible for reasonable return transport costs if this responsibility was clearly disclosed before purchase.
        </p>
        <p>
          Customers should not send items back before receiving return instructions from our customer support team.
        </p>
      </div>
    ),
  },
  {
    id: "warranty",
    number: "11",
    title: "Warranty Claims",
    icon: <Icons.Wrench />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>Some products may be covered by a manufacturer's, distributor's or supplier's warranty.</p>
        <p>Warranty coverage may vary depending on the product, manufacturer and applicable terms.</p>
        <p>Customers should retain their receipts and any warranty documentation.</p>
        <p>Warranty claims may require inspection by Autogenius, an authorized technician, the manufacturer or the relevant supplier.</p>
        <p>
          A warranty claim may not be approved where the evidence establishes that the defect resulted from improper installation, misuse, unauthorized modification or other excluded causes under the applicable warranty terms. Any assessment remains subject to applicable consumer protection law.
        </p>
      </div>
    ),
  },
  {
    id: "how-to-request",
    number: "12",
    title: "How to Request a Return, Exchange or Refund",
    icon: <Icons.ClipboardDocument />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>To initiate a request:</p>
        <ol className="space-y-2 list-none">
          {[
            "Contact Autogenius through our official customer support channels.",
            "Provide your order number or proof of purchase.",
            "Explain the reason for the request.",
            "Submit photographs, videos, part numbers or other evidence where relevant.",
            "Wait for confirmation and instructions before returning the item.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#F4761E]/10 text-[#F4761E] text-xs font-inter font-semibold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p>
          Our team will review the request and communicate the next steps, including any inspection, collection, exchange or refund arrangements.
        </p>
      </div>
    ),
  },
  {
    id: "cancellation",
    number: "13",
    title: "Order Cancellation",
    icon: <Icons.XMark />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>Customers who wish to cancel an order should contact Autogenius as soon as possible.</p>
        <p>
          Cancellation may be possible before an order has been dispatched or a special sourcing commitment has been made. Once an order has been dispatched, imported, customized or specially sourced, cancellation will be assessed according to the order terms and applicable law.
        </p>
        <p>
          Any cancellation charge must be lawful and appropriately disclosed. Statutory cancellation and refund rights will not be restricted by this provision.
        </p>
      </div>
    ),
  },
  {
    id: "delivery-discrepancies",
    number: "14",
    title: "Online Orders and Delivery Discrepancies",
    icon: <Icons.Truck />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          Customers should inspect deliveries upon receipt and report visible damage, missing items or discrepancies promptly.
        </p>
        <p>
          Where possible, customers should retain the packaging and delivery documentation until the order has been checked.
        </p>
        <p>
          Failure to report an issue immediately will not automatically remove any rights available under applicable law.
        </p>
      </div>
    ),
  },
  {
    id: "customer-support",
    number: "15",
    title: "Customer Support",
    icon: <Icons.ChatBubble />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>For return, exchange, refund and warranty assistance, please contact:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
          <p className="font-montserrat font-bold text-[#1A1A1A]">Autogenius Spare Parts Ltd</p>
          <div className="flex items-start gap-2.5">
            <Icons.MapPin />
            <span><strong className={bodyStrong}>Location:</strong> MSP Plaza, Kirinyaga Road, Nairobi, Kenya</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Icons.Phone />
            <span><strong className={bodyStrong}>Call/WhatsApp:</strong> 0714200500</span>
          </div>
        </div>
        <p>
          Please include your order number and the vehicle details relevant to your request so that our team can assist you efficiently.
        </p>
      </div>
    ),
  },
  {
    id: "policy-updates",
    number: "16",
    title: "Policy Updates",
    icon: <Icons.PencilSquare />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          Autogenius Spare Parts Ltd reserves the right to update this policy when necessary to reflect changes in our operations, products, service arrangements or applicable law.
        </p>
        <p>
          The version published on our website will indicate the effective date. Any update will not remove rights that a customer has already acquired under applicable law or the terms governing an existing transaction.
        </p>
      </div>
    ),
  },
  {
    id: "our-commitment",
    number: "17",
    title: "Our Commitment",
    icon: <Icons.Sparkles />,
    content: (
      <div className={`space-y-3 ${bodyText}`}>
        <p>
          At Autogenius, we believe that <em className={`${bodyStrong} not-italic`}>quality, trust and reliability drive every journey</em>. We are committed to resolving genuine customer concerns fairly, supplying the right parts and building lasting relationships with our customers.
        </p>
        <p className="font-montserrat font-bold text-[#F4761E]">
          Autogenius Spare Parts Ltd — Driven by Genius. Powered by Quality.
        </p>
      </div>
    ),
  },
  {
    id: "consumer-rights",
    number: "18",
    title: "Consumer Rights",
    icon: <Icons.Scale />,
    content: (
      <p className={bodyText}>
        Nothing in this policy excludes or limits any mandatory consumer rights available under Kenyan law. Customers retain all statutory rights and remedies in respect of defective, misdescribed or unfit products.
      </p>
    ),
  },
];

export default function ReturnPolicyPage() {
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const totalSections = 3;
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
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-10";
  };

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-inter">
      <Navbar />

      {/* HERO */}
      <div
        ref={(el) => { sectionRefs.current[0] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(0)}`}
      >
        <section className="text-center py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#F4761E]/5 to-white">
          <Icons.ShieldCheck />
          <h1 className="font-montserrat font-bold text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[#F4761E]">
            RETURN &amp; REFUND POLICY
          </h1>
          <p className="mt-4 sm:mt-6 font-inter font-semibold text-base sm:text-lg lg:text-xl text-[#1A1A1A]">
            TRANSPARENT RETURNS. FAIR REFUNDS. ABSOLUTE RELIABILITY.
          </p>
          <div className="mt-6 w-24 h-1 bg-[#F4761E] mx-auto rounded-full" />
        </section>
      </div>

      {/* INTRO */}
      <div
        ref={(el) => { sectionRefs.current[1] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(1)}`}
      >
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl mb-4 text-[#F4761E] flex items-center gap-3">
            <span className="inline-block w-1 h-8 bg-[#F4761E] rounded-full"></span>
            Our Commitment
          </h2>
          <p className="font-inter font-normal text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl">
            Autogenius Spare Parts Ltd is committed to providing quality automotive spare parts, reliable service and a convenient shopping experience. This policy outlines how returns, exchanges and refunds are handled for purchases made through our website or authorized sales channels, in accordance with applicable Kenyan law.
          </p>
        </section>
      </div>

      {/* POLICY SECTIONS */}
      <div
        ref={(el) => { sectionRefs.current[2] = el; }}
        className={`transition-all duration-700 ease-out ${getAnimationClass(2)}`}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
          {policySections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 mt-0.5">{section.icon}</div>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-[#F4761E] flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F4761E] text-white text-xs font-inter font-semibold flex-shrink-0">
                    {section.number}
                  </span>
                  {section.title}
                </h3>
              </div>
              <div className="pl-0 sm:pl-8">
                {section.content}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl mb-4 text-[#F4761E]">
            Need Help With a Return?
          </h2>
          <p className="font-inter font-normal text-gray-700 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Our team is ready to assist you with any return, exchange, or refund request.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#F4761E] hover:bg-[#d9641a] text-white font-inter font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-[#F4761E]/20 hover:shadow-xl transition-all duration-200"
          >
            Start Shopping Now →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}