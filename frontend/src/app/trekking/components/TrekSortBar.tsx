'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useState, useRef, useEffect } from 'react';
import { Grid, List, ChevronDown, Search } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(searchParams.get('searchTerm') ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  const ACTIVITIES = [
    { label: 'Adventures',    value: 'adventures'    },
    { label: 'Hiking',        value: 'hiking'        },
    { label: 'Peak Climbing', value: 'peak-climbing' },
    { label: 'Rafting',       value: 'rafting'       },
    { label: 'Trekking',      value: 'trekking'      },
  ];

  const currentActivity = searchParams.get('activity') ?? '';
  const activityLabel = ACTIVITIES.find(a => a.value === currentActivity)?.label ?? 'Activities';

  const handleActivity = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentActivity === value) params.delete('activity');
    else params.set('activity', value);
    params.delete('page');
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    setActivityOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) params.set('searchTerm', searchVal.trim());
    else params.delete('searchTerm');
    params.delete('page');
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  };

  const currentSort = `${searchParams.get('sortBy') ?? 'rating'}:${searchParams.get('sortOrder') ?? 'desc'}`;
  const currentView = searchParams.get('view') ?? 'card';
  const currentLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label ?? 'Top Rated';

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => params.set(key, val));
      startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    },
    [router, pathname, searchParams],
  );

  const handleSort = (value: string) => {
    const [sortBy, sortOrder] = value.split(':');
    setParam({ sortBy, sortOrder });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
      if (activityRef.current && !activityRef.current.contains(e.target as Node)) setActivityOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white px-4 py-3 transition-opacity duration-200 ${
        isPending ? 'opacity-60 pointer-events-none' : ''
      }`}
    >

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm flex items-center gap-1 border-b border-gray-200 px-1">
        <Search className="w-4 h-4 text-[#607D8B] shrink-0" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search treks…"
          className="flex-1 py-1 px-2 text-sm text-[#37474F] placeholder:text-[#607D8B]/60 bg-transparent outline-none"
        />
        {searchVal && (
          <button type="button" onClick={() => { setSearchVal(''); handleSearch({ preventDefault: () => {} } as React.FormEvent); }} className="text-[#607D8B]/60 hover:text-[#607D8B] text-xs">✕</button>
        )}
      </form>

      <div className="flex items-center gap-6">
        {/* Sort */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <span className="text-sm text-[#607D8B] whitespace-nowrap">Sort by:</span>
          <div className="relative">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-sm text-[#607D8B] cursor-pointer hover:text-[#607D8B]/80 select-none"
            >
              <span>{currentLabel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-md z-50 min-w-[130px] py-1">
                {SORT_OPTIONS.map((o) => (
                  <div
                    key={o.value}
                    onClick={() => handleSort(o.value)}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                      currentSort === o.value
                        ? 'text-[#607D8B] font-medium bg-[#607D8B]/5'
                        : 'text-gray-600 hover:text-[#607D8B] hover:bg-[#607D8B]/5'
                    }`}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
         {/* Activities */}
        <div className="relative" ref={activityRef}>
          <div
            onClick={() => setActivityOpen(!activityOpen)}
            className={`flex items-center gap-1 text-sm cursor-pointer select-none whitespace-nowrap transition-colors ${
              currentActivity ? 'text-[#1E88E5] font-medium' : 'text-[#607D8B] hover:text-[#607D8B]/80'
            }`}
          >
            <span>{activityLabel}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activityOpen ? 'rotate-180' : ''}`} />
          </div>
          {activityOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-md z-50 min-w-[150px] py-1">
              {ACTIVITIES.map((a) => (
                <div
                  key={a.value}
                  onClick={() => handleActivity(a.value)}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    currentActivity === a.value
                      ? 'text-[#1E88E5] font-medium bg-[#1E88E5]/5'
                      : 'text-gray-600 hover:text-[#607D8B] hover:bg-[#607D8B]/5'
                  }`}
                >
                  {a.label}
                </div>
              ))}
            </div>
          )}
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
