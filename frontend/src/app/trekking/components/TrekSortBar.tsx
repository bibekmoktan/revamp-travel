'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Grid, List, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest',       value: 'createdAt:desc' },
  { label: 'Price: Low',   value: 'price:asc'      },
  { label: 'Price: High',  value: 'price:desc'     },
  { label: 'Top Rated',    value: 'rating:desc'    },
] as const;

interface TrekSortBarProps {
  total: number;
}

export default function TrekSortBar({ total }: TrekSortBarProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = `${searchParams.get('sortBy') ?? 'createdAt'}:${searchParams.get('sortOrder') ?? 'desc'}`;
  const currentView = searchParams.get('view') ?? 'card';

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => params.set(key, val));
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    setParam({ sortBy, sortOrder });
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 transition-opacity duration-200 ${
        isPending ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      <p className="text-sm text-[#607D8B]">
        <span className="font-bold text-[#0F4C81]">{total}</span>{' '}
        {total === 1 ? 'trek' : 'treks'} found
      </p>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={handleSort}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-[#F8FAFB] text-sm text-[#37474F] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#607D8B] pointer-events-none" />
        </div>

        {/* View toggle */}
        <div className="flex bg-[#F8FAFB] border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setParam({ view: 'card' })}
            aria-label="Grid view"
            className={`p-1.5 rounded-md transition-colors ${
              currentView === 'card' ? 'bg-[#1E88E5] text-white shadow-sm' : 'text-[#607D8B] hover:bg-gray-100'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setParam({ view: 'list' })}
            aria-label="List view"
            className={`p-1.5 rounded-md transition-colors ${
              currentView === 'list' ? 'bg-[#1E88E5] text-white shadow-sm' : 'text-[#607D8B] hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
