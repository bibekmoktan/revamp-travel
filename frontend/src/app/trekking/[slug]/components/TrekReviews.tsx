'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, MessageSquare, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getPackageReviews, createReview } from '@/lib/api';
import type { ApiReview } from '@/types/api';

/* ── Helpers ───────────────────────────────────────────────── */

function Stars({ value, max = 5, size = 'sm', interactive = false, onChange }: {
  value: number; max?: number; size?: 'sm' | 'md' | 'lg';
  interactive?: boolean; onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const sz = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = (interactive ? (hover || value) : value) > i;
        return (
          <Star
            key={i}
            className={`${sz} transition-colors ${filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} ${interactive ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

function userName(review: ApiReview): string {
  if (typeof review.user === 'object' && 'name' in review.user) return review.user.name;
  return 'Anonymous';
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-gray-600 font-medium">{label}</span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-gray-400">{count}</span>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */

export default function TrekReviews({ packageId }: { packageId: string }) {
  const { user, token } = useAuth();

  const [reviews, setReviews]     = useState<ApiReview[]>([]);
  const [loading, setLoading]     = useState(true);

  // form state
  const [rating, setRating]       = useState(0);
  const [title, setTitle]         = useState('');
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getPackageReviews(packageId);
      setReviews(res.data);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => { load(); }, [load]);

  // stats
  const total = reviews.length;
  const avg   = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const dist  = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setFormError('Please select a star rating.'); return; }
    if (comment.trim().length < 10) { setFormError('Comment must be at least 10 characters.'); return; }
    if (!token || !user) return;
    setFormError('');
    setSubmitting(true);
    try {
      const res = await createReview(token, {
        user: user._id,
        package: packageId,
        rating,
        comment: comment.trim(),
        title: title.trim() || undefined,
      });
      setReviews(prev => [res.data, ...prev]);
      setRating(0); setTitle(''); setComment('');
      setSubmitted(true);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings &amp; Reviews</h2>

      {/* ── Summary ── */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row gap-6">
          {/* Big number */}
          <div className="flex flex-col items-center justify-center sm:border-r border-gray-100 sm:pr-6 shrink-0">
            <span className="text-5xl font-extrabold text-gray-900">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} size="md" />
            <span className="text-xs text-gray-400 mt-1">{total} review{total !== 1 ? 's' : ''}</span>
          </div>
          {/* Bars */}
          <div className="flex-1 space-y-2 justify-center flex flex-col">
            {dist.map(({ star, count }) => (
              <RatingBar key={star} label={String(star)} count={count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* ── Review Cards ── */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-10 text-center text-gray-400 mb-6">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                    {userName(review).charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{userName(review)}</span>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <Stars value={review.rating} size="sm" />
              </div>

              {review.title && (
                <p className="mt-3 text-sm font-semibold text-gray-800">{review.title}</p>
              )}
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{review.comment}</p>

              {review.response && (
                <div className="mt-3 bg-sky-50 rounded-xl px-4 py-3 border border-sky-100">
                  <p className="text-xs font-bold text-sky-700 mb-1">Response from Travel Nepal</p>
                  <p className="text-xs text-sky-800 leading-relaxed">{review.response.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Write a Review ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-sky-50/60">
          <Star className="w-4 h-4 text-sky-600 shrink-0" />
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Write a Review</h3>
        </div>

        {!user ? (
          <div className="px-6 py-8 text-center">
            <LogIn className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">You must be logged in to leave a review.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" /> Log In
            </Link>
          </div>
        ) : submitted ? (
          <div className="px-6 py-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800">Review submitted!</p>
            <p className="text-sm text-gray-500 mt-1">Thank you for sharing your experience.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Star picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Your Rating <span className="text-red-500">*</span></label>
              <Stars value={rating} size="lg" interactive onChange={setRating} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Review Title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Summarise your experience"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Review <span className="text-red-500">*</span></label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience — what did you enjoy, what could be improved…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 resize-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">{comment.length} / 2000 — minimum 10 characters</p>
            </div>

            {formError && <p className="text-red-500 text-xs">{formError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
