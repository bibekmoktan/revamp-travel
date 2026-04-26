'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApiPackage } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

async function fetchSuggestions(term: string): Promise<ApiPackage[]> {
  try {
    const params = new URLSearchParams({ searchTerm: term, limit: '6', status: 'active' });
    const res = await fetch(`${API_BASE}/packages?${params}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState<ApiPackage[]>([]);
  const [open, setOpen]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState(false);
  const containerRef                = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);

  const debounced = useDebounce(query, 300);

  useEffect(() => {
    const term = debounced.trim();
    if (term.length < 2) { setSuggestions([]); setOpen(false); return; }
    let cancelled = false;
    setLoading(true);
    fetchSuggestions(term).then((results) => {
      if (cancelled) return;
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [debounced]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goToResults = () => {
    const term = query.trim();
    setOpen(false);
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : '/trekking');
  };

  const handleSelect = (pkg: ApiPackage) => {
    setOpen(false);
    router.push(`/trekking/${pkg.slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input row */}
      <div className={`flex items-center gap-2 px-3 py-1.5 text-black w-full transition-colors ${focused ? 'bg-white border border-gray-200' : 'bg-gray-100 border border-transparent'}`}>
        {loading
          ? <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
          : <Search className="w-4 h-4 text-gray-400 shrink-0" />}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && goToResults()}
          onFocus={() => { setFocused(true); suggestions.length > 0 && setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Search destinations, treks, tours…"
          className="flex-1 px-1.5 py-1 outline-none text-sm bg-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); inputRef.current?.focus(); }}
            className="text-gray-400 hover:text-gray-600 text-xs px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {suggestions.map((pkg) => (
            <button
              key={pkg._id}
              type="button"
              onClick={() => handleSelect(pkg)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 transition-colors group border-b border-gray-50 last:border-0"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {pkg.featureImage?.url && (
                  <Image
                    src={pkg.featureImage.url}
                    alt={pkg.title}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">
                  {pkg.title}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {pkg.location}{pkg.duration ? ` · ${pkg.duration}` : ''} · <span className="capitalize">{pkg.category}</span>
                </p>
              </div>
              <span className="text-sm font-bold text-[#0F4C81] shrink-0">
                ${pkg.price.toLocaleString()}
              </span>
            </button>
          ))}

          {/* View all results */}
          <button
            type="button"
            onClick={goToResults}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            View all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
