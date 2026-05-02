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
        {/* <Hero /> */}
        {/* <HeroOne /> */}
        {/* <HeroTwo /> */}
        <HeroThree />
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
