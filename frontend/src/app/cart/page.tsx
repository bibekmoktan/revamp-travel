'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CalendarDays, Users, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const router = useRouter();

  const grandTotal = items.reduce((sum, i) => sum + i.totalAmount, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add a trek or tour to get started.</p>
        <Link href="/trekking" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
          Browse Packages
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 px-6 md:px-16 min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto mt-10 md:mt-[150px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Item list */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={`${item.packageId}-${item.date}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex gap-4 p-4">
                {/* Image */}
                <div className="relative w-28 h-24 shrink-0 rounded-lg overflow-hidden">
                  <Image src={item.image || '/images/placeholder.jpg'} alt={item.title} fill className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not set'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {item.travelers} traveler{item.travelers > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">US${item.pricePerPerson.toLocaleString()} × {item.travelers}</p>
                </div>

                {/* Price + remove */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeItem(item.packageId, item.date)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="font-bold text-gray-900 text-sm">US${item.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-600 underline mt-2">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={`${item.packageId}-${item.date}`} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate max-w-[160px]">{item.title}</span>
                    <span className="shrink-0 ml-2">US${item.totalAmount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>US${grandTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link href="/trekking" className="block text-center text-xs text-sky-600 hover:underline mt-3">
                Continue browsing
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
