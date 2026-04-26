import { Suspense } from 'react';
import { getPackages } from '@/lib/api';
import TrekCard from '@/app/components/TrekCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function Results({ q, page }: { q: string; page: number }) {
  const res = await getPackages({ searchTerm: q, page, limit: 12, status: 'active' });
  const { data, meta } = res;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Search className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
        <p className="text-gray-400 mb-6">
          We couldn&apos;t find any packages matching &ldquo;{q}&rdquo;
        </p>
        <Link
          href="/trekking"
          className="px-6 py-2.5 bg-sky-600 text-white rounded-full text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          Browse All Packages
        </Link>
      </div>
    );
  }

  const totalPages = meta.pages;

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">
        {meta.total} result{meta.total !== 1 ? 's' : ''} found
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((pkg) => (
          <TrekCard key={pkg._id} package={pkg} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Prev
            </Link>
          )}
          <span className="text-sm text-gray-500 px-2">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[500px] bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q    = (params.q ?? '').trim();
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Search className="w-5 h-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">
              {q ? <>Results for &ldquo;<span className="text-sky-600">{q}</span>&rdquo;</> : 'All Packages'}
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-8">
            Showing packages across all categories
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {q ? (
          <Suspense key={`${q}-${page}`} fallback={<ResultsSkeleton />}>
            <Results q={q} page={page} />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400">Enter a search term to find packages</p>
          </div>
        )}
      </div>
    </main>
  );
}
