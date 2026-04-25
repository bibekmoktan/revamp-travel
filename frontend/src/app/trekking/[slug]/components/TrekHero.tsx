'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Share2, Check } from 'lucide-react';
import HeroImg from '../../../../../public/images/treks/bg-1.jpg';
import type { ApiPackage } from '@/types/api';

const difficultyColor: Record<string, string> = {
  easy:        'bg-green-500',
  moderate:    'bg-yellow-500',
  challenging: 'bg-orange-500',
  extreme:     'bg-red-500',
};

export default function TrekHero({ pkg }: { pkg: ApiPackage }) {
  const diffClass = difficultyColor[pkg.difficulty ?? ''] ?? 'bg-gray-500';
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="w-full min-h-[700px] flex flex-col justify-between"
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.85) 100%), url(${HeroImg.src}) center/cover no-repeat`,
      }}
    >
      {/* Breadcrumb */}
      <div className="max-w-[1366px] mx-auto px-6 pt-6 w-full pt-[200px]">
        <div className="flex items-center gap-2 text-[18px] text-white">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/trekking" className="hover:text-white transition-colors">Trekking</Link>
          <span>&gt;</span>
          <span className="text-white truncate max-w-[200px]">{pkg.title}</span>
        </div>
      </div>

      {/* Bottom content */}
      <div className="px-6 pb-10 max-w-[1366px] mx-auto w-full">
        <p className="text-sm text-white/90 uppercase tracking-widest mb-2">{pkg.location}</p>
        <h1 className="text-[24px] md:text-[42px] font-bold text-white mb-4 leading-tight drop-shadow-lg">
          {pkg.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
            <span className="text-yellow-400">{'★'.repeat(Math.floor(pkg.rating))}</span>
            <span className="ml-1">{pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>

        {/* Best Season pills + action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          {pkg.bestSeason.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/90 text-xs uppercase tracking-wide mr-1">Best Season:</span>
              {pkg.bestSeason.map((month) => (
                <span
                  key={month}
                  className="bg-white text-sky-800 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {month}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWished(w => !w)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white transition-colors duration-200 group"
            >
              <Heart className={`w-4 h-4 transition-colors duration-200 ${wished ? 'fill-sky-800 text-sky-800' : 'text-gray-800 group-hover:text-sky-800'}`} />
              <span className={`transition-colors duration-200 ${wished ? 'text-sky-800' : 'text-gray-800 group-hover:text-sky-800'}`}>
                {wished ? 'Wishlisted' : 'Wishlist'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-800 hover:text-sky-800 transition-colors duration-200 group"
            >
              {copied ? <Check className="w-4 h-4 group-hover:text-sky-800" /> : <Share2 className="w-4 h-4 group-hover:text-sky-800" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
