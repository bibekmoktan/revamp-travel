'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/lib/api';
import { CheckCircle, Send } from 'lucide-react';

interface Props {
  packageId?: string;
  packageTitle?: string;
  className?: string;
}

export default function QuickEnquiryForm({ packageId, packageTitle, className = '' }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, email and message are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitEnquiry({ ...form, packageId, packageTitle });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center gap-3 ${className}`}>
        <CheckCircle className="w-10 h-10 text-green-500" />
        <p className="font-semibold text-gray-800">Enquiry sent!</p>
        <p className="text-sm text-gray-500">Our team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {packageTitle && (
        <p className="text-xs text-sky-600 font-semibold bg-sky-50 px-3 py-1.5 rounded">
          Enquiry about: {packageTitle}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => update('phone', e.target.value)}
          placeholder="+977 98..."
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Message *</label>
        <textarea
          value={form.message}
          onChange={e => update('message', e.target.value)}
          rows={4}
          placeholder="Tell us your travel dates, group size, or any questions..."
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
