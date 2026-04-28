'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBookingById } from '@/lib/api';
import type { BookingSummary } from '@/types/api';
import Link from 'next/link';
import { CheckCircle, CalendarDays, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  reserved:  'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !id) return;
    getBookingById(token, id)
      .then(res => setBooking(res.data))
      .catch(e => setError(e.message ?? 'Failed to load booking'))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
        <p className="text-gray-700 font-semibold">{error || 'Booking not found'}</p>
        <Link href="/profile" className="text-sky-600 underline text-sm mt-3">View my bookings</Link>
      </div>
    );
  }

  const pkg = booking.package;

  return (
    <section className="py-14 px-6 md:px-16 min-h-[70vh]">
      <div className="max-w-[680px] mx-auto mt-10 md:mt-[150px]">

        {/* Success banner */}
        <div className="text-center mb-10">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">
            Your booking is reserved. Our team will confirm it within 24 hours.
          </p>
        </div>

        {/* Booking card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-sky-600 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sky-200 text-xs font-medium uppercase tracking-wider">Booking ID</p>
              <p className="text-white font-mono font-bold text-sm mt-0.5">{booking._id}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[booking.bookingStatus] ?? 'bg-gray-100 text-gray-700'}`}>
              {booking.bookingStatus}
            </span>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-4">
            <h2 className="font-bold text-gray-900 text-base leading-snug">{pkg.title}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Departure</p>
                  <p className="font-medium">{new Date(booking.trekDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Travelers</p>
                  <p className="font-medium">{booking.numberOfPeople} person{booking.numberOfPeople > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="font-medium">{pkg.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                  <p className="font-medium">{pkg.duration}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">US${booking.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Payment status: <span className="capitalize font-medium text-gray-600">{booking.paymentStatus}</span></span>
              <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/profile"
            className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            href="/trekking"
            className="flex-1 text-center border border-gray-300 hover:border-sky-400 text-gray-700 font-bold py-3 text-sm uppercase tracking-wide transition-colors"
          >
            Browse More Packages
          </Link>
        </div>

      </div>
    </section>
  );
}
