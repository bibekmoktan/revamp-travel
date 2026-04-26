import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import categories from '@/data/categories';
import { topDestinations, trendingDestinations } from '@/data/destinations';

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function PackagesHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0F172A] px-6 md:px-16 py-16">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wide">Explore Nepal</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            All Packages & Destinations
          </h1>
          <p className="text-gray-400 max-w-[540px] text-base">
            Browse by travel type or region — from Himalayan treks to helicopter tours, find the perfect Nepal experience.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-12 space-y-16">

        {/* ── Travel Categories ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/trekking?category=${cat.apiCategory}`}
                className="group relative overflow-hidden block h-[220px]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <h3 className="text-white font-bold text-[15px]">{cat.label}</h3>
                  <p className="text-white/60 text-[12px] mt-0.5">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Top Destinations (Regions) ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Destinations</h2>
            <Link href="/destinations" className="text-sm text-sky-600 hover:underline font-medium">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topDestinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden block h-[160px]"
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-white/70" />
                    <span className="text-white/60 text-[10px]">Region</span>
                  </div>
                  <h3 className="text-white font-semibold text-[13px] leading-tight">{dest.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Trending Destinations ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Trending Destinations</h2>
            <Link href="/destinations" className="text-sm text-sky-600 hover:underline font-medium">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingDestinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden block h-[160px]"
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-yellow-400 text-[10px] font-medium">● Trending</span>
                  </div>
                  <h3 className="text-white font-semibold text-[13px] leading-tight">{dest.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
