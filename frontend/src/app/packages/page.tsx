import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>>['data'] = [];
  try {
    const res = await getCategories();
    categories = res.data ?? [];
  } catch {
    // backend unavailable
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[320px] w-full overflow-hidden">
        <Image src="/images/treks/bg-1.jpg" alt="Packages" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">All Packages</h1>
          <p className="text-gray-300 text-sm max-w-[440px]">
            Explore Nepal your way — trekking, tours, climbing, heli rides and more.
          </p>
          <span className="mt-4 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 backdrop-blur-sm">
            {categories.length} categories available
          </span>
        </div>
      </div>

      {/* Category grid */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-14">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Browse by Category</h2>

        {categories.length === 0 ? (
          <p className="text-gray-400 text-sm">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/packages/${cat.slug}`}
                className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={cat.image || '/images/treks/bg-1.jpg'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-sky-600 text-white text-[11px] font-bold px-2.5 py-1">
                    Browse
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{cat.description}</p>
                  <div className="flex items-center gap-1.5 text-sky-600 text-sm font-semibold mt-4">
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
