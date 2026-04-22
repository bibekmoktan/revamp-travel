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

interface TrekListItemProps {
  package: ApiPackage;
}

export default function TrekListItem({ package: pkg }: TrekListItemProps) {
  const diffClass =
    difficultyStyles[pkg.difficulty ?? ''] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/trekking/${pkg.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Image */}
          <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 overflow-hidden">
            <Image
              src={pkg.featureImage.url}
              alt={pkg.featureImage.alt ?? pkg.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {pkg.location}
                </p>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {pkg.title}
                </h3>
              </div>
              <span className="text-2xl font-bold text-green-600 shrink-0">
                ${pkg.price.toLocaleString()}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {pkg.duration}
              </span>
              {pkg.altitude && (
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4" />
                  {pkg.altitude}
                </span>
              )}
              {pkg.difficulty && (
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize ${diffClass}`}>
                  {pkg.difficulty}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400">
                {'★'.repeat(Math.floor(pkg.rating))}
                {pkg.rating % 1 !== 0 && '☆'}
              </span>
              <span className="text-sm text-gray-500">
                {pkg.rating} ({pkg.reviews} reviews)
              </span>
            </div>

            {/* Season + CTA */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mt-auto">
              {pkg.bestSeason.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Best Time</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.bestSeason.slice(0, 6).map((month) => (
                      <span
                        key={month}
                        className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg text-center transition-colors duration-200">
                View Details &amp; Book
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
