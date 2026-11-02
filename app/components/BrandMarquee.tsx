// app/components/BrandMarquee.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

// ── Brand list ────────────────────────────────────────────────────────────────
const BRANDS = [
  { name: "Toyota",   slug: "toyota",   src: "/brands/toyota.png"   },
  { name: "Subaru",   slug: "subaru",   src: "/brands/subaru.png"   },
  { name: "Mazda",    slug: "mazda",    src: "/brands/mazda.png"    },
  { name: "BMW",      slug: "bmw",      src: "/brands/bmw.png"      },
  { name: "Audi",     slug: "audi",     src: "/brands/audi.png"     },
  { name: "Ford",     slug: "ford",     src: "/brands/ford.png"     },
  { name: "Jeep",     slug: "jeep",     src: "/brands/jeep.png"     },
  { name: "VW",       slug: "vw",       src: "/brands/vw.png"       },
  { name: "Mercedes", slug: "mercedes", src: "/brands/mercedes.png" },
];

// ── Single logo tile ─────────────────────────────────────────────────────────
function BrandLogo({
  brand,
  duplicate = false,
}: {
  brand: (typeof BRANDS)[number];
  duplicate?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop?brand=${brand.slug}`}
      aria-label={`Shop ${brand.name} spare parts`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className="relative group flex-shrink-0
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                 rounded-2xl"
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate}
    >
      {/* White tile — fixed size, so all logos line up evenly */}
      <motion.div
        className="relative flex items-center justify-center
                   w-24 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24
                   bg-white rounded-2xl px-3 py-2
                   border-2 border-transparent
                   shadow-sm"
        animate={{
          scale: hovered ? 1.06 : 1,
          borderColor: hovered ? "#F4761E" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <Image
          src={brand.src}
          alt={duplicate ? "" : brand.name}
          fill
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
          draggable={false}
          className={`object-contain select-none pointer-events-none p-2
                      transition-all duration-300 ease-out
                      ${hovered
                        ? "grayscale-0 opacity-100"
                        : "grayscale opacity-90"}
                      drop-shadow-sm`}
        />
      </motion.div>

      {/* Orange hover indicator bar underneath */}
      <span
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full
                   bg-[#F4761E] transition-all duration-300
                   ${hovered ? "w-10 opacity-100" : "w-0 opacity-0"}`}
        aria-hidden="true"
      />
    </Link>
  );
}

// ── Marquee ──────────────────────────────────────────────────────────────────
export default function BrandMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  const baseDuration = 32; // seconds for one full loop

  return (
    <div
      className="relative w-full overflow-hidden select-none
                 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]
                 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      role="region"
      aria-label="Browse spare parts by vehicle brand"
    >
      <motion.div
        ref={trackRef}
        className="flex items-center gap-5 sm:gap-6 md:gap-8 w-max py-3"
        animate={
          prefersReducedMotion || isPaused
            ? { x: 0 }
            : { x: ["0%", "-50%"] }
        }
        transition={
          prefersReducedMotion || isPaused
            ? { duration: 0 }
            : { duration: baseDuration, repeat: Infinity, ease: "linear" }
        }
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onFocus={handlePause}
        onBlur={handleResume}
        style={{ willChange: "transform" }}
      >
        {/* First copy */}
        {BRANDS.map((brand) => (
          <BrandLogo key={brand.slug} brand={brand} />
        ))}
        {/* Duplicate copy (aria-hidden) — creates seamless loop */}
        {BRANDS.map((brand) => (
          <BrandLogo key={`dup-${brand.slug}`} brand={brand} duplicate />
        ))}
      </motion.div>
    </div>
  );
}