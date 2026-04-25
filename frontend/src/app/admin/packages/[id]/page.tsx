'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPackages, adminUpdatePackage } from '@/lib/api';
import type { ApiPackage } from '@/types/api';
import PackageForm from '../_components/PackageForm';

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const id = params.id as string;

  const [pkg, setPkg] = useState<ApiPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackages({ limit: 100 })
      .then((res) => {
        const found = res.data.find((p) => p._id === id);
        setPkg(found ?? null);
      })
      .catch(() => setError('Failed to load package'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: unknown) => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      await adminUpdatePackage(token, id, data);
      router.push('/admin/packages');
    } catch (e: any) {
      setError(e.message ?? 'Failed to update package');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!pkg) {
    return <div className="text-gray-500">Package not found.</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pkg.title}</p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <PackageForm initialData={pkg} onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
