import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import destinations from '@/data/destinations';
import { getPackages } from '@/lib/api';
import TrekCard from '@/app/components/TrekCard';
import { MapPin } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function PackageGrid({ locationKeyword }: { locationKeyword: string }) {
  let packages: Awaited<ReturnType<typeof getPackages>>['data'] = [];
  try {
    const res = await getPackages({ searchTerm: locationKeyword, status: 'active', limit: 12 });
    packages = res.data;
  } catch {
    // backend unavailable
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <MapPin className="w-10 h-10 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">No packages available yet</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon — we're adding tours to this region.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {packages.map((pkg) => (
        <TrekCard key={pkg._id} package={pkg} />
      ))}
    </div>
  );
}

function PackageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[420px] bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) notFound();

  return (
    <main className="min-h-screen bg-gray-50 mt-[100px]">
      {/* Hero */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.label}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>Nepal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {destination.label}
          </h1>
          <p className="text-white/80 max-w-[560px] text-sm md:text-base leading-relaxed">
            {destination.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link
              href="/custom-package"
              className="px-6 py-3 sm:py-3.5 bg-sky-700 sm:min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition text-center"
            >
              Customize Your Trip
            </Link>
            <Link
              href="/trekking"
              className="px-6 py-3 sm:py-3.5 bg-sky-700 sm:min-w-[160px] hover:bg-sky-800 text-white font-semibold text-sm transition text-center"
            >
              Explore Tours
            </Link>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-8">
          Packages in {destination.label}
        </h2>
        <Suspense fallback={<PackageGridSkeleton />}>
          <PackageGrid locationKeyword={destination.locationKeyword} />
        </Suspense>
      </div>
    </main>
  );
}
