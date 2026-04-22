import type { ApiPackage } from '@/types/api';
import TrekHero from './TrekHero';
import TrekOverview from './TrekOverview';
import TrekItinerary from './TrekItinerary';
import TrekGallery from './TrekGallery';
import TrekBookingCard from './TrekBookingCard';

export default function TrekDetailPage({ pkg }: { pkg: ApiPackage }) {
  return (
    <div className="min-h-screen bg-[#F3F6FB]">

      {/* Hero */}
      <TrekHero pkg={pkg} />

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Main content ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-12">
            <TrekOverview pkg={pkg} />
            <TrekItinerary itinerary={pkg.itinerary} />
            <TrekGallery gallery={pkg.gallery} title={pkg.title} />
          </div>

          {/* ── Sticky sidebar ─────────────────────────────────────── */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-6">
              <TrekBookingCard pkg={pkg} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
