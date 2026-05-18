'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

type Itinerary = ApiPackage['itinerary'][number];

function DayCard({ day, isOpen, onToggle }: { day: Itinerary; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="shrink-0 w-10 h-10 rounded-full bg-sky-600 text-white text-sm font-bold flex items-center justify-center">
          {day.day}
        </span>
        <span className="flex-1 font-semibold text-gray-800 text-sm">{day.title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100 space-y-3">
          <p className="text-gray-600 text-sm">{day.description}</p>
          {day.images && day.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {day.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.alt ?? `Day ${day.day} photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrekItinerary({ itinerary }: { itinerary: ApiPackage['itinerary'] }) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
        <span className="text-sm text-gray-400">{itinerary.length} days</span>
      </div>

      <div className="space-y-2">
        {itinerary.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            isOpen={openDay === day.day}
            onToggle={() => setOpenDay(openDay === day.day ? null : day.day)}
          />
        ))}
      </div>
    </div>
  );
}
