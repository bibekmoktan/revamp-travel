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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Package</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create a new trekking or tour package</p>
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
