'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

export default function TrekGallery({ gallery, title }: { gallery: ApiPackage['gallery']; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  if (!gallery || gallery.length === 0) return null;

  const shown = gallery.slice(0, 5);
  const extra = gallery.length - 5;

  const prev = () => setLightbox(i => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  const next = () => setLightbox(i => (i === null ? null : (i + 1) % gallery.length));

  // Manual nav just updates state; auto-play interval keeps running uninterrupted
  const slidePrev = () => setSlideIndex(i => (i - 1 + gallery.length) % gallery.length);
  const slideNext = () => setSlideIndex(i => (i + 1) % gallery.length);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>

      {/* View all — above mobile slider */}
      {gallery.length > 1 && (
        <button
          onClick={() => setLightbox(0)}
          className="md:hidden mb-2 flex items-center gap-2 text-sm font-medium text-[#1E88E5] hover:text-[#1565C0] transition-colors"
        >
          <Images className="w-4 h-4" />
          View all {gallery.length} photos
        </button>
      )}

      {/* Mobile Slider */}
      <div className="block md:hidden relative group rounded-2xl overflow-hidden h-[240px]">
        {/* Slides strip */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {gallery.map((img, i) => (
            <div
              key={i}
              className="relative h-full w-full flex-shrink-0 cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${title} photo ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Counter badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10 pointer-events-none">
          {slideIndex + 1} / {gallery.length}
        </div>

        {/* Prev / Next — appear on hover */}
        {gallery.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => { e.stopPropagation(); slidePrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => { e.stopPropagation(); slideNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots — appear on hover */}
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                aria-label={`Go to photo ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === slideIndex
                    ? 'w-4 h-2 bg-white'
                    : 'w-2 h-2 bg-white/55 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Collage grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[300px] rounded-2xl overflow-hidden">

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
              sizes="50vw"
              className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
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
                className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
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
          className="mt-3 hidden md:flex items-center gap-2 text-sm font-medium text-[#1E88E5] hover:text-[#1565C0] transition-colors"
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
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {gallery.length}
          </div>

          {gallery.length > 1 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

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
