import type { PricingTier } from '@/types/api';
import { Users } from 'lucide-react';

interface Props {
  tiers: PricingTier[];
  basePrice: number;
}

export default function TrekPricingTiers({ tiers, basePrice }: Props) {
  const rows = tiers.length > 0 ? tiers : null;
  if (!rows) return null;

  return (
    <div id="section-pricing">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0F4C81] text-white">
              <th className="px-5 py-3 text-left font-semibold">Group Size</th>
              <th className="px-5 py-3 text-right font-semibold">Price per Person</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tier, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? 'bg-white' : 'bg-[#F3F6FB]'}
              >
                <td className="px-5 py-3 flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4 text-[#1E88E5] shrink-0" />
                  {tier.label}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-gray-900">
                  US${tier.pricePerPerson.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 px-5 py-3 bg-gray-50 border-t border-gray-100">
          Base price from US${basePrice.toLocaleString()}. Peak season supplements may apply.
        </p>
      </div>
    </div>
  );
}
