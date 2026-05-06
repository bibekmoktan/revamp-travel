import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain, Gauge } from 'lucide-react';
import type { ApiPackage } from '@/types/api';
import WishlistButton from './WishlistButton';
import ShareButton from './ShareButton';

interface TrekCardProps {
  package: ApiPackage;
  href?: string;
}

export default function TrekCard({ package: pkg, href }: TrekCardProps) {
  const dest = href ?? `/trekking/${pkg.slug}`;

  return (
    <div className="w-full bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200 rounded-[12px]">

      {/* Image — clickable */}
      <div className="relative h-[230px] w-full overflow-hidden">
        <Link href={dest} className="block w-full h-full">
          <Image
            src={pkg.featureImage.url}
            alt={pkg.featureImage.alt ?? pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <ShareButton title={pkg.title} slug={pkg.slug} />
          <WishlistButton pkg={pkg} />
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-2 pb-4">

        {/* Rating & Price */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(pkg.rating))}
              {pkg.rating % 1 !== 0 && '☆'}
            </div>
            <span className="text-[10px] text-gray-600">
              {pkg.rating} ({pkg.reviews} reviews)
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#0F4C81]">${pkg.price.toLocaleString()}</span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] h-[40px] font-bold text-gray-900 leading-[1.2] mb-2 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Duration, Altitude, Difficulty */}
        <div className="flex items-center justify-between text-[10px] text-[#607D8B]">
          <div className="flex flex-col items-center gap-0.5">
            <Clock className="w-4 h-4 text-sky-800" />
            <span>{pkg.duration}</span>
          </div>
          {pkg.altitude && (
            <div className="flex flex-col items-center gap-0.5">
              <Mountain className="w-4 h-4 text-sky-800" />
              <span>{pkg.altitude}</span>
            </div>
          )}
          {pkg.difficulty && (
            <div className="flex flex-col items-center gap-0.5">
              <Gauge className="w-4 h-4 text-sky-800" />
              <span className="capitalize">{pkg.difficulty}</span>
            </div>
          )}
        </div>

        {/* CTA — clickable */}
        <Link
          href={dest}
          className="block w-full mt-6 bg-[#0F4C81] hover:bg-sky-800 text-white font-semibold py-3 px-6 transition-colors duration-200 text-center rounded-[12px] text-[16px]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
