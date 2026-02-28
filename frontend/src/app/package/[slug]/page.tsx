import { packages } from '../../../data/packages';
import { notFound } from 'next/navigation';
import PackageDetails from '../../components/PackageDetails/PackageDetails';

interface PackageDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Next.js page component for individual package details
 * Handles data fetching and renders the PackageDetails component
 */
export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  // Await the params Promise (Next.js 15 requirement)
  const { slug } = await params;
  
  // Find the package by slug
  const packageData = packages.find(pkg => pkg.slug === slug);
  
  // If package doesn't exist, show 404
  if (!packageData) {
    notFound();
  }

  // Render the main component with the package data
  return (
    <PackageDetails package={packageData} />
  );
} 