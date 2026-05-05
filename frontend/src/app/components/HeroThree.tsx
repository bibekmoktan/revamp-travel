"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  { name: "Kathmandu",     desc: "Cultural Capital",       image: "/images/home/kathmandu.jpg" },
  { name: "Pokhara",       desc: "Gateway to Annapurna",   image: "/images/home/pokhara.jpg" },
  { name: "Chitwan",       desc: "Wildlife Safari",         image: "/images/home/chitwan.jpg" },
  { name: "Mustang",       desc: "Forbidden Kingdom",       image: "/images/home/mustang.jpg" },
  { name: "Rara Lake",     desc: "Hidden Gem",              image: "/images/home/rara.jpg" },
  { name: "Eastern Nepal", desc: "Himalayan Frontier",      image: "/images/home/Eastern-nepal.jpg" },
];

const CARDS_PER_PAGE = 3;
const totalPages = Math.ceil(destinations.length / CARDS_PER_PAGE);

export default function HeroThree() {
  const [page, setPage] = useState(0);

  return (
    <section className="w-full bg-[#FAFFFF] min-h-[600px]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 min-h-[600px] gap-8">

        {/* Left — content */}
        <div className="flex flex-col justify-center py-16 pr-0 lg:pr-12">
          <p className="text-xs font-semibold text-[#0F4C81] uppercase tracking-widest mb-3">
            Handcrafted Adventures Since 2005
          </p>
          <h2 className="text-[24px] md:text-[42px] font-bold text-gray-900 leading-[1.2] mb-5">
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
          <div className="flex flex-nowrap items-center justify-between sm:justify-start gap-3 sm:gap-6 border-t border-gray-200 pt-6 sm:pt-8">
            {[
              { value: '20+',  label: 'Years Experience' },
              { value: '1K+',  label: 'Happy Travelers' },
              { value: '100%', label: 'Certified Guides' },
              { value: '24/7', label: 'Local Support' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-6">
                {i > 0 && <span className="w-px h-6 sm:h-8 bg-gray-200" />}
                <div>
                  <p className="text-base sm:text-2xl font-bold text-[#0F4C81] leading-none">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — destination card carousel */}
        <div className="hidden lg:flex flex-col justify-center py-16 gap-5">

          {/* Slider track */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="grid grid-cols-3 gap-3 min-w-full">
                  {destinations
                    .slice(pageIdx * CARDS_PER_PAGE, pageIdx * CARDS_PER_PAGE + CARDS_PER_PAGE)
                    .map((dest, i) => (
                      <div
                        key={i}
                        className="relative h-[340px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                      >
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          quality={90}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4">
                          <p className="text-white font-bold text-sm leading-tight">{dest.name}</p>
                          <p className="text-white/70 text-xs mt-0.5">{dest.desc}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? 'w-8 bg-[#0F4C81]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#0F4C81] hover:text-white hover:border-[#0F4C81] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-10 h-10 rounded-full bg-[#0F4C81] border border-[#0F4C81] shadow-sm flex items-center justify-center text-white hover:bg-sky-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
