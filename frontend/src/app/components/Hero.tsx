"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-[850px] w-full overflow-hidden">
      {/* Hero Image Background */}
      <Image
        src="/images/hero-background.png"
        alt="Himalayan adventure background"
        fill
        className="object-cover z-0 scale-100"
        quality={100}
        priority
      />

      {/* Video Background — commented out
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/home/bg-hero.mp4" type="video/mp4" />
      </video>
      */}

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="absolute z-20 inset-0 flex flex-col justify-start top-[250px] items-center text-white text-center px-4">
         {/* <p className="text-sm md:text-[18px] max-w-[700px] leading-[1.16] mb-6 text-white">Handcrafted Adventures Since 2005</p>  */}
        <h2 className="text-[24px] max-w-[700px] md:text-[42px] font-bold leading-[1.16] mb-4">
          Explore the World with 20+ Years of Trusted Expertise
        </h2>
        <p className="text-sm md:text-[18px] max-w-[500px] leading-[1.16] mb-6 text-white mb-4">
          Tailor-made tours, expert local guides, and seamless travel experiences across Nepal and beyond.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/custom-package"
            className="px-6 py-3.5 bg-sky-700 min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition"
          >
           Customize Your Journe
          </Link>
          <Link
            href="/trekking"
            className="px-6 py-3.5 bg-sky-700 min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition"
          >
           Explore Tours
          </Link>
        </div>

        {/* Trust stats */}
        <div className="flex items-center gap-8 mt-10 flex-wrap justify-center">
          {[
            { value: '20+', label: 'Years Experience' },
            { value: '1K+', label: 'Happy Travelers' },
            { value: '100%', label: 'Certified Guides' },
            { value: '24/7', label: 'Local Support' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && <span className="w-px h-10 bg-white/25" />}
              <div className="text-center">
                <p className="text-4xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-[18px] text-white/80 mt-1 whitespace-nowrap">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
