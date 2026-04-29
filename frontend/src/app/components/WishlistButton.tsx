'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import type { ApiPackage } from '@/types/api';

interface Props {
  pkg: Pick<ApiPackage, '_id'>;
  className?: string;
}

export default function WishlistButton({ pkg, className = '' }: Props) {
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const saved = isWishlisted(pkg._id);
  const [toast, setToast] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/login'); return; }
    const willSave = !saved;
    await toggle(pkg);
    setToast(willSave ? 'Added to wishlist' : 'Removed from wishlist');
    setTimeout(() => setToast(null), 2000);
  }

  return (
    /* outer div: receives the positioning class (e.g. absolute top-3 right-3 z-10) */
    <div className={className}>
      {/* inner div: provides stacking context for the tooltip */}
      <div className="relative">
        <button
          onClick={handleClick}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:bg-white/100 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${saved ? 'fill-sky-800 text-sky-800' : 'text-gray-400 hover:text-sky-800'}`}
          />
        </button>

        {toast && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-50 animate-fade-in pointer-events-none">
            {toast}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
}
