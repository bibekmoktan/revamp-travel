import { Suspense } from 'react';
import TrekkingPage from './components/TrekkingPage';
import PackageResults from './components/PackageResults';
import PackageGridSkeleton from './components/PackageGridSkeleton';
import type { PackageFilters } from '@/types/api';

export const metadata = {
  title: 'Trekking Packages | Travel Nepal',
  description:
    'Discover breathtaking trekking adventures across the Himalayas. Browse packages by price, duration, difficulty, and season.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const getString = (key: string) => {
    const v = params[key];
    return typeof v === 'string' ? v : undefined;
  };

  const filters: PackageFilters = {
    // If an activity is selected use it as the category; fall back to 'trekking'
    category:   getString('activity') ?? 'trekking',
    searchTerm: getString('searchTerm'),
    minPrice:   getString('minPrice') ? Number(getString('minPrice')) : undefined,
    maxPrice:   getString('maxPrice') ? Number(getString('maxPrice')) : undefined,
    sortBy:     (getString('sortBy') as PackageFilters['sortBy']) ?? 'createdAt',
    sortOrder:  (getString('sortOrder') as PackageFilters['sortOrder']) ?? 'desc',
    page:       getString('page') ? Number(getString('page')) : 1,
    limit:      12,
    status:     'active',
    difficulty: getString('difficulty'),
    duration:   getString('duration'),
    season:     getString('season'),
    trekType:   getString('trekType'),
  };

  const view = getString('view') === 'list' ? 'list' : 'card';

  // Changing the key forces Suspense to unmount the old result and show the
  // skeleton while the server fetches fresh data for the new filter combination.
  const filterKey = JSON.stringify({ ...filters, view });

  return (
    <TrekkingPage>
      <Suspense key={filterKey} fallback={<PackageGridSkeleton />}>
        <PackageResults filters={filters} view={view} />
      </Suspense>
    </TrekkingPage>
  );
}
