'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/lib/api';
import type { TravelerInput } from '@/types/api';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

function emptyTraveler(): TravelerInput {
  return { fullName: '', age: 18, gender: 'male', idProof: '' };
}

export default function CheckoutPage() {
  const { items, hydrated, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const safeItems = items ?? [];

  const [activeItem, setActiveItem] = useState(0);
  const [travelersByItem, setTravelersByItem] = useState<TravelerInput[][]>([]);

  useEffect(() => {
    if (safeItems.length > 0 && travelersByItem.length === 0) {
      setTravelersByItem(safeItems.map(item => Array.from({ length: item.travelers }, emptyTraveler)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeItems.length]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const grandTotal = safeItems.reduce((s, i) => s + i.totalAmount, 0);

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-500 mb-4">No items to checkout.</p>
        <Link href="/trekking" className="text-sky-600 underline text-sm">Browse packages</Link>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-700 font-semibold mb-2">Please log in to continue</p>
        <Link href="/login?redirect=/checkout" className="bg-sky-600 text-white px-5 py-2 text-sm font-semibold mt-2 hover:bg-sky-700 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  function updateTraveler(itemIdx: number, travelerIdx: number, field: keyof TravelerInput, value: string | number) {
    setTravelersByItem(prev => {
      const next = prev.map(arr => [...arr]);
      next[itemIdx][travelerIdx] = { ...next[itemIdx][travelerIdx], [field]: value };
      return next;
    });
  }

  async function handleSubmit() {
    setError('');
    for (let i = 0; i < safeItems.length; i++) {
      for (let t = 0; t < (travelersByItem[i] ?? []).length; t++) {
        const tr = travelersByItem[i][t];
        if (!tr.fullName.trim() || !tr.idProof.trim()) {
          setError(`Please fill in all traveler details for "${safeItems[i].title}".`);
          setActiveItem(i);
          return;
        }
      }
      if (!safeItems[i].date) {
        setError(`No departure date set for "${safeItems[i].title}". Please go back to the cart.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const bookingIds: string[] = [];
      for (let i = 0; i < safeItems.length; i++) {
        const item = safeItems[i];
        const res = await createBooking(token!, {
          packageId: item.packageId,
          trekDate: new Date(item.date).toISOString(),
          travelers: travelersByItem[i],
        });
        bookingIds.push(res.data._id);
      }

      clearCart();
      router.push(`/booking/${bookingIds[0]}?all=${bookingIds.join(',')}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-12 px-6 md:px-16 min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto pt-24 md:pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Traveler forms */}
          <div className="flex-1 space-y-4">

            {/* Package tabs */}
            {safeItems.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {safeItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveItem(i)}
                    className={`text-xs px-3 py-1.5 font-semibold border transition-colors ${activeItem === i ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-400'}`}
                  >
                    {item.title.length > 30 ? item.title.slice(0, 30) + '…' : item.title}
                  </button>
                ))}
              </div>
            )}

            {/* Active item traveler forms */}
            {safeItems.map((item, i) => (
              <div key={i} className={i === activeItem ? 'block' : 'hidden'}>
                <div className="bg-sky-50 border border-sky-100 rounded-xl px-5 py-3 mb-4">
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.travelers} traveler{item.travelers > 1 ? 's' : ''} · {item.date ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} · US${item.totalAmount.toLocaleString()}
                  </p>
                </div>

                {(travelersByItem[i] ?? []).map((tr, t) => (
                  <div key={t} className="bg-white border border-gray-200 rounded-xl p-5 mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-4">Traveler {t + 1}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={tr.fullName}
                          onChange={e => updateTraveler(i, t, 'fullName', e.target.value)}
                          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                          placeholder="As per passport"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Age *</label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={tr.age}
                          onChange={e => updateTraveler(i, t, 'age', Number(e.target.value))}
                          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Gender *</label>
                        <select
                          value={tr.gender}
                          onChange={e => updateTraveler(i, t, 'gender', e.target.value)}
                          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500 bg-white"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Passport / ID No. *</label>
                        <input
                          type="text"
                          value={tr.idProof}
                          onChange={e => updateTraveler(i, t, 'idProof', e.target.value)}
                          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                          placeholder="Passport number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Booking Summary</h2>

              <div className="space-y-3 mb-4">
                {safeItems.map((item, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-gray-800 font-medium leading-snug">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.travelers} pax · US${item.totalAmount.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>US${grandTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
              >
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                By confirming, you agree to our booking terms and cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
