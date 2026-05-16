import { getPackages } from '@/lib/api';
import type { ApiPackage } from '@/types/api';
import TrekCard from '@/app/components/TrekCard';
import TrekAddOnsScroller from './TrekAddOnsScroller';

export default async function TrekAddOns({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) {
  let related: ApiPackage[] = [];

  try {
    const { data } = await getPackages({ category, limit: 7 });
    related = data.filter(p => p.slug !== currentSlug).slice(0, 6);
  } catch {
    return null;
  }

  if (related.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
      <TrekAddOnsScroller>
        {related.map(pkg => (
          <div key={pkg._id} className="w-72 shrink-0">
            <TrekCard package={pkg} />
          </div>
        ))}
      </TrekAddOnsScroller>
    </div>
  );
}
