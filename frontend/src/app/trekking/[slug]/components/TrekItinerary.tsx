'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Clock, MapPinned, Info } from 'lucide-react';
import type { ApiPackage } from '@/types/api';
import ItineraryActions from './ItineraryActions';

type Itinerary = ApiPackage['itinerary'][number];

function DayCard({ day, isOpen, onToggle }: { day: Itinerary; isOpen: boolean; onToggle: () => void }) {
  const hasMeta = day.trekTime || day.distance;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="shrink-0 w-10 h-10 rounded-full bg-sky-600 text-white text-sm font-bold flex items-center justify-center">
          {day.day}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block font-semibold text-gray-800 text-sm">{day.title}</span>
          {hasMeta && (
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              {day.trekTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {day.trekTime}
                </span>
              )}
              {day.distance && (
                <span className="flex items-center gap-1">
                  <MapPinned className="w-3.5 h-3.5" /> {day.distance}
                </span>
              )}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100 space-y-3">
          <p className="text-gray-600 text-sm">{day.description}</p>
          {day.note && (
            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Good to know: </span>
                {day.note}
              </p>
            </div>
          )}
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

export default function TrekItinerary({
  itinerary,
  slug,
  packageTitle,
}: {
  itinerary: ApiPackage['itinerary'];
  slug: string;
  packageTitle: string;
}) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  if (!itinerary || itinerary.length === 0) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'https://revamp-travel.onrender.com/api/v1';
  const pdfUrl  = `${apiBase}/packages/${slug}/itinerary-pdf`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
        <span className="text-sm text-gray-400">{itinerary.length} days</span>
      </div>

      <ItineraryActions
        pdfUrl={pdfUrl}
        packageTitle={packageTitle}
        defaultDuration={itinerary.length}
      />

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
