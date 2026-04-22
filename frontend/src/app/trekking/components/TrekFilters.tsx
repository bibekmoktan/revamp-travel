'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest',        value: 'createdAt:desc' },
  { label: 'Oldest',        value: 'createdAt:asc'  },
  { label: 'Price: Low',    value: 'price:asc'      },
  { label: 'Price: High',   value: 'price:desc'     },
  { label: 'Top Rated',     value: 'rating:desc'    },
] as const;

interface TrekFiltersProps {
  total: number;
}

export default function TrekFilters({ total }: TrekFiltersProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch   = searchParams.get('searchTerm') ?? '';
  const currentSort     = `${searchParams.get('sortBy') ?? 'createdAt'}:${searchParams.get('sortOrder') ?? 'desc'}`;
  const currentView     = searchParams.get('view') ?? 'card';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '') {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      // Reset to page 1 on filter change (except view/sort)
      if (!('page' in updates) && !('view' in updates)) {
        params.delete('page');
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const val = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value.trim();
      setParam({ searchTerm: val || null });
    },
    [setParam],
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [sortBy, sortOrder] = e.target.value.split(':');
      setParam({ sortBy, sortOrder });
    },
    [setParam],
  );

  const handlePriceRange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const min = (e.currentTarget.elements.namedItem('minPrice') as HTMLInputElement).value.trim();
      const max = (e.currentTarget.elements.namedItem('maxPrice') as HTMLInputElement).value.trim();
      setParam({ minPrice: min || null, maxPrice: max || null });
    },
    [setParam],
  );

  const handleView = useCallback(
    (view: 'card' | 'list') => setParam({ view }),
    [setParam],
  );

  return (
    <div className={`transition-opacity duration-200 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="search"
            defaultValue={currentSearch}
            placeholder="Search treks…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Left: price range + sort */}
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />

          {/* Price range */}
          <form onSubmit={handlePriceRange} className="flex items-center gap-2">
            <input
              name="minPrice"
              type="number"
              min={0}
              defaultValue={currentMinPrice}
              placeholder="Min $"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              name="maxPrice"
              type="number"
              min={0}
              defaultValue={currentMaxPrice}
              placeholder="Max $"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Apply
            </button>
          </form>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={handleSort}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Right: total + view toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {total} {total === 1 ? 'trek' : 'treks'}
          </span>
          <div className="flex bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => handleView('card')}
              aria-label="Grid view"
              className={`p-2 rounded-md transition-colors duration-200 ${
                currentView === 'card'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleView('list')}
              aria-label="List view"
              className={`p-2 rounded-md transition-colors duration-200 ${
                currentView === 'list'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
