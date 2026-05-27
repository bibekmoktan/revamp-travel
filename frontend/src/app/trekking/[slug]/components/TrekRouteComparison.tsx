import type { RouteComparison } from '@/types/api';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  comparison: RouteComparison;
  thisRouteName: string;
}

export default function TrekRouteComparison({ comparison, thisRouteName }: Props) {
  if (!comparison.rows.length) return null;

  return (
    <div id="section-route-comparison">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-5 h-5 text-[#1E88E5]" />
        <h2 className="text-2xl font-bold text-gray-900">
          {thisRouteName} vs {comparison.alternativeName}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F3F6FB]">
              <th className="px-5 py-3 text-left font-semibold text-gray-600 w-1/3"></th>
              <th className="px-5 py-3 text-center font-semibold text-[#0F4C81] w-1/3">
                {thisRouteName}
              </th>
              <th className="px-5 py-3 text-center font-semibold text-gray-600 w-1/3">
                {comparison.alternativeName}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F3F6FB]'}>
                <td className="px-5 py-3 font-medium text-gray-700">{row.attribute}</td>
                <td className="px-5 py-3 text-center text-[#0F4C81] font-medium">{row.thisRoute}</td>
                <td className="px-5 py-3 text-center text-gray-500">{row.alternativeRoute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
