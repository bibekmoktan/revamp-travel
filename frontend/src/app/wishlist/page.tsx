'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getWishlist } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Clock, Mountain, Trash2, ShoppingCart } from 'lucide-react';
import type { ApiPackage } from '@/types/api';

interface WishlistItem {
  _id: string;
  package: ApiPackage;
}

export default function WishlistPage() {
  const { user, token } = useAuth();
  const { toggle } = useWishlist();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [movedIds, setMovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getWishlist(token)
      .then(res => setItems(res.data as WishlistItem[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function handleRemove(pkg: ApiPackage) {
    await toggle(pkg);
    setItems(prev => prev.filter(i => i.package._id !== pkg._id));
  }

  async function handleMoveToCart(pkg: ApiPackage) {
    addItem({
      cartId:         crypto.randomUUID(),
      packageId:      pkg._id,
      slug:           pkg.slug,
      title:          pkg.title,
      image:          pkg.featureImage?.url ?? '',
      duration:       pkg.duration ?? '',
      location:       pkg.location ?? '',
      date:           '',
      travelers:      1,
      pricePerPerson: pkg.price,
      totalAmount:    pkg.price,
    });
    await toggle(pkg);
    setMovedIds(prev => new Set(prev).add(pkg._id));
    setItems(prev => prev.filter(i => i.package._id !== pkg._id));
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <Heart className="w-14 h-14 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Save your favourite treks</h2>
        <p className="text-gray-500 text-sm mb-6">Log in to view and manage your wishlist.</p>
        <Link href="/login" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 px-6 md:px-16 min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto mt-10 md:mt-[150px]">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 fill-sky-800 text-sky-800" />
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          {!loading && <span className="text-sm text-gray-400">({items.length} saved)</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-6">You haven't saved any packages yet.</p>
            <Link href="/trekking" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ _id, package: pkg }) => (
              <div key={_id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Link href={`/trekking/${pkg.slug}`}>
                    <Image
                      src={pkg.featureImage?.url ?? '/images/placeholder.jpg'}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(pkg)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/trekking/${pkg.slug}`}>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 hover:text-sky-700 transition-colors">
                      {pkg.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration}</span>
                    {pkg.altitude && <span className="flex items-center gap-1"><Mountain className="w-3.5 h-3.5" />{pkg.altitude}</span>}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-[#0F4C81]">US${pkg.price?.toLocaleString()}</span>
                    <Link
                      href={`/trekking/${pkg.slug}`}
                      className="text-xs font-semibold text-sky-700 hover:underline transition-colors"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Move to Cart */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleMoveToCart(pkg)}
                      className="w-full flex items-center justify-center gap-2 bg-[#0F4C81] hover:bg-sky-800 text-white text-xs font-semibold py-2.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
