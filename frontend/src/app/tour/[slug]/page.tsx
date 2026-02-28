import { notFound } from 'next/navigation';
import TourDetails from '../../components/TourDetails/TourDetails';
import { getTourBySlug, getAllTourSlugs } from '../../../data/tours';

// Define the props interface for the page component
interface TourPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourPage({ params }: TourPageProps) {
  // Await the params since they're now a Promise in Next.js 15+
  const { slug } = await params;
  
  // Fetch tour data by slug
  const tour = getTourBySlug(slug);
  
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
  // Await the params since they're now a Promise in Next.js 15+
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  
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