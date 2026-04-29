import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain, Users } from 'lucide-react';
import type { ApiPackage } from '@/types/api';
import WishlistButton from '@/app/components/WishlistButton';

const difficultyStyles: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-yellow-100 text-yellow-700',
  challenging: 'bg-orange-100 text-orange-600',
  extreme:     'bg-red-100 text-red-600',
};

interface TrekListItemProps {
  package: ApiPackage;
}

export default function TrekListItem({ package: pkg }: TrekListItemProps) {
  const diffClass =
    difficultyStyles[pkg.difficulty ?? ''] ?? 'bg-[#E3F2FD] text-[#607D8B]';

  return (
    <Link href={`/trekking/${pkg.slug}`} className="block group">
      <div className="bg-white rounded-2xl border border-[#E3F2FD] group-hover:shadow-lg group-hover:border-[#64B5F6]/40 transition-all duration-300 overflow-hidden">
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
            {/* Left accent stripe */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#1E88E5] hidden md:block" />
            <WishlistButton pkg={pkg} className="absolute top-3 right-3 z-10" />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div>
                <p className="text-xs text-[#607D8B] uppercase tracking-widest mb-1 font-medium">
                  {pkg.location}
                </p>
                <h3 className="text-xl font-bold text-[#37474F] leading-snug">
                  {pkg.title}
                </h3>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-[#607D8B] mb-0.5">From</p>
                <span className="text-2xl font-bold text-[#0F4C81]">
                  ${pkg.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-[#607D8B] mb-3">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1E88E5]" />
                {pkg.duration}
              </span>
              {pkg.altitude && (
                <span className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-[#1E88E5]" />
                  {pkg.altitude}
                </span>
              )}
              {pkg.groupSize && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1E88E5]" />
                  {pkg.groupSize}
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
              <span className="text-yellow-400 text-sm tracking-tight">
                {'★'.repeat(Math.floor(pkg.rating))}
                {pkg.rating % 1 !== 0 && <span className="text-gray-300">☆</span>}
              </span>
              <span className="text-sm text-[#607D8B]">
                {pkg.rating} ({pkg.reviews} reviews)
              </span>
            </div>

            {/* Season + CTA */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mt-auto pt-3 border-t border-[#F8FAFB]">
              {pkg.bestSeason.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#607D8B] uppercase tracking-wide mb-1.5">
                    Best Time
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.bestSeason.slice(0, 6).map((month) => (
                      <span
                        key={month}
                        className="bg-[#E3F2FD] text-[#0F4C81] text-xs px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="shrink-0 bg-[#1E88E5] hover:bg-[#1565C0] text-white text-sm font-semibold py-2.5 px-6 rounded-xl text-center transition-colors duration-200">
                View Details &amp; Book
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
