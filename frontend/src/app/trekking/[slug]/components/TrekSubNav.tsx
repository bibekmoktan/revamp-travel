'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Gallery',            id: 'section-gallery' },
  { label: 'Highlights',         id: 'section-highlights' },
  { label: 'Overview',           id: 'section-overview' },
  { label: 'Itinerary',          id: 'section-itinerary' },
  { label: 'Included',           id: 'section-included' },
  { label: 'Excluded',           id: 'section-excluded' },
  { label: 'Know Before You Go', id: 'section-know-before-you-go' },
  { label: 'Reviews',            id: 'section-reviews' },
];

export default function TrekSubNav() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState('section-gallery');

  // Hide main navbar when this sub-nav becomes sticky, restore on scroll back
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent(entry.isIntersecting ? 'trek-subnav-unstuck' : 'trek-subnav-stuck')
        );
      },
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => {
      obs.disconnect();
      window.dispatchEvent(new CustomEvent('trek-subnav-unstuck'));
    };
  }, []);

  // Track active section while scrolling
  useEffect(() => {
    const els = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sentinel: exits viewport when sub-nav reaches top → hide main navbar */}
      <div ref={sentinelRef} className="h-px" />

      <div className="sticky top-0 z-30 bg-white -mx-6 px-6 border-b border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150
                ${activeId === id
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-sky-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
