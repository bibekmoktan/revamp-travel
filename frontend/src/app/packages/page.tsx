import { packageCategories } from '../../data/packages';
import PackagesPage from '../components/PackagesPage/PackagesPage';

/**
 * Next.js page component for the main packages page
 * Handles data preparation and renders the PackagesPage component
 */
export default function PackagesPageRoute() {
  // Calculate total packages across all categories
  const totalPackages = packageCategories.reduce((total, cat) => total + cat.packageCount, 0);

  // Render the main content component with prepared data
  return (
    <PackagesPage
      categories={packageCategories}
      totalPackages={totalPackages}
    />
  );
} 