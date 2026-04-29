'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, MessageCircle,
  Facebook, Instagram, Youtube, Star,
  ShieldCheck, Award, Headphones, ThumbsUp,
  ChevronRight, Send,
} from 'lucide-react';

const quickLinks = [
  { label: 'About Us',           href: '/about' },
  { label: 'Destinations',       href: '/destinations' },
  { label: 'Trekking Packages',  href: '/trekking' },
  { label: 'Luxury Tours',       href: '/trekking?category=luxury' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Contact',            href: '/contact-us' },
];

const popularTrips = [
  { label: 'Everest Base Camp Trek',  href: '/trekking?search=everest' },
  { label: 'Annapurna Circuit Trek',  href: '/trekking?search=annapurna' },
  { label: 'Helicopter Tour',         href: '/trekking?category=heli-tour' },
  { label: 'Luxury Nepal Tour',       href: '/trekking?category=luxury' },
];

const trustItems = [
  { icon: Award,       label: 'Certified Guides',       sub: 'Licensed & experienced' },
  { icon: ShieldCheck, label: 'Secure Booking',         sub: '100% safe & encrypted' },
  { icon: Headphones,  label: 'Local Support',          sub: '24/7 on-ground help' },
  { icon: ThumbsUp,    label: 'Customer Satisfaction',  sub: '98% happy travelers' },
];

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: <Facebook className="w-4 h-4" />,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: <Instagram className="w-4 h-4" />,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: <Youtube className="w-4 h-4" />,
  },
  {
    label: 'TripAdvisor',
    href: 'https://tripadvisor.com',
    icon: <Star className="w-4 h-4" />,
  },
];

const legalLinks = [
  { label: 'Privacy Policy',      href: '/privacy-policy' },
  { label: 'Terms & Conditions',  href: '/terms' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <footer className="bg-[#0B1B2B] text-white">

      {/* ── Associations bar ── */}
      <div className="border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 shrink-0">
            We&apos;re associated with
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { abbr: 'GON',  name: 'Govt. of Nepal' },
              { abbr: 'NTB',  name: 'Nepal Tourism Board' },
              { abbr: 'NMA',  name: 'Nepal Mountaineering Assoc.' },
              { abbr: 'TAAN', name: 'Trekking Agencies Assoc.' },
              { abbr: 'KEEP', name: 'Kathmandu Env. Education Project' },
            ].map(({ abbr, name }) => (
              <div key={abbr} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
                <span className="text-xs font-extrabold text-white tracking-wide">{abbr}</span>
                <span className="text-[10px] text-white/40 hidden sm:block">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-800/40 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                <p className="text-xs text-white/50 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Company */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xl font-bold tracking-wide text-white mb-1">HI-TRAVEL</p>
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-4">
            Trusted local travel experts in Nepal
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            We craft unforgettable Himalayan journeys — from iconic treks to bespoke luxury tours — backed by over <span className="text-white font-medium">20 years</span> of expertise and a deep love for Nepal.
          </p>

          {/* Socials */}
          <div className="flex gap-2 mb-6">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-sky-700 hover:border-sky-700 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">
            Get travel tips & exclusive offers
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-0 overflow-hidden border border-white/15 rounded-sm">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {subscribed ? 'Done!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="group flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Popular Trips */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
            Popular Trips
          </h4>
          <ul className="space-y-3">
            {popularTrips.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="group flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
            Get In Touch
          </h4>
          <ul className="space-y-4">
            <li>
              <a href="tel:+61481712113" className="flex items-start gap-3 text-sm text-white/65 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>+61 481 712 113</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@highspiritsnepal.com" className="flex items-start gap-3 text-sm text-white/65 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>info@highspiritsnepal.com</span>
              </a>
            </li>
            <li>
              <div className="flex items-start gap-3 text-sm text-white/65">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Thamel, Kathmandu<br />Nepal, 44600</span>
              </div>
            </li>
            <li>
              <a
                href="https://wa.me/61481712113"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 bg-green-700/80 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright + Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-white/35">
            <span>© {new Date().getFullYear()} HI-TRAVEL Nepal. All rights reserved.</span>
            <span className="hidden sm:block text-white/20">|</span>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {legalLinks.map(({ label, href }) => (
                <Link key={label} href={href} className="hover:text-white/70 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'PayPal'].map((name) => (
              <div
                key={name}
                className="bg-white/10 border border-white/10 rounded px-2.5 py-1 text-[10px] font-bold text-white/50 tracking-wide"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
