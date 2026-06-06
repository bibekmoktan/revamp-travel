import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Expert Himalayan Trekking & Adventure Tours in Nepal',
  description: 'Discover world-class trekking, climbing, and adventure tours with Himalayan High Spirits Adventure. Everest Base Camp, Annapurna Circuit, custom packages and more. Book your Nepal adventure today.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: `Expert Himalayan Trekking & Adventure Tours | ${SITE_NAME}`,
    description: 'Discover world-class trekking, climbing, and adventure tours in Nepal, Bhutan & Tibet. Expert guides, custom packages, and unforgettable Himalayan experiences.',
  },
};

import Hero from "./components/Hero"
import HeroOne from "./components/HeroOne"
import HeroTwo from "./components/HeroTwo"
import HeroThree from "./components/HeroThree"
import FeaturedTrips from "./components/FeatureTrip";
import BestSeller from "./components/BestSeller";
import TopDestinations from "./components/TopDestinations";
import Offer from "./components/Offer";
import TrendingDestinations from "./components/TrendingDestinations";
import PopularTrips from "./components/PopularTreks";
import Testimonials from "./components/Testimonials";
import Articles from "./components/Articles";
import WhyTravelWithUs from "./components/WhyTravelWithUs";

export default function Home() {
  return (
    <div className="mt-[100px] bg-[#FAFFFF]">
        <Hero />
        {/* <HeroOne /> */}
        {/* <HeroTwo /> */}
        {/* <HeroThree /> */}
        <FeaturedTrips />
        <BestSeller />
        <Offer />
        <TrendingDestinations />
        <WhyTravelWithUs />
        <PopularTrips />
        <Testimonials />
        <TopDestinations />
        <Articles />
    </div>
  );
}
