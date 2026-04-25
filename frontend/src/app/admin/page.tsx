'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package2, CalendarCheck, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminGetBookings, adminGetUsers, adminGetReviews, getPackages } from '@/lib/api';

interface Stats {
  packages: number;
  bookings: number;
  users: number;
  reviews: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({ packages: 0, bookings: 0, users: 0, reviews: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getPackages({ limit: 1 }),
      adminGetBookings(token, { limit: '5', sortBy: 'createdAt', sortOrder: 'desc' }),
      adminGetUsers(token, { limit: '1' }),
      adminGetReviews(token, { limit: '1' }),
    ])
      .then(([pkgs, bookings, users, reviews]) => {
        setStats({
          packages: (pkgs.meta as any)?.total ?? 0,
          bookings: (bookings.meta as any)?.total ?? 0,
          users:    (users.meta as any)?.total ?? 0,
          reviews:  (reviews.meta as any)?.total ?? 0,
        });
        setRecentBookings((bookings.data as any[]).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const cards = [
    { label: 'Total Packages', value: stats.packages, icon: Package2,     color: 'bg-blue-50 text-blue-600',   href: '/admin/packages' },
    { label: 'Total Bookings', value: stats.bookings, icon: CalendarCheck, color: 'bg-green-50 text-green-600', href: '/admin/bookings' },
    { label: 'Total Users',    value: stats.users,    icon: Users,         color: 'bg-purple-50 text-purple-600', href: '/admin/users' },
    { label: 'Total Reviews',  value: stats.reviews,  icon: Star,          color: 'bg-orange-50 text-orange-600', href: '/admin/reviews' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your travel platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <span className="inline-block w-10 h-7 bg-gray-100 rounded animate-pulse" /> : value}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <Link href="/admin/bookings" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No bookings yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.map((b: any) => (
              <div key={b._id} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {b.travelerInfo?.fullName ?? b.user?.name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.package?.title ?? b.packageId ?? '—'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ${b.totalAmount?.toLocaleString() ?? '—'}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-4 bg-blue-600 text-white rounded-xl px-6 py-4 hover:bg-blue-700 transition-colors"
        >
          <Package2 className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-semibold">Add New Package</p>
            <p className="text-xs text-blue-200 mt-0.5">Create a new trekking or tour package</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto shrink-0" />
        </Link>
        <Link
          href="/admin/bookings"
          className="flex items-center gap-4 bg-white border border-gray-200 text-gray-800 rounded-xl px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <CalendarCheck className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold">Manage Bookings</p>
            <p className="text-xs text-gray-400 mt-0.5">Confirm or cancel pending bookings</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto shrink-0 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
