'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CalendarDays, Users, ShoppingBag, Pencil, Check, X, Minus, Plus, Heart } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

interface EditState {
  date: string;
  travelers: number;
}

export default function CartPage() {
  const { items, removeItem, updateItem, clearCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState<Record<string, EditState>>({});

  const grandTotal = items.reduce((sum, i) => sum + i.totalAmount, 0);

  function startEdit(cartId: string, date: string, travelers: number) {
    setEditing(prev => ({ ...prev, [cartId]: { date, travelers } }));
  }

  function cancelEdit(cartId: string) {
    setEditing(prev => {
      const next = { ...prev };
      delete next[cartId];
      return next;
    });
  }

  function saveEdit(cartId: string, pricePerPerson: number) {
    const state = editing[cartId];
    if (!state) return;
    updateItem(cartId, {
      date: state.date,
      travelers: state.travelers,
      totalAmount: pricePerPerson * state.travelers,
    });
    setEditing(prev => {
      const next = { ...prev };
      delete next[cartId];
      return next;
    });
  }

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
            {items.map((item) => {
              const cid = item.cartId;
              const editState = editing[cid];
              const isEditing = !!editState;

              return (
                <div key={cid} className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-28 h-24 shrink-0 rounded-lg overflow-hidden">
                      <Image src={item.image || '/images/placeholder.jpg'} alt={item.title} fill className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{item.title}</h3>

                      {!isEditing && (
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {item.date
                              ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Date not set'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {item.travelers} traveler{item.travelers > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        US${item.pricePerPerson.toLocaleString()} × {isEditing ? editState.travelers : item.travelers}
                      </p>
                    </div>

                    {/* Price + actions */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeItem(cid)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="font-bold text-gray-900 text-sm">
                        US${(item.pricePerPerson * (isEditing ? editState.travelers : item.travelers)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {isEditing ? (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          <CalendarDays className="w-3.5 h-3.5 inline mr-1" />Departure Date
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={editState.date}
                          onChange={e => setEditing(prev => ({ ...prev, [cid]: { ...prev[cid], date: e.target.value } }))}
                          className="w-full border border-gray-200 focus:border-sky-500 px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      {/* Travelers */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          <Users className="w-3.5 h-3.5 inline mr-1" />Travelers
                        </label>
                        <div className="flex items-center border border-gray-200 overflow-hidden w-full">
                          <button
                            onClick={() => setEditing(prev => ({ ...prev, [cid]: { ...prev[cid], travelers: Math.max(1, prev[cid].travelers - 1) } }))}
                            className="w-10 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="flex-1 text-center text-sm font-medium text-gray-800">{editState.travelers}</span>
                          <button
                            onClick={() => setEditing(prev => ({ ...prev, [cid]: { ...prev[cid], travelers: Math.min(10, prev[cid].travelers + 1) } }))}
                            className="w-10 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Save / Cancel */}
                      <div className="sm:col-span-2 flex gap-2 justify-end">
                        <button
                          onClick={() => cancelEdit(cid)}
                          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(cid, item.pricePerPerson)}
                          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 text-xs font-semibold transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (!user) { router.push('/login'); return; }
                          toggle({ _id: item.packageId });
                        }}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${isWishlisted(item.packageId) ? 'text-sky-800' : 'text-gray-400 hover:text-sky-800'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(item.packageId) ? 'fill-sky-800' : ''}`} />
                        {isWishlisted(item.packageId) ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                      <button
                        onClick={() => startEdit(cid, item.date, item.travelers)}
                        className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

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
                  <div key={item.cartId} className="flex justify-between text-sm text-gray-600">
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
