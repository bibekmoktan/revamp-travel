import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import HeroImage from '../../../../public/images/treks/bg-1.jpg';
import TrekCard from './TrekCard';
import TrekListItem from './TrekListItem';
import TrekFilters from './TrekFilters';
import Pagination from './Pagination';
import type { ApiPackage, PaginationMeta } from '@/types/api';

interface TrekkingPageProps {
  packages: ApiPackage[];
  meta: PaginationMeta;
  view: 'card' | 'list';
}

// Skeleton shown while filter transitions are in flight
function PackageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
          <div className="h-56 bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrekkingPage({ packages, meta, view }: TrekkingPageProps) {
  return (
    <div className="min-h-screen bg-[#F3F6FB]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <Image
          src={HeroImage}
          alt="Trekking adventure in the mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              Adventure Awaits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover breathtaking mountain adventures across the Himalayas
            </p>
            <Link
              href="#packages"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 hover:shadow-lg"
            >
              Explore Treks
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div id="packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filters — client component wrapped in Suspense (uses useSearchParams) */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-24 bg-white rounded-lg animate-pulse" />}>
            <TrekFilters total={meta.total} />
          </Suspense>
        </div>

        {/* Package listing */}
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🏔️</p>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No treks found</h3>
            <p className="text-gray-500 max-w-sm">
              Try adjusting your search or price range to find the perfect adventure.
            </p>
          </div>
        ) : view === 'card' ? (
          <Suspense fallback={<PackageGridSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <TrekCard key={pkg._id} package={pkg} />
              ))}
            </div>
          </Suspense>
        ) : (
          <div className="space-y-5">
            {packages.map((pkg) => (
              <TrekListItem key={pkg._id} package={pkg} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Suspense>
          <Pagination currentPage={meta.page} totalPages={meta.pages} />
        </Suspense>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of trekkers who have experienced the magic of the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/custom-package"
              className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Custom Trek Planning
            </Link>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Download Gear List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
