import Image from 'next/image';
import Link from 'next/link';
import type { ApiPackage } from '@/types/api';

const difficultyColor: Record<string, string> = {
  easy:        'bg-green-500',
  moderate:    'bg-yellow-500',
  challenging: 'bg-orange-500',
  extreme:     'bg-red-600',
};

export default function TrekHero({ pkg }: { pkg: ApiPackage }) {
  const diffClass = difficultyColor[pkg.difficulty ?? ''] ?? 'bg-gray-500';

  return (
    <div className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
      <Image
        src={pkg.featureImage.url}
        alt={pkg.featureImage.alt ?? pkg.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Breadcrumb */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-white/80">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/trekking" className="hover:text-white transition-colors">Trekking</Link>
        <span>/</span>
        <span className="text-white truncate max-w-[200px]">{pkg.title}</span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 max-w-5xl mx-auto w-full">
        <p className="text-sm text-gray-300 uppercase tracking-widest mb-2">{pkg.location}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
          {pkg.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          {pkg.difficulty && (
            <span className={`${diffClass} text-white text-xs font-semibold px-3 py-1 rounded-full capitalize`}>
              {pkg.difficulty}
            </span>
          )}
          <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">
            {pkg.duration}
          </span>
          {pkg.altitude && (
            <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">
              ▲ {pkg.altitude}
            </span>
          )}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">
            <span className="text-yellow-400">{'★'.repeat(Math.floor(pkg.rating))}</span>
            <span className="ml-1">{pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
