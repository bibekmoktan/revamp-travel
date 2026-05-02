"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Adventure Enthusiast",
    text: "I've traveled with many agencies, but this one stands out. The Nepal trek was perfectly planned and every moment felt personal and thoughtful.",
    initials: "SJ",
    color: "bg-orange-200 text-orange-700",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Travel Blogger",
    text: "From the moment I landed, everything was seamless. The local knowledge and hospitality made my Nepal journey truly world-class.",
    initials: "MC",
    color: "bg-sky-200 text-sky-700",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Cultural Explorer",
    text: "They didn't just take me to tourist spots — they immersed me in the real Nepal. An authentic, life-changing experience.",
    initials: "ER",
    color: "bg-purple-200 text-purple-700",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Family Traveler",
    text: "Our family trip to Nepal was stress-free and magical. The team handled every detail so we could focus on making memories.",
    initials: "DT",
    color: "bg-green-200 text-green-700",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Solo Traveler",
    text: "Traveling solo felt completely safe and supported. From airport pickup to guided treks, everything was taken care of beautifully.",
    initials: "PS",
    color: "bg-teal-200 text-teal-700",
  },
  {
    id: 6,
    name: "James Walker",
    role: "Luxury Traveler",
    text: "Exceptional attention to detail and premium experiences throughout. Nepal has never felt more grand or welcoming.",
    initials: "JW",
    color: "bg-indigo-200 text-indigo-700",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 md:px-16 py-16 bg-gray-50">
      <div className="max-w-[1320px] mx-auto">

        <div className="mb-10">
          <p className="text-sky-600 font-semibold text-sm mb-2">Traveler Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-md leading-tight">
            Voices From Those Who Explored Nepal With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/testimonials"
            className="flex items-center gap-2 px-6 py-3 bg-sky-800 text-white text-sm font-semibold rounded-full hover:bg-sky-900 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
