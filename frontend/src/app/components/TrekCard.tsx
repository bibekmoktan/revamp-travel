import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

interface TrekCardProps {
  package: ApiPackage;
  href?: string;
}

export default function TrekCard({ package: pkg, href }: TrekCardProps) {
  const dest = href ?? `/trekking/${pkg.slug}`;

  return (
    <div className="w-full h-[500px] bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">

      {/* Image — clickable */}
      <Link href={dest} className="block relative h-[260px] w-full overflow-hidden">
        <Image
          src={pkg.featureImage.url}
          alt={pkg.featureImage.alt ?? pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details */}
      <div className="px-4 py-2">

        {/* Rating & Price */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(pkg.rating))}
              {pkg.rating % 1 !== 0 && '☆'}
            </div>
            <span className="text-[12px] text-gray-600">
              {pkg.rating} ({pkg.reviews} reviews)
            </span>
          </div>
          <span className="text-[16px] font-semibold text-[#0F4C81]">${pkg.price.toLocaleString()}</span>
        </div>

        {/* Title */}
        <h3 className="text-[18px] h-[40px] font-bold text-gray-900 leading-[1.2] mb-2 line-clamp-2">
          {pkg.title}
        </h3>

        <div className="space-y-4">

          {/* Duration & Altitude */}
          <div className="flex items-center justify-between gap-4 text-[12px] text-[#607D8B]">
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
          </div>

          {/* Best Season */}
          {pkg.bestSeason.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pkg.bestSeason.slice(0, 4).map((month) => (
                <span
                  key={month}
                  className="bg-[#EEF4FF] text-[#1E88E5] px-3 py-1 rounded-full text-[12px] font-medium"
                >
                  {month}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA — clickable */}
        <Link
          href={dest}
          className="block w-full mt-6 bg-[#0F4C81] hover:bg-sky-800 text-white font-semibold py-3 px-6 transition-colors duration-200 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
