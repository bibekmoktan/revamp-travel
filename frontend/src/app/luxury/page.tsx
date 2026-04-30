import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPackages } from '@/lib/api';
import { Clock, MapPin, Mountain, Star } from 'lucide-react';

async function LuxuryPackageGrid() {
  let packages: Awaited<ReturnType<typeof getPackages>>['data'] = [];
  try {
    const res = await getPackages({ limit: 24, status: 'active' });
    packages = res.data;
  } catch {
    // backend unavailable
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 text-lg font-medium">No luxury packages available yet.</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon or contact us for a custom luxury itinerary.</p>
        <Link href="/contact-us" className="mt-6 px-6 py-3 bg-[#B8860B] text-white font-semibold text-sm hover:bg-[#9a7009] transition">
          Contact Us
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Link
          key={pkg._id}
          href={`/trekking/${pkg.slug}`}
          className="group bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)] transition-shadow duration-300"
        >
          {/* Image */}
          <div className="relative h-[240px] overflow-hidden">
            <Image
              src={pkg.featureImage?.url}
              alt={pkg.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            {/* Gold badge */}
            <div className="absolute top-3 left-3 bg-[#B8860B] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
              Luxury
            </div>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1">
              ${pkg.price.toLocaleString()}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(pkg.rating) ? 'text-[#B8860B] fill-[#B8860B]' : 'text-gray-200 fill-gray-200'}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">({pkg.reviews} reviews)</span>
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
              {pkg.title}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{pkg.location}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{pkg.duration}</span>
              </div>
              {pkg.altitude && (
                <div className="flex items-center gap-1 shrink-0">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>{pkg.altitude}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-[#B8860B] font-bold text-lg">${pkg.price.toLocaleString()}</span>
              <span className="text-xs font-semibold text-[#B8860B] border border-[#B8860B] px-3 py-1.5 group-hover:bg-[#B8860B] group-hover:text-white transition">
                View Details
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 h-[420px] animate-pulse" />
      ))}
    </div>
  );
}

export default function LuxuryPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <div className="relative h-[420px] overflow-hidden">
        <Image
          src="/images/treks/bg-1.jpg"
          alt="Luxury Nepal Tours"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[#B8860B] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Premium Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Luxury Tours Nepal
          </h1>
          <p className="text-white/70 max-w-[520px] text-sm md:text-base leading-relaxed mb-8">
            Handcrafted journeys with five-star lodges, private guides, and exclusive Himalayan access — for the discerning traveler.
          </p>
          <Link
            href="/contact-us"
            className="px-8 py-3.5 bg-[#B8860B] hover:bg-[#9a7009] text-white font-semibold text-sm transition"
          >
            Plan a Custom Luxury Trip
          </Link>
        </div>
      </div>

      {/* Perks strip */}
      <div className="bg-[#0F172A] px-6 md:px-16 py-4">
        <div className="max-w-[1320px] mx-auto flex flex-wrap justify-center gap-8 text-sm text-gray-300">
          {['5-Star Accommodation', 'Private Certified Guides', 'Heli Transfers Available', 'Fully Customizable', '24/7 Concierge Support'].map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
              {perk}
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">All Luxury Packages</h2>
          <Link href="/trekking" className="text-sm text-[#B8860B] hover:underline font-medium">
            Browse all packages
          </Link>
        </div>
        <Suspense fallback={<GridSkeleton />}>
          <LuxuryPackageGrid />
        </Suspense>
      </div>

      {/* CTA banner */}
      <div className="bg-[#0F172A] px-6 md:px-16 py-14 text-center">
        <p className="text-[#B8860B] text-sm font-semibold uppercase tracking-widest mb-3">Bespoke Travel</p>
        <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-[460px] mx-auto">
          We design fully custom luxury itineraries tailored to your timeline, budget, and travel style.
        </p>
        <Link
          href="/contact-us"
          className="inline-block px-8 py-3.5 bg-[#B8860B] hover:bg-[#9a7009] text-white font-semibold text-sm transition"
        >
          Request a Custom Itinerary
        </Link>
      </div>
    </main>
  );
}
