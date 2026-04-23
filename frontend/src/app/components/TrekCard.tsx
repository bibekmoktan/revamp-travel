import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

interface TrekCardProps {
  package: ApiPackage;
  href?: string;
}

export default function TrekCard({ package: pkg, href }: TrekCardProps) {
  const diffClass =
    pkg.difficulty === 'challenging' || pkg.difficulty === 'extreme'
      ? 'bg-red-100 text-red-600'
      : pkg.difficulty === 'moderate'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700';

  return (
    <Link href={href ?? `/trekking/${pkg.slug}`} className="block group">
      <div className="w-full h-[600px] bg-white rounded-[8px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">

        {/* Image */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <Image
            src={pkg.featureImage.url}
            alt={pkg.featureImage.alt ?? pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-6">

          {/* Location & Price */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-[13px] text-[#607D8B]">{pkg.location}</p>
            <span className="text-[16px] font-semibold text-[#0F4C81]">${pkg.price.toLocaleString()}</span>
          </div>

          {/* Title */}
          <h3 className="text-[20px] font-bold text-gray-900 leading-[1.2] mb-2">
            {pkg.title}
          </h3>

          <div className="space-y-4">

            {/* Duration, Altitude & Difficulty */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{pkg.duration}</span>
              </div>
              {pkg.altitude && (
                <div className="flex items-center gap-1 text-[#607D8B]">
                  <Mountain className="w-4 h-4" />
                  <span>{pkg.altitude}</span>
                </div>
              )}
              {pkg.difficulty && (
                <span className={`px-3 py-1 rounded-full text-[12px] font-[500] capitalize ${diffClass}`}>
                  {pkg.difficulty}
                </span>
              )}
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(pkg.rating))}
                {pkg.rating % 1 !== 0 && '☆'}
              </div>
              <span className="text-sm text-gray-600">
                {pkg.rating} ({pkg.reviews} reviews)
              </span>
            </div>

            {/* Best Season */}
            {pkg.bestSeason.length > 0 && (
              <div className="text-sm flex gap-2 items-center">
                <span className="font-medium text-gray-600 block">Best Season:</span>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestSeason.slice(0, 4).map((month) => (
                    <span
                      key={month}
                      className="bg-[#EEF4FF] text-[#1E88E5] px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="w-full mt-6 bg-[#1E88E5] group-hover:bg-[#1565C0] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
