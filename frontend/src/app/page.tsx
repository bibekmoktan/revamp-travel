import Hero from "./components/Hero"
import FeaturedTrips from "./components/FeatureTrip";
import TopDestinations from "./components/TopDestinations";
import Offer from "./components/Offer";
import TrendingDestinations from "./components/TrendingDestinations";
import PopularTrips from "./components/PopularTreks";
import Testimonials from "./components/Testimonials";
import Articles from "./components/Articles";
import WhyTravelWithUs from "./components/WhyTravelWithUs";
export default function Home() {
  return (
    <div className="">
        <Hero />
        <FeaturedTrips />
        <TrendingDestinations />
        <WhyTravelWithUs />
        <Offer />
        <TopDestinations />
        <PopularTrips />
        <Testimonials />
        <Articles />
    </div>
  );
}
