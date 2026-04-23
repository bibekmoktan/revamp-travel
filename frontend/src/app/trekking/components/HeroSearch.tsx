'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value.trim();
    const params = new URLSearchParams();
    if (val) params.set('searchTerm', val);
    router.push(`/trekking#packages${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <Search className="w-5 h-5 text-[#607D8B] ml-5 shrink-0" />
      <input
        name="search"
        type="text"
        placeholder="Search treks, destinations…"
        className="flex-1 px-4 py-4 text-[#37474F] text-base placeholder:text-[#607D8B] focus:outline-none bg-transparent"
      />
      <button
        type="submit"
        className="m-1.5 px-7 py-3 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-xl transition-colors duration-200 shrink-0"
      >
        Search
      </button>
    </form>
  );
}
