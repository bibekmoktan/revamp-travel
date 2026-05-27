import type { ApiPackage } from '@/types/api';
import TrekHero from './TrekHero';
import TrekOverview from './TrekOverview';
import TrekItinerary from './TrekItinerary';
import TrekGallery from './TrekGallery';
import TrekBookingCard from './TrekBookingCard';
import TrekAddOns from './TrekAddOns';
import TrekExtras from './TrekExtras';
import TrekIncludes from './TrekIncludes';
import TrekSubNav from './TrekSubNav';
import TrekReviews from './TrekReviews';
import TrekPricingTiers from './TrekPricingTiers';
import TrekSeasons from './TrekSeasons';
import TrekRouteComparison from './TrekRouteComparison';

const WRAPPER = 'max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8';

export default function TrekDetailPage({ pkg }: { pkg: ApiPackage }) {
  return (
    <div className="min-h-screen bg-[#F3F6FB]">

      {/* Hero — full bleed */}
      <TrekHero pkg={pkg} />

      {/* Sub-nav — full-width, sticky works because parent is min-h-screen */}
      <TrekSubNav />

      {/* Body — two-column within 1366px */}
      <div className={`${WRAPPER} py-6`}>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6 shadow-lg p-4 bg-white rounded-2xl">
            <div id="section-gallery"><TrekGallery gallery={pkg.gallery} title={pkg.title} /></div>
            <div id="section-overview"><TrekOverview pkg={pkg} /></div>
            <div id="section-itinerary"><TrekItinerary itinerary={pkg.itinerary} slug={pkg.slug} /></div>
            <div id="section-included"><TrekIncludes includes={pkg.includes} /></div>
            <div id="section-excluded-wrapper"><TrekExtras pkg={pkg} /></div>
            {pkg.pricingTiers && pkg.pricingTiers.length > 0 && (
              <div id="section-pricing-tiers">
                <TrekPricingTiers tiers={pkg.pricingTiers} basePrice={pkg.price} />
              </div>
            )}
            {pkg.seasons && pkg.seasons.length > 0 && (
              <div id="section-seasons">
                <TrekSeasons seasons={pkg.seasons} />
              </div>
            )}
            {pkg.routeComparison && pkg.routeComparison.rows.length > 0 && (
              <div id="section-route-comparison">
                <TrekRouteComparison
                  comparison={pkg.routeComparison}
                  thisRouteName={pkg.title}
                />
              </div>
            )}
            <div id="section-reviews"><TrekReviews packageId={pkg._id} /></div>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:w-80 shrink-0 sticky top-[80px] self-start">
            <TrekBookingCard pkg={pkg} />
          </aside>

        </div>
      </div>

      {/* Add-ons — full width below the body section */}
      <div className={`${WRAPPER} pb-10`}>
        <TrekAddOns category={pkg.category} currentSlug={pkg.slug} />
      </div>
    </div>
  );
}
