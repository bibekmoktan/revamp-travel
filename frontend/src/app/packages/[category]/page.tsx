import { getPackagesByCategory, getPackageCategory } from '../../../data/packages';
import { notFound } from 'next/navigation';
import PackageCategory from '../../components/PackageCategory/PackageCategory';

interface PackageCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Next.js page component for package categories
 * Handles data fetching and renders the PackageCategory component
 */
export default async function CategoryPage({ params }: PackageCategoryPageProps) {
  // Await the params Promise (Next.js 15 requirement)
  const { category } = await params;
  
  // Get packages and category info for this category
  const packages = getPackagesByCategory(category);
  const categoryInfo = getPackageCategory(category);
  
  // If category doesn't exist, show 404
  if (!categoryInfo) {
    notFound();
  }

  // Render the main component with the fetched data
  return (
    <PackageCategory
      packages={packages}
      categoryInfo={categoryInfo}
    />
  );
} 