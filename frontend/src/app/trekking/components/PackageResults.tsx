import { getPackages } from '@/lib/api';
import TrekCard from './TrekCard';
import TrekListItem from './TrekListItem';
import Pagination from './Pagination';
import type { PackageFilters } from '@/types/api';

interface Props {
  filters: PackageFilters;
  view: 'card' | 'list';
}

export default async function PackageResults({ filters, view }: Props) {
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
    // backend unavailable — fall through to empty state
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white">
        <div className="w-20 h-20 bg-[#E3F2FD] rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🏔️</span>
        </div>
        <h3 className="text-xl font-semibold text-[#37474F] mb-2">No treks found</h3>
        <p className="text-[#607D8B] max-w-sm">
          Try adjusting your filters to find the perfect adventure.
        </p>
      </div>
    );
  }

  return (
    <>
      {view === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <TrekCard key={pkg._id} package={pkg} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <TrekListItem key={pkg._id} package={pkg} />
          ))}
        </div>
      )}
      <Pagination currentPage={meta.page} totalPages={meta.pages} />
    </>
  );
}
