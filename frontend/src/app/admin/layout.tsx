'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package2,
  CalendarCheck,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  Mountain,
  Layers,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { label: 'Dashboard',   href: '/admin',              icon: LayoutDashboard },
  { label: 'Categories',  href: '/admin/categories',   icon: Layers },
  { label: 'Packages',    href: '/admin/packages',     icon: Package2 },
  { label: 'Bookings',    href: '/admin/bookings',     icon: CalendarCheck },
  { label: 'Enquiries',   href: '/admin/enquiries',    icon: Mail },
  { label: 'Users',       href: '/admin/users',        icon: Users },
  { label: 'Reviews',     href: '/admin/reviews',      icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Client-side guard — redirect if not logged in or not admin
  if (!isLoading && (!user || user.role !== 'admin')) {
    router.replace('/login?redirect=' + encodeURIComponent(pathname));
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const Sidebar = (
    <aside className="flex flex-col h-full bg-[#0F172A] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Travel Nepal</p>
          <p className="text-[10px] text-blue-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'Admin'}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:z-50">
        {Sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex flex-col">{Sidebar}</div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 lg:px-8 py-3 flex items-center justify-between">
          <button
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-gray-700">
              {NAV.find((n) => isActive(n.href))?.label ?? 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
