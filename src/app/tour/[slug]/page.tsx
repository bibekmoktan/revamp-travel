import { notFound } from 'next/navigation';
import TourDetails from '../../components/TourDetails/TourDetails';
import { getTourBySlug, getAllTourSlugs, Tour } from '../../../data/tours';

// Define the props interface for the page component
interface TourPageProps {
  params: {
    slug: string;
  };
}

export default function TourPage({ params }: TourPageProps) {
  // Fetch tour data by slug
  const tour = getTourBySlug(params.slug);
  
  // If tour not found, show 404 page
  if (!tour) {
    notFound();
  }

  return (
    <div>
      <TourDetails tour={tour} />
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: TourPageProps) {
  const tour = getTourBySlug(params.slug);
  
  if (!tour) {
    return {
      title: 'Tour Not Found',
      description: 'The requested tour could not be found.',
    };
  }

  return {
    title: `${tour.title} - Viatours`,
    description: tour.description,
    keywords: `tour, travel, ${tour.location}, ${tour.city}`,
  };
}

// Generate static params for all tours (optional - for static generation)
export async function generateStaticParams() {
  const slugs = getAllTourSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
} 