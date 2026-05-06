'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

interface Props {
  title: string;
  slug: string;
  className?: string;
}

export default function ShareButton({ title, slug, className = '' }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/trekking/${slug}`;

    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setToast('Link copied!');
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className={className}>
      <div className="relative">
        <button
          onClick={handleClick}
          aria-label="Share"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:bg-white/100 transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-400 hover:text-sky-800 transition-colors" />
        </button>

        {toast && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-50 pointer-events-none">
            {toast}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
}
