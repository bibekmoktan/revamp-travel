import type { WhyChoose } from '@/types/api';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  data: WhyChoose[];
}

export default function TrekWhyChoose({ data }: Props) {
  const blocks = data.filter((b) => b.title && (b.description || b.points.length > 0));
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, bi) => (
        <div key={bi} className="rounded-2xl p-6 text-black">
          <h2 className="text-2xl font-bold mb-3">{block.title}</h2>

          {block.description && (
            <p className="text-black leading-relaxed mb-5 text-sm">{block.description}</p>
          )}

          {block.points.length > 0 && (
            <ul className="space-y-2.5">
              {block.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-50 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
