'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminGetBookings, adminConfirmBooking, adminCancelBooking } from '@/lib/api';

interface Booking {
  _id: string;
  user?: { name?: string; email?: string };
  package?: { title?: string; location?: string; duration?: string };
  trekDate?: string;
  numberOfPeople?: number;
  totalAmount?: number;
  bookingStatus: 'reserved' | 'confirmed' | 'cancelled';
  paymentStatus?: string;
  createdAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  reserved:  'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '10' };
      if (statusFilter) params.status = statusFilter;
      const res = await adminGetBookings(token, params);
      setBookings(res.data as Booking[]);
      setTotal((res.meta as any)?.total ?? 0);
    } catch {}
    setLoading(false);
  }, [token, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, action: 'confirm' | 'cancel') => {
    if (!token) return;
    setActionId(id);
    try {
      if (action === 'confirm') await adminConfirmBooking(token, id);
      else await adminCancelBooking(token, id);
      await load();
    } catch (e: any) {
      alert(e.message ?? 'Action failed');
    }
    setActionId(null);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total bookings</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="reserved">Reserved</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Traveler</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Package</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Departure</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Pax</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : bookings.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">No bookings found</td>
                    </tr>
                  )
                : bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{b.user?.name ?? '—'}</p>
                        <p className="text-xs text-gray-400">{b.user?.email ?? ''}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 max-w-[180px]">
                        <p className="line-clamp-1">{b.package?.title ?? '—'}</p>
                        {b.package?.location && (
                          <p className="text-xs text-gray-400">{b.package.location}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {b.trekDate ? new Date(b.trekDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{b.numberOfPeople ?? '—'}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {b.totalAmount != null ? `$${b.totalAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[b.bookingStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {b.bookingStatus === 'reserved' && (
                            <>
                              <button
                                onClick={() => handleAction(b._id, 'confirm')}
                                disabled={actionId === b._id}
                                className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleAction(b._id, 'cancel')}
                                disabled={actionId === b._id}
                                className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-md hover:bg-red-100 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
