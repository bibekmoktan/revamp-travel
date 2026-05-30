'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, Check, ArrowRight } from 'lucide-react';
import type { ApiPackage } from '@/types/api';
import { useLenis } from '@/app/components/LenisProvider';

interface AddOnsModalProps {
  open: boolean;
  addOns: ApiPackage[];
  onSkip: () => void;
  onConfirm: (selected: ApiPackage[]) => void;
}

export default function AddOnsModal({ open, addOns, onSkip, onConfirm }: AddOnsModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { stop, start } = useLenis();

  useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  useEffect(() => {
    if (open) {
      stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [open, stop, start]);

  if (!open) return null;

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedPackages = addOns.filter(p => selected.has(p._id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Enhance Your Trip</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add more packages to make the most of your journey</p>
          </div>
          <button
            onClick={onSkip}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors mt-0.5 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Package list */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-5 py-3 space-y-2.5" data-lenis-prevent>
          {addOns.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No add-on packages available.</p>
          ) : (
            addOns.map(pkg => {
              const isSelected = selected.has(pkg._id);
              return (
                <button
                  key={pkg._id}
                  onClick={() => toggle(pkg._id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {/* Image */}
                  {pkg.featureImage?.url && (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={pkg.featureImage.url}
                        alt={pkg.featureImage.alt ?? pkg.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{pkg.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      {pkg.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />{pkg.duration}
                        </span>
                      )}
                      <span className="font-semibold text-sky-700">
                        US${pkg.price.toLocaleString()} <span className="font-normal text-gray-400">/person</span>
                      </span>
                    </div>
                  </div>

                  {/* Check indicator */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-sky-600 border-sky-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => onConfirm(selectedPackages)}
            disabled={selected.size === 0}
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${
              selected.size > 0
                ? 'bg-gray-900 hover:bg-black text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selected.size > 0 ? (
              <>
                Add {selected.size} Package{selected.size > 1 ? 's' : ''} & Continue
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Select packages to add'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
