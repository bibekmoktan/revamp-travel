import Link from 'next/link';
import { Clock, Mountain, Users, Phone } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

const difficultyColor: Record<string, string> = {
  easy:        'text-green-600 bg-green-50',
  moderate:    'text-yellow-700 bg-yellow-50',
  challenging: 'text-orange-600 bg-orange-50',
  extreme:     'text-red-600 bg-red-50',
};

export default function TrekBookingCard({ pkg }: { pkg: ApiPackage }) {
  const diffClass = difficultyColor[pkg.difficulty ?? ''] ?? 'text-gray-600 bg-gray-50';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5">

      {/* Price */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Starting from</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">${pkg.price.toLocaleString()}</span>
          <span className="text-gray-400 text-sm">/ person</span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Quick facts */}
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3 text-gray-600">
          <Clock className="w-4 h-4 text-sky-500 shrink-0" />
          <span><strong className="text-gray-900">Duration:</strong> {pkg.duration}</span>
        </li>
        {pkg.altitude && (
          <li className="flex items-center gap-3 text-gray-600">
            <Mountain className="w-4 h-4 text-sky-500 shrink-0" />
            <span><strong className="text-gray-900">Max Altitude:</strong> {pkg.altitude}</span>
          </li>
        )}
        <li className="flex items-center gap-3 text-gray-600">
          <Users className="w-4 h-4 text-sky-500 shrink-0" />
          <span><strong className="text-gray-900">Group Size:</strong> {pkg.groupSize}</span>
        </li>
        {pkg.difficulty && (
          <li className="flex items-center gap-3">
            <span className="w-4 h-4 shrink-0" />
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${diffClass}`}>
              {pkg.difficulty}
            </span>
          </li>
        )}
      </ul>

      <hr className="border-gray-100" />

      {/* Best season pills */}
      {pkg.bestSeason.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Best Season</p>
          <div className="flex flex-wrap gap-1.5">
            {pkg.bestSeason.map((m) => (
              <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <Link
        href={`/booking?package=${pkg.slug}`}
        className="block w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl text-center transition-colors duration-200 text-sm"
      >
        Book This Trek
      </Link>

      <Link
        href="/custom-package"
        className="block w-full border-2 border-sky-600 text-sky-600 hover:bg-sky-50 font-semibold py-3 rounded-xl text-center transition-colors duration-200 text-sm"
      >
        Customise Trip
      </Link>

      {/* Contact */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-1">
        <Phone className="w-4 h-4" />
        <span>Need help? <a href="tel:+977-1-0000000" className="text-sky-600 font-medium hover:underline">Call us</a></span>
      </div>
    </div>
  );
}
