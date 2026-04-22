import { Clock, Mountain, Users, Calendar, CheckCircle } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

export default function TrekOverview({ pkg }: { pkg: ApiPackage }) {
  const stats = [
    { icon: Clock,    label: 'Duration',   value: pkg.duration },
    { icon: Mountain, label: 'Max Altitude', value: pkg.altitude ?? '—' },
    { icon: Users,    label: 'Group Size',  value: pkg.groupSize },
    { icon: Calendar, label: 'Best Season', value: pkg.bestSeason.slice(0, 3).join(', ') || '—' },
  ];

  return (
    <div className="space-y-8">

      {/* Quick-stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Icon className="w-5 h-5 text-sky-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Overview</h2>
        <p className="text-gray-600 leading-relaxed text-base">{pkg.description}</p>
      </div>

      {/* Highlights */}
      {pkg.highlights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
          <ul className="space-y-2.5">
            {pkg.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Includes */}
      {pkg.includes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pkg.includes.map((item) => (
              <div key={item} className="flex items-start gap-2.5 bg-green-50 rounded-lg px-4 py-2.5">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Season */}
      {pkg.bestSeason.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Season</h2>
          <div className="flex flex-wrap gap-2">
            {pkg.bestSeason.map((month) => (
              <span
                key={month}
                className="bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100"
              >
                {month}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
