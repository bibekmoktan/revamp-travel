'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyBookings, cancelMyBooking } from '@/lib/api';
import type { BookingSummary } from '@/types/api';
import Link from 'next/link';
import { CalendarDays, Users, MapPin, Clock, XCircle, Eye, PackageOpen } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  reserved:  'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getMyBookings(token)
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!user || !token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-700 font-semibold mb-2">Please log in to view your bookings</p>
        <Link href="/login?redirect=/profile" className="bg-sky-600 text-white px-5 py-2 text-sm font-semibold mt-2 hover:bg-sky-700 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  async function handleCancel(bookingId: string) {
    if (!token) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelMyBooking(token, bookingId);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  }

  return (
    <section className="py-12 px-6 md:px-16 min-h-[70vh]">
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-0.5">{user.name} · {user.email}</p>
          </div>
          <Link href="/trekking" className="bg-sky-600 hover:bg-sky-700 text-white text-sm px-4 py-2 font-semibold transition-colors">
            Book a Trek
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageOpen className="w-14 h-14 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No bookings yet</h2>
            <p className="text-gray-500 text-sm mb-5">Start planning your next Himalayan adventure.</p>
            <Link href="/trekking" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const pkg = booking.package;
              const canCancel = booking.bookingStatus === 'reserved' || booking.bookingStatus === 'confirmed';

              return (
                <div key={booking._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex flex-col sm:flex-row">

                    {/* Left info */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{pkg.title}</h3>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize shrink-0 ${STATUS_STYLES[booking.bookingStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
                          {new Date(booking.trekDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-400" />
                          {booking.numberOfPeople} pax
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          {pkg.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-400">Total · </span>
                          <span className="font-bold text-gray-900 text-sm">US${booking.totalAmount.toLocaleString()}</span>
                          <span className={`ml-3 text-[11px] capitalize font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : booking.paymentStatus === 'failed' ? 'text-red-500' : 'text-amber-600'}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono">{booking._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 px-4 py-4 sm:py-5 sm:border-l border-t sm:border-t-0 border-gray-100 bg-gray-50 justify-end sm:justify-start">
                      <Link
                        href={`/booking/${booking._id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {cancelling === booking._id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
