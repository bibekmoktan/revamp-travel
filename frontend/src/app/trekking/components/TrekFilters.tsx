'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

// ── Constants ───────────────────────────────────────────────────────────────

const PRICE_MIN = 0;
const PRICE_MAX = 5000;
const PRICE_STEP = 50;

// ── Filter definitions ──────────────────────────────────────────────────────

const FILTER_SECTIONS = [
  {
    label: 'Difficulty',
    key: 'difficulty',
    options: [
      { label: 'Easy',        value: 'easy'        },
      { label: 'Moderate',    value: 'moderate'    },
      { label: 'Challenging', value: 'challenging' },
      { label: 'Extreme',     value: 'extreme'     },
    ],
  },
  {
    label: 'Duration',
    key: 'duration',
    options: [
      { label: '1 Day',    value: '1'   },
      { label: '2–3 Days', value: '2-3' },
      { label: '4–7 Days', value: '4-7' },
      { label: '8+ Days',  value: '8+'  },
    ],
  },
  {
    label: 'Best Season',
    key: 'season',
    options: [
      { label: 'Spring',  value: 'Spring'  },
      { label: 'Summer',  value: 'Summer'  },
      { label: 'Monsoon', value: 'Monsoon' },
      { label: 'Autumn',  value: 'Autumn'  },
      { label: 'Winter',  value: 'Winter'  },
    ],
  },
] as const;

// ── Dual range slider ───────────────────────────────────────────────────────

function PriceRangeSlider({
  initialMin,
  initialMax,
  onApply,
}: {
  initialMin: number;
  initialMax: number;
  onApply: (min: string, max: string) => void;
}) {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);

  useEffect(() => {
    setMinVal(initialMin);
    setMaxVal(initialMax);
  }, [initialMin, initialMax]);

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const commit = (min: number, max: number) =>
    onApply(
      min > PRICE_MIN ? String(min) : '',
      max < PRICE_MAX ? String(max) : '',
    );

  return (
    <div>
      {/* Slider */}
      <div className="relative flex items-center h-5 mb-3">
        <div className="absolute left-0 right-0 h-[3px] rounded-full bg-gray-200" />
        <div
          className="absolute h-[3px] rounded-full bg-[#1E88E5]"
          style={{ left: `${pct(minVal)}%`, right: `${100 - pct(maxVal)}%` }}
        />

        {/* Min input */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={minVal}
          onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - PRICE_STEP))}
          onMouseUp={() => commit(minVal, maxVal)}
          onTouchEnd={() => commit(minVal, maxVal)}
          className="price-range-input"
          style={{ zIndex: minVal >= PRICE_MAX - PRICE_STEP ? 5 : 3 }}
        />

        {/* Max input */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={maxVal}
          onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + PRICE_STEP))}
          onMouseUp={() => commit(minVal, maxVal)}
          onTouchEnd={() => commit(minVal, maxVal)}
          className="price-range-input"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Price label */}
      <p className="text-xs text-[#607D8B]">
        ${minVal.toLocaleString()} &ndash;{' '}
        {maxVal >= PRICE_MAX ? `$${PRICE_MAX.toLocaleString()}+` : `$${maxVal.toLocaleString()}`}
      </p>
    </div>
  );
}

// ── Collapsible section ─────────────────────────────────────────────────────

function FilterSection({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-2"
      >
        <span className="text-sm font-bold text-[#37474F]">{label}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#607D8B]" />
          : <ChevronDown className="w-4 h-4 text-[#607D8B]" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-0.5 cursor-pointer group" onClick={onChange}>
      <span
        className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-[#1E88E5] border-[#1E88E5]'
            : 'border-gray-300 bg-white group-hover:border-[#1E88E5]'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2">
            <path d="M1 4l2.5 3L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-sm transition-colors ${checked ? 'text-[#1E88E5] font-medium' : 'text-[#37474F] group-hover:text-[#1E88E5]'}`}>
        {label}
      </span>
    </label>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function TrekFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? '';

  const currentMinPrice = get('minPrice');
  const currentMaxPrice = get('maxPrice');

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '') params.delete(key);
        else params.set(key, val);
      });
      if (!('page' in updates) && !('view' in updates)) params.delete('page');
      startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
    },
    [router, pathname, searchParams],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const current = get(key);
      setParam({ [key]: current === value ? null : value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setParam],
  );

  const handlePriceApply = useCallback(
    (min: string, max: string) => {
      setParam({ minPrice: min || null, maxPrice: max || null });
    },
    [setParam],
  );

  const activeCount =
    FILTER_SECTIONS.reduce((n, s) => n + (get(s.key) ? 1 : 0), 0) +
    (currentMinPrice || currentMaxPrice ? 1 : 0);

  const clearAll = useCallback(() => {
    setParam({
      minPrice: null, maxPrice: null,
      difficulty: null, duration: null, season: null, trekType: null,
    });
  }, [setParam]);

  return (
    <div
      className={`bg-white overflow-hidden transition-opacity duration-200 ${
        isPending ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-base font-bold text-[#0F4C81]">Filter by:</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-semibold text-[#1E88E5] hover:text-[#1565C0] transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="px-4 py-3">

        {/* Budget – dual range slider */}
        <FilterSection label="Your budget (per trek)">
          <PriceRangeSlider
            initialMin={currentMinPrice ? Number(currentMinPrice) : PRICE_MIN}
            initialMax={currentMaxPrice ? Number(currentMaxPrice) : PRICE_MAX}
            onApply={handlePriceApply}
          />
        </FilterSection>

        {/* Dynamic filter sections */}
        {FILTER_SECTIONS.map((section) => (
          <FilterSection key={section.key} label={section.label}>
            {section.options.map((opt) => (
              <CheckRow
                key={opt.value}
                label={opt.label}
                checked={get(section.key) === opt.value}
                onChange={() => toggle(section.key, opt.value)}
              />
            ))}
          </FilterSection>
        ))}
      </div>
    </div>
  );
}
