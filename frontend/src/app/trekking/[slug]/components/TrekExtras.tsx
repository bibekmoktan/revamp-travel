'use client';

import { useState } from 'react';
import { XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ApiPackage, FaqItem } from '@/types/api';

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex items-center justify-between w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-800">{item.question}</span>
            {openIdx === i
              ? <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 pt-1 bg-white">
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TrekExtras({ pkg }: { pkg: ApiPackage }) {
  const notIncluded = pkg.notIncluded ?? [];
  const faq         = pkg.faq         ?? [];
  const moreInfo    = pkg.moreInfo    ?? [];

  return (
    <>
      {/* What's Not Included */}
      {notIncluded.length > 0 && (
        <div className='bg-red-50 rounded-2xl p-4'>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Not Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1">
            {notIncluded.map((item) => (
              <div key={item} className="flex items-start gap-2.5 bg-red-50 rounded-lg px-4 py-1">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      {pkg.mapUrl && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Map</h2>
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <iframe
              src={pkg.mapUrl}
              width="100%"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
              title={`Map for ${pkg.title}`}
            />
          </div>
        </div>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <FaqAccordion items={faq} />
        </div>
      )}

      {/* Good to Know */}
      {moreInfo.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Good to Know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moreInfo.map((info, i) => (
              <div key={i} className="bg-[#F3F6FB] rounded-xl px-5 py-4">
                <h3 className="text-sm font-bold text-[#0F4C81] mb-2">{info.title}</h3>
                <ul className="space-y-1">
                  {info.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#1E88E5] mt-1 shrink-0">•</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
