'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminGetReviews, adminVerifyReview, adminRespondToReview } from '@/lib/api';
import { Star, BadgeCheck, MessageSquareReply } from 'lucide-react';

interface Review {
  _id: string;
  user?: { name?: string; email?: string };
  package?: { title?: string };
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  response?: string;
  createdAt?: string;
}

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [respondId, setRespondId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminGetReviews(token, { page: String(page), limit: '10' });
      setReviews(res.data as Review[]);
      setTotal((res.meta as any)?.total ?? 0);
    } catch {}
    setLoading(false);
  }, [token, page]);

  useEffect(() => { load(); }, [load]);

  const handleVerify = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await adminVerifyReview(token, id);
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isVerified: true } : r));
    } catch (e: any) {
      alert(e.message ?? 'Failed');
    }
    setActionId(null);
  };

  const handleRespond = async (id: string) => {
    if (!token || !responseText.trim()) return;
    setActionId(id);
    try {
      await adminRespondToReview(token, id, responseText.trim());
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, response: responseText.trim() } : r));
      setRespondId(null);
      setResponseText('');
    } catch (e: any) {
      alert(e.message ?? 'Failed');
    }
    setActionId(null);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} total reviews</p>
      </div>

      <div className="space-y-3">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-xl border border-gray-100 animate-pulse" />
            ))
          : reviews.length === 0
          ? (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">
                No reviews yet
              </div>
            )
          : reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{r.user?.name ?? 'Anonymous'}</span>
                      {r.isVerified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <span className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.package?.title ?? '—'} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!r.isVerified && (
                      <button
                        onClick={() => handleVerify(r._id)}
                        disabled={actionId === r._id}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50"
                      >
                        <BadgeCheck className="w-3.5 h-3.5" /> Verify
                      </button>
                    )}
                    <button
                      onClick={() => { setRespondId(r._id); setResponseText(r.response ?? ''); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                    >
                      <MessageSquareReply className="w-3.5 h-3.5" /> Respond
                    </button>
                  </div>
                </div>

                {/* Comment */}
                {r.title && <p className="text-sm font-semibold text-gray-800">{r.title}</p>}
                <p className="text-sm text-gray-600">{r.comment}</p>

                {/* Existing response */}
                {r.response && (
                  <div className="bg-blue-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Admin Response</p>
                    <p className="text-sm text-blue-800">{r.response}</p>
                  </div>
                )}

                {/* Response form */}
                {respondId === r._id && (
                  <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      placeholder="Write your response..."
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(r._id)}
                        disabled={actionId === r._id || !responseText.trim()}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {actionId === r._id ? 'Saving...' : 'Save Response'}
                      </button>
                      <button
                        onClick={() => { setRespondId(null); setResponseText(''); }}
                        className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
