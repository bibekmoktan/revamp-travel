'use client';

import { useState, useEffect } from 'react';
import {
  X, CheckCircle, Loader2,
  MapPin, Users, Calendar, Hotel, Wallet, Globe, MessageSquare,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { useLenis } from '@/app/components/LenisProvider';

interface FormData {
  tripDuration: string;
  approxStartDate: string;
  approxEndDate: string;
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

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 bg-white transition-colors';
const selectCls = inputCls + ' text-gray-600';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

function buildMessage(f: FormData, packageTitle: string): string {
  return [
    `[Itinerary Customisation Request]`,
    `Package: ${packageTitle}`,
    '',
    `Duration: ${f.tripDuration} days`,
    `Start Date: ${f.approxStartDate}`,
    `End Date: ${f.approxEndDate}`,
    `Adults: ${f.numberOfAdults}${f.numberOfChildren ? `, Children: ${f.numberOfChildren}` : ''}`,
    `Accommodation: ${f.hotelType}`,
    `Budget: ${f.estimatedBudget}`,
    `Guide Language: ${f.guideLanguage}`,
    `Country: ${f.selectYourCountry}`,
    `Found Via: ${f.whereDidYouFindUs}`,
    '',
    'Additional Requirements:',
    f.moreInformation,
  ].join('\n');
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  defaultDuration: number;
}

export default function CustomizeItineraryModal({ isOpen, onClose, packageTitle, defaultDuration }: Props) {
  const { stop, start } = useLenis();
  const [form, setForm] = useState<FormData>({
    tripDuration: String(defaultDuration),
    approxStartDate: '', approxEndDate: '',
    numberOfAdults: '', numberOfChildren: '',
    hotelType: '', estimatedBudget: '', guideLanguage: '',
    moreInformation: '', fullName: '', emailAddress: '',
    phoneNumberWithCountryCode: '', selectYourCountry: '', whereDidYouFindUs: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    stop();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [stop, start]);

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
        message: buildMessage(form, packageTitle),
        packageTitle,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setError('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-[#F3F6FB] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between shrink-0">
          <div>
            <p className="text-xs font-semibold tracking-widest text-sky-600 uppercase mb-0.5">Customise Your Trip</p>
            <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-1">{packageTitle}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-6 py-5" data-lenis-prevent>
          {success ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-sm text-gray-500 text-center leading-relaxed max-w-sm mb-6">
                Thank you! Our travel experts will review your requirements and send you a personalised proposal within <strong className="text-gray-700">24 hours</strong>.
              </p>
              <div className="bg-sky-50 rounded-xl px-5 py-4 space-y-3 w-full max-w-sm mb-6">
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
              <button
                onClick={handleClose}
                className="w-full max-w-sm bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Trip Details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-sky-50/60">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Trip Details</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

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

                  <div>
                    <label className={labelCls}>Approx Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="approxStartDate" value={form.approxStartDate} onChange={update} required className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Approx End Date <span className="text-red-500">*</span></label>
                    <input type="date" name="approxEndDate" value={form.approxEndDate} onChange={update} required className={inputCls} />
                  </div>

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

                  <div>
                    <label className={labelCls}>Children <span className="text-gray-400 font-normal">(age below 10)</span></label>
                    <input
                      type="number" name="numberOfChildren" value={form.numberOfChildren} onChange={update}
                      min="0" placeholder="0"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5"><Hotel className="w-3.5 h-3.5" /> Accommodation <span className="text-red-500">*</span></span>
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

                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Budget Range <span className="text-red-500">*</span></span>
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

                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> What would you like to change? <span className="text-red-500">*</span></span>
                    </label>
                    <textarea
                      name="moreInformation" value={form.moreInformation} onChange={update}
                      required rows={4}
                      placeholder="Describe what you'd like to modify — extra days, different route, activities, dietary needs, fitness level…"
                      className={inputCls + ' resize-none'}
                    />
                  </div>

                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-sky-50/60">
                  <Users className="w-4 h-4 text-sky-600 shrink-0" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Personal Information</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

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

              {error && <p className="text-red-500 text-sm px-1">{error}</p>}

              <div className="flex justify-end pb-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold px-8 py-3 rounded-lg text-sm uppercase tracking-wide transition-colors shadow-md"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Request'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
