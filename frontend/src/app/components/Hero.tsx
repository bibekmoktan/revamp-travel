"use client";

import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: '20+',  label: 'Years Experience' },
  { value: '1K+',  label: 'Happy Travelers' },
  { value: '100%', label: 'Certified Guides' },
  { value: '24/7', label: 'Local Support' },
];

export default function Hero() {
  return (
    <div className="relative h-[550px] md:h-[600px] w-full overflow-hidden">
      {/* Hero Image Background */}
      <Image
        src="/images/hero-background.png"
        alt="Himalayan adventure background"
        fill
        className="object-cover z-0"
        quality={100}
        priority
      />

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="absolute z-20 inset-0 flex flex-col items-center text-white text-center px-4 pt-[130px] md:pt-[100px]">
        <h2 className="text-[22px] sm:text-[28px] md:text-[42px] max-w-[700px] font-bold leading-[1.16] mb-3 md:mb-4">
          Explore the World with 20+ Years of Trusted Expertise
        </h2>
        <p className="text-sm md:text-[18px] max-w-[500px] leading-[1.3] mb-5 md:mb-6 text-white">
          Tailor-made tours, expert local guides, and seamless travel experiences across Nepal and beyond.
        </p>

        {/* CTAs — stack on mobile, side-by-side from sm */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mb-4">
          <Link
            href="/custom-package"
            className="px-6 py-3 sm:py-3.5 bg-sky-700 sm:min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition text-center"
          >
            Customize Your Journey
          </Link>
          <Link
            href="/trekking"
            className="px-6 py-3 sm:py-3.5 bg-sky-700 sm:min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition text-center"
          >
            Explore Tours
          </Link>
        </div>

        {/* Trust stats — mobile: 2×2 grid (no dividers); sm+: single row with dividers */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 sm:hidden">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
              <p className="text-xs text-white/80 mt-1 whitespace-nowrap">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-8 mt-8 md:mt-10 flex-wrap justify-center">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && <span className="w-px h-10 bg-white/25" />}
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-base md:text-[18px] text-white/80 mt-1 whitespace-nowrap">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
