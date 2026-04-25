import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import HeroImage from '../../../../public/images/treks/bg-1.jpg';
import TrekFilters from './TrekFilters';
import TrekSortBar from './TrekSortBar';

interface TrekkingPageProps {
  children: React.ReactNode;
}

export default function TrekkingPage({ children }: TrekkingPageProps) {
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
        <div className="relative z-10 flex items-center justify-center h-full px-4 md:pt-[200px]">
          <div className="text-center text-white max-w-[700px]">
            <h1 className="text-[24px] md:text-[42px] font-bold mb-4 drop-shadow-lg leading-[1.2]">
              Step beyond the ordinary into the heart of the Himalayas.
            </h1>
            <p className="text-sm md:text-base text-white/80 leading-[1.2] mb-8">
              Explore world-class trekking routes through ancient valleys, high-altitude passes, and remote villages. Whether you&apos;re a first-time hiker or a seasoned mountaineer, Nepal has a trail that will leave you breathless.
            </p>
            <Link
              href="/custom-package"
              className="inline-flex mt-6 items-center gap-2 px-8 py-3 bg-[#0F4C81] hover:bg-sky-800 text-white font-semibold transition-colors shadow-lg"
            >
              Customise Your Trip
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div id="packages" className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── Left sidebar ── */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-4">
            <Suspense fallback={<div className="h-96 bg-white animate-pulse rounded-xl" />}>
              <TrekFilters />
            </Suspense>
          </aside>

          {/* ── Right: sort bar + results ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-white" />}>
                <TrekSortBar />
              </Suspense>
            </div>

            {children}
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
