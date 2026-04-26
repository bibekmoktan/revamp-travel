import Image from 'next/image';
import Link from 'next/link';
import { topDestinations } from '@/data/destinations';

export default function TopDestinations() {
  return (
    <section className="py-12 px-6 md:px-16">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Top Destinations</h2>
          <Link href="/destinations" className="text-sm text-sky-600 hover:underline font-medium">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topDestinations.map((destination, i) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className={`group relative overflow-hidden block ${i === 0 ? 'row-span-2' : ''}`}
            >
              <div className={`relative w-full overflow-hidden ${i === 0 ? 'min-h-[390px]' : 'h-[185px]'}`}>
                <Image
                  src={destination.image}
                  alt={destination.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-[14px] leading-tight">
                    {destination.label}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
