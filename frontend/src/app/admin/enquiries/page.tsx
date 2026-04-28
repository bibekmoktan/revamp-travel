'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminGetEnquiries, adminUpdateEnquiryStatus, adminDeleteEnquiry } from '@/lib/api';
import type { ApiEnquiry } from '@/types/api';
import { Mail, Trash2, CheckCircle, Eye, MessageSquare, RefreshCw } from 'lucide-react';

const STATUS_COLORS: Record<ApiEnquiry['status'], string> = {
  new:     'bg-sky-100 text-sky-700',
  read:    'bg-amber-100 text-amber-700',
  replied: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<ApiEnquiry['status'], string> = {
  new: 'New', read: 'Read', replied: 'Replied',
};

type FilterStatus = 'all' | ApiEnquiry['status'];

export default function AdminEnquiriesPage() {
  const { token } = useAuth();
  const [enquiries, setEnquiries]   = useState<ApiEnquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<FilterStatus>('all');
  const [page, setPage]             = useState(1);
  const [meta, setMeta]             = useState({ total: 0, pages: 1 });
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (filter !== 'all') params.status = filter;
      const res = await adminGetEnquiries(token, params);
      setEnquiries(res.data);
      setMeta({ total: res.meta.total, pages: res.meta.pages });
    } finally {
      setLoading(false);
    }
  }, [token, page, filter]);

  useEffect(() => { load(); }, [load]);

  async function markStatus(id: string, status: ApiEnquiry['status']) {
    if (!token) return;
    await adminUpdateEnquiryStatus(token, id, status);
    setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
  }

  async function handleDelete(id: string) {
    if (!token || !confirm('Delete this enquiry?')) return;
    setDeleting(id);
    try {
      await adminDeleteEnquiry(token, id);
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } finally {
      setDeleting(null);
    }
  }

  const newCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-sky-600" />
            Enquiries
            {newCount > 0 && (
              <span className="ml-1 bg-sky-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {newCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{meta.total} total enquiries</p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'new', 'read', 'replied'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === s
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s as ApiEnquiry['status']]}
            </button>
          ))}
          <button
            onClick={load}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No enquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enquiries.map(enq => (
              <div key={enq._id} className={`${enq.status === 'new' ? 'bg-sky-50/40' : ''}`}>
                {/* Row summary */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{enq.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[enq.status]}`}>
                        {STATUS_LABELS[enq.status]}
                      </span>
                      {enq.packageTitle && (
                        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded truncate max-w-[180px]">
                          {enq.packageTitle}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{enq.email}</span>
                      {enq.phone && <span className="text-xs text-gray-400">{enq.phone}</span>}
                      <span className="text-xs text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {/* Message preview */}
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[480px]">{enq.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === enq._id ? null : enq._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      title="View full message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {enq.status === 'new' && (
                      <button
                        onClick={() => markStatus(enq._id, 'read')}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Mark as read"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    {enq.status !== 'replied' && (
                      <button
                        onClick={() => markStatus(enq._id, 'replied')}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Mark as replied"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    {enq.status === 'replied' && (
                      <span className="p-1.5 text-green-500" title="Replied">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(enq._id)}
                      disabled={deleting === enq._id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded message */}
                {expanded === enq._id && (
                  <div className="px-5 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200">
                      {enq.message}
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap text-xs text-gray-400">
                      <span>Email: <a href={`mailto:${enq.email}`} className="text-sky-600 hover:underline">{enq.email}</a></span>
                      {enq.phone && <span>Phone: <a href={`tel:${enq.phone}`} className="text-sky-600 hover:underline">{enq.phone}</a></span>}
                      {enq.packageTitle && <span>Package: {enq.packageTitle}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">Page {page} of {meta.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
            disabled={page === meta.pages}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
