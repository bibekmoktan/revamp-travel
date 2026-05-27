import type { Season } from '@/types/api';
import { Sun, Leaf, Snowflake, CloudRain } from 'lucide-react';

const SEASON_ICON: Record<string, React.ReactNode> = {
  spring:  <Leaf  className="w-5 h-5 text-green-500" />,
  autumn:  <Leaf  className="w-5 h-5 text-orange-400" />,
  fall:    <Leaf  className="w-5 h-5 text-orange-400" />,
  summer:  <Sun   className="w-5 h-5 text-yellow-400" />,
  winter:  <Snowflake className="w-5 h-5 text-sky-400" />,
  monsoon: <CloudRain className="w-5 h-5 text-blue-400" />,
};

function seasonIcon(name: string) {
  const key = name.toLowerCase();
  return SEASON_ICON[key] ?? <Sun className="w-5 h-5 text-yellow-400" />;
}

interface Props {
  seasons: Season[];
}

export default function TrekSeasons({ seasons }: Props) {
  if (!seasons.length) return null;

  return (
    <div id="section-seasons">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Seasons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {seasons.map((s, i) => (
          <div key={i} className="bg-[#F3F6FB] rounded-xl px-5 py-4 flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{seasonIcon(s.name)}</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {s.name}
                {s.months && (
                  <span className="ml-2 text-xs font-normal text-gray-500">({s.months})</span>
                )}
              </p>
              {s.notes && (
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{s.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
