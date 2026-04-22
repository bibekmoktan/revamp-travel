'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

export default function TrekGallery({ gallery, title }: { gallery: ApiPackage['gallery']; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative aspect-video rounded-xl overflow-hidden group"
          >
            <Image
              src={img.url}
              alt={img.alt ?? `${title} photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gallery[lightbox].url}
              alt={gallery[lightbox].alt ?? title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
