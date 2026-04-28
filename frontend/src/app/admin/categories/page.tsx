'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, adminUploadImage } from '@/lib/api';
import type { ApiCategory } from '@/types/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, UploadCloud, RefreshCw } from 'lucide-react';

const EMPTY: Partial<ApiCategory> = { name: '', slug: '', description: '', image: '', order: 0, isActive: true };

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: ApiCategory | null }>({ open: false, editing: null });
  const [form, setForm] = useState<Partial<ApiCategory>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    getCategories()
      .then(res => setCategories(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(EMPTY);
    setError('');
    setModal({ open: true, editing: null });
  }

  function openEdit(cat: ApiCategory) {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, order: cat.order, isActive: cat.isActive });
    setError('');
    setModal({ open: true, editing: cat });
  }

  function generateSlug() {
    if (!form.name?.trim()) return;
    setForm(f => ({ ...f, slug: toSlug(f.name ?? '') }));
  }

  async function handleImageUpload(file: File) {
    if (!token) return;
    setUploading(true);
    try {
      const res = await adminUploadImage(token, file);
      setForm(f => ({ ...f, image: res.url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!token || !form.name?.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    try {
      if (modal.editing) {
        await adminUpdateCategory(token, modal.editing._id, form);
      } else {
        await adminCreateCategory(token, form);
      }
      setModal({ open: false, editing: null });
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(cat: ApiCategory) {
    if (!token) return;
    try {
      await adminUpdateCategory(token, cat._id, { isActive: !cat.isActive });
      load();
    } catch {}
  }

  async function handleDelete(cat: ApiCategory) {
    if (!token || !confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteCategory(token, cat._id);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="p-6 max-w-[1000px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Slug</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Order</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">No categories yet. Add your first one.</td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-gray-100">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded shrink-0 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">?</div>
                      )}
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(cat)} className="flex items-center gap-1.5 text-xs font-medium">
                      {cat.isActive
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                        : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-sky-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">{modal.editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name ?? ''}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                  placeholder="e.g. Nepal Trekking"
                />
              </div>

              {/* Slug + Generate button */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug ?? ''}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500 font-mono"
                    placeholder="auto-generated from name"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Generate
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500 resize-none"
                  placeholder="Short description"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                />

                {form.image ? (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, image: '' }))}
                        className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-28 border-2 border-dashed border-gray-200 hover:border-sky-400 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-sky-500 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <><div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs">Uploading…</span></>
                    ) : (
                      <><UploadCloud className="w-6 h-6" /><span className="text-xs font-medium">Click to upload image</span><span className="text-[11px]">JPG, PNG, WEBP</span></>
                    )}
                  </button>
                )}
              </div>

              {/* Order + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.order ?? 0}
                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive ?? true}
                      onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-sky-600"
                    />
                    <span className="text-sm text-gray-700 font-medium">Active</span>
                  </label>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-2.5 text-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Saving…' : modal.editing ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setModal({ open: false, editing: null })}
                className="px-4 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
