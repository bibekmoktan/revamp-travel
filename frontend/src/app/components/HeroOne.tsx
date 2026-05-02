"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroOne() {
  return (
    <section className="w-full bg-[#FAFFFF] min-h-[600px]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Left — content */}
        <div className="flex flex-col justify-center py-16 pr-0 lg:pr-12">
          <p className="text-xs font-semibold text-[#0F4C81] uppercase tracking-widest mb-3">
            Handcrafted Adventures Since 2005
          </p>
          <h2 className="text-3xl md:text-[42px] font-bold text-gray-900 leading-[1.2] mb-5">
            Explore the World with<br />
            <span className="text-[#0F4C81]">20+ Years</span> of Trusted Expertise
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-[480px]">
            Tailor-made tours, expert local guides, and seamless travel experiences across Nepal and beyond. Your adventure starts here.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="/custom-package"
              className="px-6 py-3.5 bg-[#0F4C81] text-white font-semibold text-sm hover:bg-sky-800 transition"
            >
              Customize Your Journey
            </Link>
            <Link
              href="/trekking"
              className="px-6 py-3.5 border border-[#0F4C81] text-[#0F4C81] font-semibold text-sm hover:bg-[#0F4C81]/5 transition"
            >
              Explore Tours
            </Link>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-8">
            {[
              { value: '20+',  label: 'Years Experience' },
              { value: '1K+',  label: 'Happy Travelers' },
              { value: '100%', label: 'Certified Guides' },
              { value: '24/7', label: 'Local Support' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-8 bg-gray-200" />}
                <div>
                  <p className="text-2xl font-bold text-[#0F4C81] leading-none">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — overlapping images */}
        <div className="hidden lg:flex items-center justify-center py-16">
                <div className="relative w-[460px] h-[480px]">

            {/* Image 1 — top-left, largest */}
            <div className="absolute top-0 left-0 w-[300px] h-[260px] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAFFFF]">
              <Image
                src="/images/hero-background.png"
                alt="Himalayan adventure"
                fill
                className="object-cover object-center"
                quality={100}
                priority
              />
            </div>

            {/* Image 2 — top-right, small */}
            <div className="absolute top-[20px] right-0 w-[200px] h-[180px] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAFFFF]">
              <Image
                src="/images/hero-image.png"
                alt="Nepal mountains"
                fill
                className="object-cover object-center"
                quality={100}
              />
            </div>

            {/* Image 3 — bottom-center, medium */}
            <div className="absolute bottom-0 left-[70px] w-[260px] h-[230px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAFFFF]">
              <Image
                src="/images/hero-new.png"
                alt="Nepal trekking"
                fill
                className="object-cover object-center"
                quality={100}
              />
            </div>

            {/* Image 4 — bottom-right, small */}
            <div className="absolute bottom-[10px] right-0 w-[170px] h-[160px] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAFFFF]">
              <Image
                src="/images/home/pokhara.jpg"
                alt="Pokhara"
                fill
                className="object-cover object-center"
                quality={100}
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
