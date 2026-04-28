'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, ChevronDown, ChevronUp, UploadCloud, ImageIcon } from 'lucide-react';
import type { ApiPackage, ApiCategory } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { adminUploadImage, getCategories } from '@/lib/api';

interface Props {
  initialData?: ApiPackage;
  onSubmit: (data: unknown) => Promise<void>;
  saving: boolean;
}

interface ImageValue {
  url: string;
  public_id: string;
}

// ── Image Upload Box ───────────────────────────────────────────────────────
function ImageUploadBox({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: ImageValue | null;
  onChange: (v: ImageValue | null) => void;
  required?: boolean;
}) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!token) return;
    setError('');
    setUploading(true);
    try {
      const result = await adminUploadImage(token, file);
      onChange(result);
    } catch (e: any) {
      setError(e.message ?? 'Upload failed');
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {value?.url ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 group">
          <Image src={value.url} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-full h-44 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">Click or drag to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Gallery Upload ─────────────────────────────────────────────────────────
function GalleryUpload({ values, onChange }: { values: ImageValue[]; onChange: (v: ImageValue[]) => void }) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList) => {
    if (!token) return;
    setUploading(true);
    const results: ImageValue[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await adminUploadImage(token, file);
        results.push(result);
      } catch {}
    }
    onChange([...values, ...results]);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gallery Images</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {values.map((img, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <Image src={img.url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {uploading
            ? <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            : <><ImageIcon className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Add</span></>}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}

// ── Tag Input ──────────────────────────────────────────────────────────────
function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:text-blue-900">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Type and press Enter"
          className={INPUT}
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
          Add
        </button>
      </div>
    </div>
  );
}

const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5';
const SECTION = 'bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4';

export default function PackageForm({ initialData, onSubmit, saving }: Props) {
  const d = initialData;

  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [title, setTitle]                   = useState(d?.title ?? '');
  const [slug, setSlug]                     = useState(d?.slug ?? '');
  const [category, setCategory]             = useState(d?.category ?? '');
  const [duration, setDuration]             = useState(d?.duration ?? '');
  const [price, setPrice]                   = useState(String(d?.price ?? ''));
  const [location, setLocation]             = useState(d?.location ?? '');
  const [difficulty, setDifficulty]         = useState(d?.difficulty ?? '');
  const [altitude, setAltitude]             = useState(d?.altitude ?? '');
  const [groupSize, setGroupSize]           = useState(d?.groupSize ?? '');
  const [tripStart, setTripStart]           = useState(d?.tripStart ?? '');
  const [tripEnd, setTripEnd]               = useState(d?.tripEnd ?? '');
  const [meals, setMeals]                   = useState(d?.meals ?? '');
  const [accommodation, setAccommodation]   = useState(d?.accommodation ?? '');
  const [mapUrl, setMapUrl]                 = useState(d?.mapUrl ?? '');
  const [description, setDescription]       = useState(d?.description ?? '');

  useEffect(() => {
    getCategories().then((res) => {
      setApiCategories(res.data ?? []);
      if (!category && res.data?.length) setCategory(res.data[0].slug);
    }).catch(() => {});
  }, []);

  const [featureImage, setFeatureImage] = useState<ImageValue | null>(
    d?.featureImage?.url ? { url: d.featureImage.url, public_id: (d.featureImage as any).public_id ?? '' } : null
  );
  const [gallery, setGallery] = useState<ImageValue[]>(
    d?.gallery?.map((g) => ({ url: g.url, public_id: (g as any).public_id ?? '' })) ?? []
  );

  const [bestSeason, setBestSeason]   = useState<string[]>(d?.bestSeason ?? []);
  const [highlights, setHighlights]   = useState<string[]>(d?.highlights ?? []);
  const [includes, setIncludes]       = useState<string[]>(d?.includes ?? []);
  const [notIncluded, setNotIncluded] = useState<string[]>(d?.notIncluded ?? []);

  const [itinerary, setItinerary] = useState(
    d?.itinerary?.length ? d.itinerary : [{ day: 1, title: '', description: '', activities: [''] }]
  );
  const [faq, setFaq]         = useState(d?.faq?.length ? d.faq : [{ question: '', answer: '' }]);
  const [moreInfo, setMoreInfo] = useState(
    d?.moreInfo?.length ? d.moreInfo : [{ title: '', points: [''] }]
  );

  const [openSection, setOpenSection] = useState<string | null>('basic');
  const toggleSection = (id: string) => setOpenSection((s) => (s === id ? null : id));

  // ── Itinerary helpers ──────────────────────────────────────────────────────
  const addDay = () =>
    setItinerary((prev) => [...prev, { day: prev.length + 1, title: '', description: '', activities: [''] }]);
  const removeDay = (i: number) =>
    setItinerary((prev) => prev.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));
  const updateDay = (i: number, field: string, val: string) =>
    setItinerary((prev) => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  const updateActivity = (di: number, ai: number, val: string) =>
    setItinerary((prev) =>
      prev.map((d, i) => i !== di ? d : { ...d, activities: d.activities.map((a, j) => j === ai ? val : a) })
    );
  const addActivity = (di: number) =>
    setItinerary((prev) => prev.map((d, i) => i !== di ? d : { ...d, activities: [...d.activities, ''] }));
  const removeActivity = (di: number, ai: number) =>
    setItinerary((prev) =>
      prev.map((d, i) => i !== di ? d : { ...d, activities: d.activities.filter((_, j) => j !== ai) })
    );

  // ── FAQ helpers ────────────────────────────────────────────────────────────
  const addFaq = () => setFaq((prev) => [...prev, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaq((prev) => prev.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: 'question' | 'answer', val: string) =>
    setFaq((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  // ── MoreInfo helpers ───────────────────────────────────────────────────────
  const addMoreInfo = () => setMoreInfo((prev) => [...prev, { title: '', points: [''] }]);
  const removeMoreInfo = (i: number) => setMoreInfo((prev) => prev.filter((_, idx) => idx !== i));
  const updateMoreInfoTitle = (i: number, val: string) =>
    setMoreInfo((prev) => prev.map((m, idx) => idx === i ? { ...m, title: val } : m));
  const updateMoreInfoPoint = (mi: number, pi: number, val: string) =>
    setMoreInfo((prev) =>
      prev.map((m, i) => i !== mi ? m : { ...m, points: m.points.map((p, j) => j === pi ? val : p) })
    );
  const addMoreInfoPoint = (mi: number) =>
    setMoreInfo((prev) => prev.map((m, i) => i !== mi ? m : { ...m, points: [...m.points, ''] }));
  const removeMoreInfoPoint = (mi: number, pi: number) =>
    setMoreInfo((prev) =>
      prev.map((m, i) => i !== mi ? m : { ...m, points: m.points.filter((_, j) => j !== pi) })
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category,
      duration,
      price: parseFloat(price),
      location,
      difficulty: difficulty || undefined,
      altitude: altitude || undefined,
      groupSize,
      tripStart,
      tripEnd,
      meals,
      accommodation,
      mapUrl: mapUrl || undefined,
      description,
      featureImage: featureImage ?? undefined,
      gallery,
      bestSeason,
      highlights,
      includes,
      notIncluded,
      itinerary: itinerary.filter((d) => d.title),
      faq: faq.filter((f) => f.question && f.answer),
      moreInfo: moreInfo.filter((m) => m.title && m.points.some((p) => p.trim())),
    };
    await onSubmit(data);
  };

  const SectionHeader = ({ id, label }: { id: string; label: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="flex items-center justify-between w-full text-left"
    >
      <h2 className="text-base font-semibold text-gray-900">{label}</h2>
      {openSection === id
        ? <ChevronUp className="w-4 h-4 text-gray-400" />
        : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Basic Info */}
      <div className={SECTION}>
        <SectionHeader id="basic" label="Basic Information" />
        {openSection === 'basic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT} placeholder="Everest Base Camp Trek" required />
            </div>
            <div>
              <label className={LABEL}>Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={INPUT} placeholder="auto-generated if empty" />
            </div>
            <div>
              <label className={LABEL}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
                {apiCategories.length === 0 && <option value="">Loading…</option>}
                {apiCategories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Price (USD) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={INPUT} placeholder="1500" required min="0" />
            </div>
            <div>
              <label className={LABEL}>Duration *</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} className={INPUT} placeholder="14 Days" required />
            </div>
            <div>
              <label className={LABEL}>Location *</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className={INPUT} placeholder="Nepal" required />
            </div>
            <div>
              <label className={LABEL}>Group Size *</label>
              <input value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className={INPUT} placeholder="2-12 people" required />
            </div>
            <div>
              <label className={LABEL}>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={INPUT}>
                <option value="">— Select —</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Max Altitude</label>
              <input value={altitude} onChange={(e) => setAltitude(e.target.value)} className={INPUT} placeholder="5364m" />
            </div>
            <div>
              <label className={LABEL}>Trip Starts</label>
              <input value={tripStart} onChange={(e) => setTripStart(e.target.value)} className={INPUT} placeholder="Kathmandu" />
            </div>
            <div>
              <label className={LABEL}>Trip Ends</label>
              <input value={tripEnd} onChange={(e) => setTripEnd(e.target.value)} className={INPUT} placeholder="Kathmandu" />
            </div>
            <div>
              <label className={LABEL}>Meals</label>
              <input value={meals} onChange={(e) => setMeals(e.target.value)} className={INPUT} placeholder="Breakfast & Dinner" />
            </div>
            <div>
              <label className={LABEL}>Accommodation</label>
              <input value={accommodation} onChange={(e) => setAccommodation(e.target.value)} className={INPUT} placeholder="Teahouses" />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={INPUT} placeholder="Describe the trek..." required />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Map Embed URL</label>
              <input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className={INPUT} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      <div className={SECTION}>
        <SectionHeader id="images" label="Images" />
        {openSection === 'images' && (
          <div className="space-y-6 pt-2">
            <ImageUploadBox
              label="Feature Image"
              value={featureImage}
              onChange={setFeatureImage}
              required
            />
            <GalleryUpload values={gallery} onChange={setGallery} />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className={SECTION}>
        <SectionHeader id="tags" label="Seasons, Highlights & Inclusions" />
        {openSection === 'tags' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <TagInput label="Best Season" values={bestSeason} onChange={setBestSeason} />
            <TagInput label="Highlights" values={highlights} onChange={setHighlights} />
            <TagInput label="What's Included" values={includes} onChange={setIncludes} />
            <TagInput label="What's Not Included" values={notIncluded} onChange={setNotIncluded} />
          </div>
        )}
      </div>

      {/* Itinerary */}
      <div className={SECTION}>
        <SectionHeader id="itinerary" label={`Itinerary (${itinerary.length} days)`} />
        {openSection === 'itinerary' && (
          <div className="space-y-4 pt-2">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input value={day.title} onChange={(e) => updateDay(i, 'title', e.target.value)} className={INPUT} placeholder="Day title" />
                <textarea value={day.description} onChange={(e) => updateDay(i, 'description', e.target.value)} rows={2} className={INPUT} placeholder="Description" />
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Activities</p>
                  {day.activities.map((act, j) => (
                    <div key={j} className="flex gap-2 mb-1.5">
                      <input value={act} onChange={(e) => updateActivity(i, j, e.target.value)} className={INPUT} placeholder="Activity" />
                      {day.activities.length > 1 && (
                        <button type="button" onClick={() => removeActivity(i, j)} className="text-red-400 hover:text-red-600 shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addActivity(i)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add activity
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addDay} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Plus className="w-4 h-4" /> Add Day
            </button>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className={SECTION}>
        <SectionHeader id="faq" label={`FAQ (${faq.length} items)`} />
        {openSection === 'faq' && (
          <div className="space-y-3 pt-2">
            {faq.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">Q{i + 1}</span>
                  {faq.length > 1 && (
                    <button type="button" onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input value={item.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} className={INPUT} placeholder="Question" />
                <textarea value={item.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} rows={2} className={INPUT} placeholder="Answer" />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
        )}
      </div>

      {/* More Info */}
      <div className={SECTION}>
        <SectionHeader id="moreInfo" label={`Good to Know (${moreInfo.length} items)`} />
        {openSection === 'moreInfo' && (
          <div className="space-y-3 pt-2">
            {moreInfo.map((item, mi) => (
              <div key={mi} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <input value={item.title} onChange={(e) => updateMoreInfoTitle(mi, e.target.value)} className={INPUT} placeholder="Section title (e.g. Required Gear)" />
                  {moreInfo.length > 1 && (
                    <button type="button" onClick={() => removeMoreInfo(mi)} className="ml-2 text-red-400 hover:text-red-600 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="pl-2 space-y-1.5">
                  {item.points.map((pt, pi) => (
                    <div key={pi} className="flex gap-2">
                      <input value={pt} onChange={(e) => updateMoreInfoPoint(mi, pi, e.target.value)} className={INPUT} placeholder="Bullet point" />
                      {item.points.length > 1 && (
                        <button type="button" onClick={() => removeMoreInfoPoint(mi, pi)} className="text-red-400 hover:text-red-600 shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addMoreInfoPoint(mi)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add point
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addMoreInfo} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : initialData ? 'Update Package' : 'Create Package'}
        </button>
        <a href="/admin/packages" className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
    </form>
  );
}
