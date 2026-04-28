'use client';

import { useState } from 'react';
import { CheckCircle, X, Loader2, MapPin, Users, Calendar, Hotel, Wallet, Globe, MessageSquare } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';

interface FormData {
  tripType: string;
  approxStartDate: string;
  approxEndDate: string;
  tripDuration: string;
  numberOfAdults: string;
  numberOfChildren: string;
  hotelType: string;
  estimatedBudget: string;
  guideLanguage: string;
  moreInformation: string;
  fullName: string;
  emailAddress: string;
  phoneNumberWithCountryCode: string;
  selectYourCountry: string;
  whereDidYouFindUs: string;
}

const EMPTY: FormData = {
  tripType: '', approxStartDate: '', approxEndDate: '', tripDuration: '',
  numberOfAdults: '', numberOfChildren: '', hotelType: '', estimatedBudget: '',
  guideLanguage: '', moreInformation: '', fullName: '', emailAddress: '',
  phoneNumberWithCountryCode: '', selectYourCountry: '', whereDidYouFindUs: '',
};

function buildMessage(f: FormData): string {
  return [
    '[Custom Trip Request]',
    '',
    `Trip Type: ${f.tripType}`,
    `Start Date: ${f.approxStartDate}`,
    `End Date: ${f.approxEndDate}`,
    `Duration: ${f.tripDuration} days`,
    `Adults: ${f.numberOfAdults}${f.numberOfChildren ? `, Children: ${f.numberOfChildren}` : ''}`,
    `Accommodation: ${f.hotelType}`,
    `Budget: ${f.estimatedBudget}`,
    `Guide Language: ${f.guideLanguage}`,
    `Country: ${f.selectYourCountry}`,
    `Found Via: ${f.whereDidYouFindUs}`,
    '',
    'Additional Information:',
    f.moreInformation,
  ].join('\n');
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 bg-white transition-colors';
const selectCls = inputCls + ' text-gray-600';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

export default function CustomPackage() {
  const [form, setForm]           = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.emailAddress.trim()) {
      setError('Full name and email are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: form.fullName.trim(),
        email: form.emailAddress.trim(),
        phone: form.phoneNumberWithCountryCode || undefined,
        message: buildMessage(form),
        packageTitle: `Custom ${form.tripType || 'Trip'} — ${form.approxStartDate || 'TBD'}`,
      });
      setSuccess(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F6FB] mt-20">
      {/* Page hero */}
      <div className="bg-white border-b border-gray-100 py-10 text-center">
        <p className="text-xs font-semibold tracking-widest text-sky-600 uppercase mb-2">Plan Your Adventure</p>
        <h1 className="text-3xl font-bold text-gray-900">Customise Your Trip</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
          Tell us your dream itinerary and our team will craft a personalised package just for you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Trip Details ──────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-sky-50/60">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Trip Details</h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Trip Type */}
              <div>
                <label className={labelCls}>Trip Type <span className="text-red-500">*</span></label>
                <select name="tripType" value={form.tripType} onChange={update} required className={selectCls}>
                  <option value="">Select trip type</option>
                  <option value="Trekking">Trekking</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Mountaineering">Mountaineering</option>
                  <option value="Adventure Tour">Adventure Tour</option>
                  <option value="Cultural Tour">Cultural Tour</option>
                  <option value="Wildlife Safari">Wildlife Safari</option>
                  <option value="Pilgrimage">Pilgrimage</option>
                </select>
              </div>

              {/* Trip Duration */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Duration (days) <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="number" name="tripDuration" value={form.tripDuration} onChange={update}
                  required min="1" placeholder="e.g. 14"
                  className={inputCls}
                />
              </div>

              {/* Start Date */}
              <div>
                <label className={labelCls}>Approx Start Date <span className="text-red-500">*</span></label>
                <input type="date" name="approxStartDate" value={form.approxStartDate} onChange={update} required className={inputCls} />
              </div>

              {/* End Date */}
              <div>
                <label className={labelCls}>Approx End Date <span className="text-red-500">*</span></label>
                <input type="date" name="approxEndDate" value={form.approxEndDate} onChange={update} required className={inputCls} />
              </div>

              {/* Adults */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Number of Adults <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="number" name="numberOfAdults" value={form.numberOfAdults} onChange={update}
                  required min="1" placeholder="1"
                  className={inputCls}
                />
              </div>

              {/* Children */}
              <div>
                <label className={labelCls}>Children <span className="text-gray-400 font-normal">(age below 10)</span></label>
                <input
                  type="number" name="numberOfChildren" value={form.numberOfChildren} onChange={update}
                  min="0" placeholder="0"
                  className={inputCls}
                />
              </div>

              {/* Hotel Type */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Hotel className="w-3.5 h-3.5" /> Accommodation Type <span className="text-red-500">*</span></span>
                </label>
                <select name="hotelType" value={form.hotelType} onChange={update} required className={selectCls}>
                  <option value="">Select accommodation</option>
                  <option value="Tea House">Tea House</option>
                  <option value="Guest House">Guest House</option>
                  <option value="Budget Hotel">Budget Hotel</option>
                  <option value="Standard Hotel">Standard Hotel</option>
                  <option value="Deluxe Hotel">Deluxe Hotel</option>
                  <option value="Luxury Hotel">Luxury Hotel</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Estimated Budget <span className="text-red-500">*</span></span>
                </label>
                <select name="estimatedBudget" value={form.estimatedBudget} onChange={update} required className={selectCls}>
                  <option value="">Select budget range</option>
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 – $2,500">$1,000 – $2,500</option>
                  <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                  <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                  <option value="Above $10,000">Above $10,000</option>
                </select>
              </div>

              {/* Guide Language */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Guide Language <span className="text-red-500">*</span></span>
                </label>
                <select name="guideLanguage" value={form.guideLanguage} onChange={update} required className={selectCls}>
                  <option value="">Select language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              {/* More Information */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Additional Requirements <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  name="moreInformation" value={form.moreInformation} onChange={update}
                  required rows={5}
                  placeholder="Describe your dream trip — destinations, activities, special requests, dietary needs, fitness level…"
                  className={inputCls + ' resize-none'}
                />
              </div>

            </div>
          </div>

          {/* ── Personal Information ──────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-sky-50/60">
              <Users className="w-4 h-4 text-sky-600 shrink-0" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Information</h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text" name="fullName" value={form.fullName} onChange={update}
                  required placeholder="Your full name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email" name="emailAddress" value={form.emailAddress} onChange={update}
                  required placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Phone <span className="text-gray-400 font-normal">(with country code)</span></label>
                <input
                  type="tel" name="phoneNumberWithCountryCode" value={form.phoneNumberWithCountryCode} onChange={update}
                  placeholder="+977 98XXXXXXXX"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Country <span className="text-red-500">*</span></label>
                <select name="selectYourCountry" value={form.selectYourCountry} onChange={update} required className={selectCls}>
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>How did you find us? <span className="text-red-500">*</span></label>
                <select name="whereDidYouFindUs" value={form.whereDidYouFindUs} onChange={update} required className={selectCls}>
                  <option value="">Select an option</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Friend Recommendation">Friend Recommendation</option>
                  <option value="Travel Blog">Travel Blog</option>
                  <option value="Travel Agent">Travel Agent</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm px-1">{error}</p>
          )}

          {/* Submit */}
          <div className="flex justify-end pb-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold px-8 py-3 rounded-lg text-sm uppercase tracking-wide transition-colors shadow-md"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Request'}
            </button>
          </div>

        </form>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSuccess(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

            <button
              onClick={() => setSuccess(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-8 pt-10 pb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Thank you! Our travel experts will review your requirements and send you a personalised proposal within <strong className="text-gray-700">24 hours</strong>.
              </p>
            </div>

            <div className="mx-8 mb-6 bg-sky-50 rounded-xl px-5 py-4 space-y-3">
              {[
                ['Review & Analysis', 'Our experts analyse your requirements'],
                ['Custom Proposal', 'Detailed itinerary & pricing within 24 h'],
                ['Personal Consultation', 'A call to refine your perfect adventure'],
              ].map(([title, desc], i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-sky-900">{title}</p>
                    <p className="text-xs text-sky-700">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-8 pb-8">
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
              >
                Got it, thanks!
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
