import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getPackages } from '@/lib/api';
import TrekCard from '@/app/components/TrekCard';

export const dynamic = 'force-dynamic';

export default async function CategoryPackagesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const [catRes, pkgRes] = await Promise.all([
    getCategories(),
    getPackages({ category, status: 'active', limit: 50 }),
  ]);

  const cat = (catRes.data ?? []).find((c) => c.slug === category);
  if (!cat) notFound();

  const packages = pkgRes.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <Image src={cat.image || '/images/treks/bg-1.jpg'} alt={cat.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-2">Category</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{cat.name}</h1>
          <p className="text-gray-300 text-sm max-w-[480px]">{cat.description}</p>
          <span className="mt-4 bg-sky-600 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wide">
            {packages.length} Packages
          </span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 pt-6 pb-2">
        <p className="text-sm text-gray-500">
          <Link href="/packages" className="hover:text-sky-600 transition-colors">Packages</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{cat.name}</span>
        </p>
      </div>

      {/* Package grid */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-8">
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-400 text-lg font-medium mb-2">No packages found</p>
            <p className="text-gray-400 text-sm mb-6">Check back soon — we&apos;re adding more packages.</p>
            <Link href="/packages" className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-6 py-2.5 transition-colors">
              Back to Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <TrekCard key={pkg._id} package={pkg} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
