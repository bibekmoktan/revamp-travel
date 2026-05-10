import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getPackages } from '@/lib/api';
import type { ApiPackage } from '@/types/api';

export default async function TrekAddOns({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) {
  let related: ApiPackage[] = [];

  try {
    const { data } = await getPackages({ category, limit: 5 });
    related = data.filter(p => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return null;
  }

  if (related.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <h3 className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">
        You might also like
      </h3>

      <div className="space-y-3">
        {related.map(pkg => (
          <Link
            key={pkg._id}
            href={`/trekking/${pkg.slug}`}
            className="flex gap-3 group"
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={pkg.featureImage?.url ?? ''}
                alt={pkg.title}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1E88E5] transition-colors leading-snug">
                {pkg.title}
              </p>
              <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px]">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{pkg.duration}</span>
              </div>
              <p className="text-xs font-bold text-[#1E88E5] mt-0.5">
                US${(pkg.price ?? 0).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
