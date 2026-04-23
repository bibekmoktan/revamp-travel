import { getPackages } from '@/lib/api';
import TrekkingPage from './components/TrekkingPage';
import type { PackageFilters } from '@/types/api';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Trekking Packages | Travel Nepal',
  description:
    'Discover breathtaking trekking adventures across the Himalayas. Browse packages by price, duration, difficulty, and season.',
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const getString = (key: string) => {
    const v = params[key];
    return typeof v === 'string' ? v : undefined;
  };

  const filters: PackageFilters = {
    category:   'trekking',
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

  // Fetch on the server — no loading flash, full SSR with caching
  let packages: Awaited<ReturnType<typeof getPackages>>['data'] = [];
  let meta: Awaited<ReturnType<typeof getPackages>>['meta'] = {
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  };

  try {
    const result = await getPackages(filters);
    packages = result.data;
    meta = result.meta;
  } catch {
    // Backend unavailable — render empty state rather than crash
  }

  return <TrekkingPage packages={packages} meta={meta} view={view} />;
}
