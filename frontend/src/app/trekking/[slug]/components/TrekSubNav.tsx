'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const navRef    = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState('section-gallery');

  // Hide main navbar only when this bar is actually stuck at top-0
  useEffect(() => {
    function onScroll() {
      if (!navRef.current) return;
      const stuck = navRef.current.getBoundingClientRect().top <= 0;
      window.dispatchEvent(new CustomEvent(stuck ? 'trek-subnav-stuck' : 'trek-subnav-unstuck'));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
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

  const slideNav = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
  };

  return (
    <div ref={navRef} className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">

      {/* Mobile: arrow buttons + scrollable strip */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => slideNav('left')}
          className="shrink-0 px-2 py-4 text-gray-400 hover:text-sky-600 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div ref={scrollRef} className="flex-1 flex overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`shrink-0 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150
                ${activeId === id
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-sky-600'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => slideNav('right')}
          className="shrink-0 px-2 py-4 text-gray-400 hover:text-sky-600 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop: plain scrollable strip */}
      <div className="hidden md:flex overflow-x-auto items-center scrollbar-hide px-6 max-w-[1366px] mx-auto">
        {NAV_ITEMS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`shrink-0 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150
              ${activeId === id
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-sky-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

    </div>
  );
}
