import Hero from "./components/Hero"
import FeaturedTrips from "./components/FeatureTrip";
import TopDestinations from "./components/TopDestinations";
import Offer from "./components/Offer";
import TrendingDestinations from "./components/TrendingDestinations";
import PopularTrips from "./components/PopularTreks";
import AppPromo from "./components/AppPromo";
import Articles from "./components/Articles";

export default function Home() {
  return (
    <div className="">
        <Hero />
        <FeaturedTrips />
        <TrendingDestinations />
        <Offer />
        <TopDestinations />
        <PopularTrips />
        <AppPromo />
        <Articles />
    </div>
  );
}
