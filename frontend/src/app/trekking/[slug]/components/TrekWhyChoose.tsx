import type { WhyChoose } from '@/types/api';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  data: WhyChoose;
}

export default function TrekWhyChoose({ data }: Props) {
  if (!data.description && !data.points.length) return null;

  return (
    <div id="section-why-choose" className="bg-[#0F4C81] rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-3">Why Choose This Route?</h2>

      {data.description && (
        <p className="text-blue-100 leading-relaxed mb-5 text-sm">{data.description}</p>
      )}

      {data.points.length > 0 && (
        <ul className="space-y-2.5">
          {data.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-blue-50 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
