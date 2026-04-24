import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import HeroImage from '../../../../public/images/treks/bg-1.jpg';
import TrekCard from './TrekCard';
import TrekListItem from './TrekListItem';
import TrekFilters from './TrekFilters';
import TrekSortBar from './TrekSortBar';
import HeroSearch from './HeroSearch';
import Pagination from './Pagination';
import type { ApiPackage, PaginationMeta } from '@/types/api';

interface TrekkingPageProps {
  packages: ApiPackage[];
  meta: PaginationMeta;
  view: 'card' | 'list';
}

function PackageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-[8px] overflow-hidden shadow-sm animate-pulse">
          <div className="h-64 bg-[#E3F2FD]" />
          <div className="p-6 space-y-3">
            <div className="h-3 bg-[#E3F2FD] rounded w-1/3" />
            <div className="h-4 bg-[#E3F2FD] rounded w-3/4" />
            <div className="h-3 bg-[#E3F2FD] rounded w-1/2" />
            <div className="h-10 bg-[#E3F2FD] rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrekkingPage({ packages, meta, view }: TrekkingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[800px] overflow-hidden">
        <Image
          src={HeroImage}
          alt="Trekking adventure in the mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F4C81]/60 via-[#0F4C81]/30 to-black/50" />
        <div className="relative z-10 flex items-center justify-center h-full px-4 md:pt-[150px]">
          <div className="text-center text-white max-w-[700px]">
            <h1 className="text-[24px] md:text-[42px] font-bold mb-12 drop-shadow-lg leading-tight">
             Step beyond the ordinary into the heart of the Himalayas.
            </h1>
            <HeroSearch />
          </div>
        </div>

        {/* Stats bar */}
        {/* <div className="absolute bottom-0 left-0 right-0 bg-[#0F4C81]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-[1366px] mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-white/20 text-center text-white">
            <div>
              <p className="text-2xl font-bold">{meta.total}+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wide">Trekking Packages</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8848m</p>
              <p className="text-xs text-blue-200 uppercase tracking-wide">Highest Summit</p>
            </div>
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wide">Happy Trekkers</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div id="packages" className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Section heading */}
        <div className="mb-6">
          {/* <h2 className="text-2xl font-bold text-[#0F4C81] mb-1">All Treks</h2> */}
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── Left sidebar ── */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-4">
            <Suspense fallback={<div className="h-96 bg-white  animate-pulse" />}>
              <TrekFilters />
            </Suspense>
          </aside>

          {/* ── Right: sort bar + cards ── */}
          <div className="flex-1 min-w-0">

            {/* Sort bar */}
            <div className="mb-5">
              <Suspense fallback={<div className="h-12 animate-pulse" />}>
                <TrekSortBar total={meta.total} />
              </Suspense>
            </div>

            {/* Package listing */}
            {packages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white ">
                <div className="w-20 h-20 bg-[#E3F2FD] rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🏔️</span>
                </div>
                <h3 className="text-xl font-semibold text-[#37474F] mb-2">No treks found</h3>
                <p className="text-[#607D8B] max-w-sm">
                  Try adjusting your filters to find the perfect adventure.
                </p>
              </div>
            ) : view === 'card' ? (
              <Suspense fallback={<PackageGridSkeleton />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <TrekCard key={pkg._id} package={pkg} />
                  ))}
                </div>
              </Suspense>
            ) : (
              <div className="space-y-4">
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
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1565C0] text-white rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/treks/bg-1.jpg')] bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
            <p className="text-xl mb-8 text-[#64B5F6]">
              Join thousands of trekkers who have experienced the magic of the Himalayas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/custom-package"
                className="bg-white text-[#0F4C81] font-semibold py-3 px-8 rounded-xl hover:bg-[#F8FAFB] transition-colors shadow-lg"
              >
                Custom Trek Planning
              </Link>
              <button className="border-2 border-[#64B5F6] text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors">
                Download Gear List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
