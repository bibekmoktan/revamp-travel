'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPackages, adminDeletePackage, adminTogglePackageStatus } from '@/lib/api';
import type { ApiPackage } from '@/types/api';

export default function AdminPackagesPage() {
  const { token } = useAuth();
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPackages({ page, limit: 10, searchTerm: search || undefined, status: undefined });
      setPackages(res.data);
      setTotal(res.meta.total);
    } catch {}
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (pkg: ApiPackage) => {
    if (!token) return;
    if (!confirm(`Delete "${pkg.title}"? This cannot be undone.`)) return;
    setActionId(pkg._id);
    try {
      await adminDeletePackage(token, pkg._id);
      setPackages((prev) => prev.filter((p) => p._id !== pkg._id));
      setTotal((t) => t - 1);
    } catch (e: any) {
      alert(e.message ?? 'Delete failed');
    }
    setActionId(null);
  };

  const handleToggle = async (pkg: ApiPackage) => {
    if (!token) return;
    const next = pkg.status === 'active' ? 'inactive' : 'active';
    setActionId(pkg._id);
    try {
      await adminTogglePackageStatus(token, pkg._id, next);
      setPackages((prev) => prev.map((p) => p._id === pkg._id ? { ...p, status: next } : p));
    } catch (e: any) {
      alert(e.message ?? 'Status update failed');
    }
    setActionId(null);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Package
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Package</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {pkg.featureImage?.url && (
                              <Image
                                src={pkg.featureImage.url}
                                alt={pkg.title}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{pkg.title}</p>
                            <p className="text-xs text-gray-400">{pkg.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="capitalize text-gray-600">{pkg.category}</span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        ${pkg.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{pkg.duration}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggle(pkg)}
                          disabled={actionId === pkg._id}
                          className="flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {pkg.status === 'active'
                            ? <ToggleRight className="w-5 h-5 text-green-500" />
                            : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                          <span className={`text-xs font-medium capitalize ${pkg.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                            {pkg.status}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/packages/${pkg._id}`}
                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(pkg)}
                            disabled={actionId === pkg._id}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
