'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { verifyPayment } from '@/lib/api';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type State = 'verifying' | 'success' | 'error';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const [state, setState] = useState<State>('verifying');
  const [error, setError] = useState('');
  const [primaryBookingId, setPrimaryBookingId] = useState('');

  useEffect(() => {
    const pidx = searchParams.get('pidx');
    const status = searchParams.get('status');
    const rawIds = searchParams.get('bookingIds');
    const bookingIds = rawIds ? rawIds.split(',').filter(Boolean) : [];

    if (!pidx || !bookingIds.length) {
      setState('error');
      setError('Invalid payment callback — missing required parameters.');
      return;
    }

    if (status && status !== 'Completed') {
      setState('error');
      setError(`Payment was not completed (status: ${status}). Your booking has been reserved but not confirmed.`);
      return;
    }

    if (!token) {
      setState('error');
      setError('Session expired. Please log in and check your bookings.');
      return;
    }

    verifyPayment(token, pidx, bookingIds)
      .then((res) => {
        setPrimaryBookingId(res.data.primaryBookingId);
        setState('success');
        setTimeout(() => {
          router.push(`/booking/${res.data.primaryBookingId}?all=${res.data.allBookingIds.join(',')}`);
        }, 2500);
      })
      .catch((e: Error) => {
        setState('error');
        setError(e.message ?? 'Payment verification failed. Please contact support.');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {state === 'verifying' && (
          <>
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment with Khalti…</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 text-sm mb-6">Your booking has been confirmed. Redirecting to your booking details…</p>
            {primaryBookingId && (
              <Link
                href={`/booking/${primaryBookingId}`}
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 text-sm transition-colors"
              >
                View Booking
              </Link>
            )}
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h1>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/profile/bookings"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
              >
                My Bookings
              </Link>
              <Link
                href="/trekking"
                className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 text-sm transition-colors"
              >
                Browse Packages
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
