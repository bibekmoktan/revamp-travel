'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminCreatePackage } from '@/lib/api';
import PackageForm from '../_components/PackageForm';

export default function NewPackagePage() {
  const router = useRouter();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: unknown) => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      await adminCreatePackage(token, data);
      router.push('/admin/packages');
    } catch (e: any) {
      setError(e.message ?? 'Failed to create package');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Package</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new trekking or tour package</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a href="/admin/packages" className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </a>
          <button
            type="submit"
            form="package-form"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Create Package'}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <PackageForm onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
