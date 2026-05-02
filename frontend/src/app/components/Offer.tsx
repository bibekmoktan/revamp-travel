"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Gem, Star, ConciergeBell, Plane, ChevronLeft, ChevronRight } from "lucide-react";

const perks = [
  { icon: Gem,           label: "5-Star Accommodation" },
  { icon: ConciergeBell, label: "Private Guide & Butler" },
  { icon: Star,          label: "Exclusive Route Access" },
  { icon: Plane,         label: "Heli Transfers Available" },
];

const luxuryPackages = [
  { name: "Everest Luxury Trek",  desc: "Base Camp in Style",   image: "/images/treks/everest.jpeg" },
  { name: "Annapurna Circuit",    desc: "Premium Lodge Trail",  image: "/images/treks/bg-1.jpg" },
  { name: "Mustang Royal Trek",   desc: "Forbidden Kingdom",    image: "/images/home/mustang.jpg" },
  { name: "Chitwan Safari",       desc: "5-Star Jungle Lodge",  image: "/images/home/chitwan.jpg" },
  { name: "Pokhara Retreat",      desc: "Lakeside Luxury",      image: "/images/home/pokhara.jpg" },
  { name: "Heritage Kathmandu",   desc: "Cultural Immersion",   image: "/images/home/kathmandu.jpg" },
];

const CARDS_PER_PAGE = 3;
const totalPages = Math.ceil(luxuryPackages.length / CARDS_PER_PAGE);

const Offer = () => {
  const [page, setPage] = useState(0);

  return (
    <section className="w-full bg-[#0F172A] py-16">
      <div className="max-w-[1366px] mx-auto grid grid-cols-1 lg:grid-cols-2">

        {/* Left — content */}
        <div className="bg-[#0F172A] p-10 flex flex-col justify-center">
          <div className="inline-block bg-[#B8860B] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest mb-5 self-start">
            Luxury Collection
          </div>
          <p className="text-[#B8860B] text-sm font-semibold uppercase tracking-widest mb-3">
            Premium Experience
          </p>
          <h2 className="text-3xl md:text-[40px] font-bold text-white leading-tight mb-4">
            Nepal in <span className="text-[#B8860B]">Absolute</span><br />Luxury
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[420px]">
            Handcrafted luxury tours with private guides, five-star lodges, and exclusive Himalayan experiences designed for the discerning traveler.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#B8860B]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#B8860B]" />
                </div>
                <span className="text-gray-300 text-[13px]">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/luxury"
              className="px-6 py-3 bg-[#B8860B] hover:bg-[#9a7009] text-white font-semibold text-sm transition"
            >
              Explore Luxury Tours
            </Link>
            <Link
              href="/contact-us"
              className="px-6 py-3 border border-white/20 hover:border-white/50 text-white font-semibold text-sm transition"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>

        {/* Right — luxury package carousel */}
        <div className="bg-[#111827] flex flex-col justify-center px-8 py-10 gap-5">

          {/* Slider track */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="grid grid-cols-3 gap-3 min-w-full">
                  {luxuryPackages
                    .slice(pageIdx * CARDS_PER_PAGE, pageIdx * CARDS_PER_PAGE + CARDS_PER_PAGE)
                    .map((pkg, i) => (
                      <div
                        key={i}
                        className="relative h-[320px] rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                      >
                        <Image
                          src={pkg.image}
                          alt={pkg.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          quality={90}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold bg-[#B8860B] text-white px-2 py-0.5 uppercase tracking-wider">
                            Luxury
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <p className="text-white font-bold text-sm leading-tight">{pkg.name}</p>
                          <p className="text-white/65 text-xs mt-0.5">{pkg.desc}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? 'w-8 bg-[#B8860B]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#B8860B] hover:border-[#B8860B] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-10 h-10 rounded-full bg-[#B8860B] border border-[#B8860B] flex items-center justify-center text-white hover:bg-[#9a7009] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Offer;
