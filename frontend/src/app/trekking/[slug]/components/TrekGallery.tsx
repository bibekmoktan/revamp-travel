'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

export default function TrekGallery({ gallery, title }: { gallery: ApiPackage['gallery']; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const shown = gallery.slice(0, 5);
  const extra = gallery.length - 5;

  const prev = () => setLightbox(i => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  const next = () => setLightbox(i => (i === null ? null : (i + 1) % gallery.length));

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>

      {/* Collage grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] rounded-2xl overflow-hidden gap-2 bg-green-100">

        {/* Hero — col 1–2, row 1–2 */}
        {shown[0] && (
          <button
            onClick={() => setLightbox(0)}
            className="col-span-2 row-span-2 relative group overflow-hidden"
          >
            <Image
              src={shown[0].url}
              alt={shown[0].alt ?? `${title} photo 1`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
          </button>
        )}

        {/* Small tiles — cols 3–4, 2×2 */}
        {shown.slice(1).map((img, i) => {
          const idx = i + 1;
          const isLast = i === 3;
          return (
            <button
              key={idx}
              onClick={() => setLightbox(idx)}
              className="relative group overflow-hidden"
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${title} photo ${idx + 1}`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              {isLast && extra > 0 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl font-bold">+{extra}</span>
                  <span className="text-sm mt-1">more</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* View all button */}
      {gallery.length > 1 && (
        <button
          onClick={() => setLightbox(0)}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-[#1E88E5] hover:text-[#1565C0] transition-colors"
        >
          <Images className="w-4 h-4" />
          View all {gallery.length} photos
        </button>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {gallery.length}
          </div>

          {/* Prev */}
          {gallery.length > 1 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightbox].url}
              alt={gallery[lightbox].alt ?? title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Next */}
          {gallery.length > 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
