'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApiPackage } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

async function fetchSuggestions(term: string): Promise<ApiPackage[]> {
  try {
    const params = new URLSearchParams({
      searchTerm: term,
      category:   'trekking',
      limit:      '5',
      status:     'active',
    });
    const res = await fetch(`${API_BASE}/packages?${params}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default function SearchBox() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [inputVal,    setInputVal]    = useState(searchParams.get('searchTerm') ?? '');
  const [suggestions, setSuggestions] = useState<ApiPackage[]>([]);
  const [open,        setOpen]        = useState(false);
  const [loading,     setLoading]     = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedVal = useDebounce(inputVal, 300);

  // Fetch suggestions whenever the debounced value changes
  useEffect(() => {
    const term = debouncedVal.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchSuggestions(term).then((results) => {
      if (cancelled) return;
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [debouncedVal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applySearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) params.set('searchTerm', term.trim());
    else params.delete('searchTerm');
    params.delete('page');
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch(inputVal);
  };

  const handleSelect = (pkg: ApiPackage) => {
    setInputVal(pkg.title);
    setOpen(false);
    router.push(`/trekking/${pkg.slug}`);
  };

  const handleClear = () => {
    setInputVal('');
    setSuggestions([]);
    setOpen(false);
    applySearch('');
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 border-b border-gray-200 px-1"
      >
        <Search
          className={`w-4 h-4 shrink-0 transition-colors ${
            loading ? 'text-[#1E88E5] animate-pulse' : 'text-[#607D8B]'
          }`}
        />
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search treks…"
          className="flex-1 py-1 px-2 text-sm text-[#37474F] placeholder:text-[#607D8B]/60 bg-transparent outline-none"
        />
        {inputVal && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[#607D8B]/60 hover:text-[#607D8B] text-xs leading-none"
          >
            ✕
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((pkg) => (
            <button
              key={pkg._id}
              type="button"
              onClick={() => handleSelect(pkg)}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#F3F6FB] transition-colors group"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                {pkg.featureImage?.url && (
                  <Image
                    src={pkg.featureImage.url}
                    alt={pkg.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#1E88E5] transition-colors">
                  {pkg.title}
                </p>
                <p className="text-xs text-[#607D8B] truncate">
                  {pkg.location}
                  {pkg.duration ? ` · ${pkg.duration}` : ''}
                </p>
              </div>

              {/* Price */}
              <span className="text-sm font-semibold text-[#0F4C81] shrink-0">
                ${pkg.price.toLocaleString()}
              </span>
            </button>
          ))}

          {/* View all */}
          <button
            type="button"
            onClick={() => applySearch(inputVal)}
            className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-[#1E88E5] hover:bg-[#E3F2FD] transition-colors border-t border-gray-100"
          >
            View all results for &ldquo;{inputVal}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
