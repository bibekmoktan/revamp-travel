import type { ApiPackage } from '@/types/api';
import TrekHero from './TrekHero';
import TrekOverview from './TrekOverview';
import TrekItinerary from './TrekItinerary';
import TrekGallery from './TrekGallery';
import TrekBookingCard from './TrekBookingCard';
import TrekExtras from './TrekExtras';
import TrekReviews from './TrekReviews';

const WRAPPER = 'max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8';

export default function TrekDetailPage({ pkg }: { pkg: ApiPackage }) {
  return (
    <div className="min-h-screen bg-[#F3F6FB]">

      {/* Hero — full bleed */}
      <TrekHero pkg={pkg} />

      {/* Body — two-column within 1366px */}
      <div className={`${WRAPPER} py-6`}>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            <TrekGallery gallery={pkg.gallery} title={pkg.title} />
            <TrekOverview pkg={pkg} />
            <TrekItinerary itinerary={pkg.itinerary} />
            <TrekExtras pkg={pkg} />
            <TrekReviews packageId={pkg._id} />
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-[150px]">
              <TrekBookingCard pkg={pkg} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
