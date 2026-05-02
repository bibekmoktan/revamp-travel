'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trendingDestinations } from '@/data/destinations';

export default function TrendingDestinations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' });

  return (
    <section className="px-6 md:px-16 py-12">
      <div className="max-w-[1320px] mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trending Destinations</h2>
          <Link href="/destinations" className="text-sm text-sky-600 hover:underline font-medium">
            See all
          </Link>
        </div>

        {/* Scroll container */}
        <div className="relative group/slider">

          {/* Left button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-sky-800 shadow-md p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-sky-900"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Cards */}
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide">
            {trendingDestinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden block h-[220px] w-[220px] shrink-0 rounded-[12px]"
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-3">
                  <p className="text-[11px] font-semibold text-amber-400 mb-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    Trending
                  </p>
                  <p className="text-white font-bold text-[15px] leading-tight drop-shadow">{dest.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-sky-800 shadow-md p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-sky-900"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

        </div>
      </div>
    </section>
  );
}
