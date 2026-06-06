import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrekkingPage from './components/TrekkingPage';
import PackageResults from './components/PackageResults';
import PackageGridSkeleton from './components/PackageGridSkeleton';
import type { PackageFilters } from '@/types/api';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Nepal Trekking Packages — Everest, Annapurna & More',
  description: 'Browse our full range of Nepal trekking packages — Everest Base Camp, Annapurna Circuit, Langtang, Manaslu, and more. All difficulty levels, custom durations, expert guides.',
  alternates: { canonical: `${SITE_URL}/trekking` },
  openGraph: {
    url: `${SITE_URL}/trekking`,
    title: 'Nepal Trekking Packages — Everest, Annapurna & More',
    description: 'Browse our full range of Nepal trekking packages — Everest Base Camp, Annapurna Circuit, Langtang, Manaslu and more.',
  },
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
    category:   getString('activity') ?? getString('category'),
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
