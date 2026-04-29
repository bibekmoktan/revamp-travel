'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Minus, Plus, ShoppingCart, CheckCircle, Send, AlertCircle } from 'lucide-react';
import type { ApiPackage } from '@/types/api';
import { useCart } from '@/context/CartContext';
import EnquiryModal from '@/app/components/EnquiryModal';
import WishlistButton from '@/app/components/WishlistButton';

const GROUP_TIERS = [
  { label: '1 pax',      min: 1, max: 1,  discount: 0.10 },
  { label: '2 – 5 pax',  min: 2, max: 5,  discount: 0.15 },
  { label: '6 – 8 pax',  min: 6, max: 8,  discount: 0.22 },
  { label: '9 – 10 pax', min: 9, max: 10, discount: 0.28 },
];

function tierPrice(base: number, discount: number) {
  return Math.round(base * (1 - discount));
}

function activeTier(travelers: number) {
  return GROUP_TIERS.find(t => travelers >= t.min && travelers <= t.max) ?? GROUP_TIERS[0];
}

export default function TrekBookingCard({ pkg }: { pkg: ApiPackage }) {
  const [groupOpen, setGroupOpen]     = useState(true);
  const [date, setDate]               = useState('');
  const [dateError, setDateError]     = useState('');
  const [travelers, setTravelers]     = useState(1);
  const [added, setAdded]             = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { addItem }                   = useCart();
  const router                        = useRouter();

  const today = new Date().toISOString().split('T')[0];

  function validateDate(): boolean {
    if (!date) {
      setDateError('Departure date is required.');
      return false;
    }
    setDateError('');
    return true;
  }

  const base      = pkg.price;
  const original  = Math.round(base * 1.15);
  const tier      = activeTier(travelers);
  const unitPrice = tierPrice(base, tier.discount);
  const total     = unitPrice * travelers;

  function buildCartItem() {
    return {
      cartId:         crypto.randomUUID(),
      packageId:      pkg._id,
      slug:           pkg.slug,
      title:          pkg.title,
      image:          pkg.featureImage?.url ?? '',
      duration:       pkg.duration,
      location:       pkg.location,
      date,
      travelers,
      pricePerPerson: unitPrice,
      totalAmount:    total,
    };
  }

  function handleAddToCart() {
    if (!validateDate()) return;
    addItem(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBookNow() {
    if (!validateDate()) return;
    addItem(buildCartItem());
    router.push('/cart');
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden text-sm">

      {/* Price header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs mb-1">Price from:</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-gray-900">US${unitPrice.toLocaleString()}</span>
            <span className="text-gray-400 line-through text-sm">US${original.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">P/P</span>
          </div>
        </div>
        <WishlistButton pkg={pkg} />
      </div>

      <div className="border-t border-gray-100" />

      {/* Group pricing */}
      <div className="px-5">
        <button
          onClick={() => setGroupOpen(o => !o)}
          className="w-full flex items-center justify-between py-3 text-gray-800 font-semibold"
        >
          <span>We offer group price</span>
          {groupOpen
            ? <Minus className="w-4 h-4 text-sky-800" />
            : <ChevronDown className="w-4 h-4 text-sky-800" />}
        </button>

        {groupOpen && (
          <div className="pb-3 space-y-0">
            {GROUP_TIERS.map((t, i) => (
              <div
                key={t.label}
                className={`flex justify-between py-2 text-gray-700 ${i < GROUP_TIERS.length - 1 ? 'border-b border-gray-100' : ''} ${tier === t ? 'font-semibold text-sky-800' : ''}`}
              >
                <span>{t.label}</span>
                <span>US${tierPrice(base, t.discount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Departure date */}
      <div className="px-5 py-4">
        <p className="font-semibold text-gray-800 mb-2">Departure Date <span className="text-red-500">*</span></p>
        <div className={`flex items-center border px-3 py-2 ${dateError ? 'border-red-400' : 'border-sky-800'}`}>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => { setDate(e.target.value); setDateError(''); }}
            className="flex-1 text-gray-700 focus:outline-none bg-transparent text-sm"
          />
        </div>
        {dateError && (
          <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{dateError}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Travelers */}
      <div className="px-5 py-4">
        <p className="font-semibold text-gray-800 mb-2">No. of Traveler</p>
        <div className="flex items-center border border-gray-200 overflow-hidden">
          <button
            onClick={() => setTravelers(n => Math.max(1, n - 1))}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="flex-1 text-center font-medium text-gray-800">{travelers}</span>
          <button
            onClick={() => setTravelers(n => Math.min(10, n + 1))}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Total */}
      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-gray-600">Total Price</span>
        <span className="text-lg font-bold text-gray-900">US${total.toLocaleString()}</span>
      </div>

      <div className="border-t border-gray-100" />

      {/* Buttons */}
      <div className="px-5 py-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleBookNow}
            className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 text-xs tracking-wide uppercase transition-colors"
          >
            Book Now
          </button>
          <button
            onClick={handleAddToCart}
            className={`font-bold py-2.5 text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 ${added ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-black text-white'}`}
          >
            {added ? <><CheckCircle className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>}
          </button>
        </div>

        <button
          onClick={() => setEnquiryOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold py-2.5 text-xs tracking-wide uppercase transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Send Inquiry
        </button>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        packageId={pkg._id}
        packageTitle={pkg.title}
      />
    </div>
  );
}
