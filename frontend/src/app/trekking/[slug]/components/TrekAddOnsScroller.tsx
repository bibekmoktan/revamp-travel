'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrekAddOnsScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const slide = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Left button */}
      <button
        onClick={() => slide('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center text-gray-600 hover:text-sky-600 hover:border-sky-300 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable strip */}
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 px-1">
        {children}
      </div>

      {/* Right button */}
      <button
        onClick={() => slide('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center text-gray-600 hover:text-sky-600 hover:border-sky-300 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
