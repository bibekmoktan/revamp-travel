import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

const difficultyStyles: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-yellow-100 text-yellow-700',
  challenging: 'bg-red-100 text-red-600',
  extreme:     'bg-purple-100 text-purple-700',
};

interface TrekCardProps {
  package: ApiPackage;
}

export default function TrekCard({ package: pkg }: TrekCardProps) {
  const diffClass =
    difficultyStyles[pkg.difficulty ?? ''] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/trekking/${pkg.slug}`} className="block group">
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">

        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={pkg.featureImage.url}
            alt={pkg.featureImage.alt ?? pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-sky-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
            ${pkg.price.toLocaleString()}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {pkg.location}
          </p>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
            {pkg.title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4 shrink-0" />
              {pkg.duration}
            </span>
            {pkg.altitude && (
              <span className="flex items-center gap-1 text-gray-500">
                <Mountain className="w-4 h-4 shrink-0" />
                {pkg.altitude}
              </span>
            )}
            {pkg.difficulty && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${diffClass}`}>
                {pkg.difficulty}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-yellow-400 text-sm">
              {'★'.repeat(Math.floor(pkg.rating))}
              {pkg.rating % 1 !== 0 && '☆'}
            </span>
            <span className="text-xs text-gray-500">
              {pkg.rating} ({pkg.reviews} reviews)
            </span>
          </div>

          {/* Best season */}
          {pkg.bestSeason.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pkg.bestSeason.slice(0, 4).map((month) => (
                <span
                  key={month}
                  className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium"
                >
                  {month}
                </span>
              ))}
            </div>
          )}

          <div className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-lg text-center transition-colors duration-200">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
