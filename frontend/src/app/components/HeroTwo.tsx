"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeroTwo() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  }

  return (
    <section className="w-full bg-[#FAFFFF] min-h-[600px]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 min-h-[600px] gap-8">

        {/* Left — content */}
        <div className="flex flex-col justify-center py-16 pr-0 lg:pr-12">
          <p className="text-xs font-semibold text-[#0F4C81] uppercase tracking-widest mb-3">
            Handcrafted Adventures Since 2005
          </p>
          <h2 className="text-3xl md:text-[42px] font-bold text-gray-900 leading-[1.2] mb-5">
            Explore the World with<br />
            <span className="text-[#0F4C81]">20+ Years</span> of Trusted Expertise
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-[480px]">
            Tailor-made tours, expert local guides, and seamless travel experiences across Nepal and beyond. Your adventure starts here.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="/custom-package"
              className="px-6 py-3.5 bg-[#0F4C81] text-white font-semibold text-sm hover:bg-sky-800 transition"
            >
              Customize Your Journey
            </Link>
            <Link
              href="/trekking"
              className="px-6 py-3.5 border border-[#0F4C81] text-[#0F4C81] font-semibold text-sm hover:bg-[#0F4C81]/5 transition"
            >
              Explore Tours
            </Link>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-8">
            {[
              { value: '20+',  label: 'Years Experience' },
              { value: '1K+',  label: 'Happy Travelers' },
              { value: '100%', label: 'Certified Guides' },
              { value: '24/7', label: 'Local Support' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-8 bg-gray-200" />}
                <div>
                  <p className="text-2xl font-bold text-[#0F4C81] leading-none">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Quick Enquiry Form */}
        <div className="flex items-center justify-center py-16">
          <div className="w-full max-w-[460px] border border-gray-200 rounded-2xl p-8 shadow-lg bg-[#FAFDFF]">

            <h3 className="text-xl font-bold text-gray-900 mb-1">Quick Enquiry</h3>
            <p className="text-sm text-gray-400 mb-6">Our team will get back to you within 24 hours.</p>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Message Sent!</p>
                <p className="text-sm text-gray-400">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition"
                />

                <textarea
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your trip..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0F4C81] text-white font-semibold text-sm rounded-xl hover:bg-sky-800 transition"
                >
                  Send Enquiry
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
