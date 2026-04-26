import Image from 'next/image';
import Link from 'next/link';
import { trendingDestinations } from '@/data/destinations';

const [d0, d1, d2, d3, d4, d5] = trendingDestinations;

export default function TrendingDestinations() {
  return (
    <section className="px-6 md:px-16 py-12">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trending Destinations</h2>
          <Link href="/destinations" className="text-sm text-sky-600 hover:underline font-medium">
            See all
          </Link>
        </div>

        {/* Mosaic layout */}
        <div className="flex gap-4">
          {/* Left 2/3 */}
          <div className="w-2/3 h-[500px] flex flex-col gap-4">
            {/* Top row */}
            <div className="flex gap-4 h-1/2">
              <DestCard dest={d0} className="w-1/3" />
              <DestCard dest={d1} className="w-2/3" />
            </div>
            {/* Bottom row */}
            <div className="flex gap-4 h-1/2">
              <DestCard dest={d3} className="w-1/3" />
              <div className="w-2/3 flex gap-4">
                <DestCard dest={d4} className="w-1/3" />
                <DestCard dest={d5} className="w-2/3" />
              </div>
            </div>
          </div>

          {/* Right 1/3 — tall card */}
          <DestCard dest={d2} className="w-1/3 h-[500px]" tall />
        </div>
      </div>
    </section>
  );
}

function DestCard({
  dest,
  className,
  tall,
}: {
  dest: (typeof trendingDestinations)[number];
  className?: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className={`group relative overflow-hidden block ${className ?? ''}`}
    >
      <Image
        src={dest.image}
        alt={dest.label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className={`absolute left-3 right-3 ${tall ? 'bottom-4' : 'bottom-3'}`}>
        <p className="text-white font-semibold text-[14px] drop-shadow">{dest.label}</p>
      </div>
    </Link>
  );
}
