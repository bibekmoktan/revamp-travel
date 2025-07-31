import { notFound } from 'next/navigation';
import TrekDetails from '../../components/TrekDetails/TrekDetails';
import { getTrekBySlug, getAllTrekSlugs } from '../../../data/treks';

// Define the props interface for the page component
interface TrekPageProps {
  params: {
    slug: string;
  };
}

export default function TrekPage({ params }: TrekPageProps) {
  // Fetch trek data by slug
  const trek = getTrekBySlug(params.slug);
  
  // If trek not found, show 404 page
  if (!trek) {
    notFound();
  }

  return (
    <div>
      <TrekDetails trek={trek} />
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: TrekPageProps) {
  const trek = getTrekBySlug(params.slug);
  
  if (!trek) {
    return {
      title: 'Trek Not Found',
      description: 'The requested trek could not be found.',
    };
  }

  return {
    title: `${trek.name} - Viatours Trekking`,
    description: trek.description,
    keywords: `trek, trekking, adventure, ${trek.location}, ${trek.difficulty}, himalayas`,
  };
}

// Generate static params for all treks (for static generation)
export async function generateStaticParams() {
  const slugs = getAllTrekSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
} 