'use client';

import { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import CustomizeItineraryModal from './CustomizeItineraryModal';

interface Props {
  pdfUrl: string;
  packageTitle: string;
  defaultDuration: number;
}

export default function ItineraryActions({ pdfUrl, packageTitle, defaultDuration }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-sky-600 text-sky-700 hover:bg-sky-50 font-semibold text-sm rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Full Itinerary
        </a>
        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Customize Your Trip
        </button>
      </div>

      <CustomizeItineraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageTitle={packageTitle}
        defaultDuration={defaultDuration}
      />
    </>
  );
}
