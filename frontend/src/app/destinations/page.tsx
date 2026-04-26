import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { topDestinations, trendingDestinations } from '@/data/destinations';

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0F172A] px-6 md:px-16 py-16">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wide">Explore Nepal</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">All Destinations</h1>
          <p className="text-gray-400 max-w-[500px] text-base">
            From high Himalayan regions to vibrant cities — find your perfect Nepal destination.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-12 space-y-16">

        {/* Top Destinations — Regions */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Destinations</h2>
            <p className="text-gray-500 text-sm mt-1">Major Himalayan regions with diverse trekking and touring options</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {topDestinations.map((dest, i) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className={`group relative overflow-hidden block ${i === 0 ? 'md:row-span-2' : ''}`}
              >
                <div className={`relative w-full ${i === 0 ? 'min-h-[380px]' : 'h-[175px]'}`}>
                  <Image
                    src={dest.image}
                    alt={dest.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-white/60" />
                      <span className="text-white/60 text-[11px]">Nepal</span>
                    </div>
                    <h3 className="text-white font-bold text-[15px] leading-tight">{dest.label}</h3>
                    <p className="text-white/60 text-[12px] mt-1 line-clamp-1">{dest.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Destinations */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Destinations</h2>
            <p className="text-gray-500 text-sm mt-1">Popular spots travelers are exploring right now</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {trendingDestinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden block h-[200px]"
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5">
                    TRENDING
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-[15px]">{dest.label}</h3>
                  <p className="text-white/60 text-[12px] mt-0.5 line-clamp-1">{dest.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
