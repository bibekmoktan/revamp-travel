import Image from 'next/image';
import Link from 'next/link';
import { topDestinations } from '@/data/destinations';

export default function TopDestinations() {
  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Destinations to Inspire Adventure</h2>
          <p className="text-gray-500 text-sm max-w-[480px] mx-auto leading-relaxed">
            From the rooftop of the world to hidden valleys — discover Nepal's most breathtaking regions waiting to be explored.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {topDestinations.map((destination) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col items-center p-4"
            >
              {/* Rounded image */}
              <div className="relative w-full h-[140px] rounded-xl overflow-hidden mb-4">
                <Image
                  src={destination.image}
                  alt={destination.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Name */}
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2 text-center">
                {destination.label}
              </h3>

              {/* More link */}
              <span className="text-[11px] font-bold text-sky-600 tracking-widest uppercase border-b border-sky-200 pb-0.5 group-hover:border-sky-500 transition-colors">
                More
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
