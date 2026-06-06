import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/icons/logo.jpg';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col">

      {/* Minimal nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image src={logo} alt="Himalayan Highspirits Adventure logo" fill className="object-contain" priority />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-[14px] font-bold text-sky-900">Himalayan High</span>
              <span className="text-[14px] font-bold text-sky-900 tracking-wide">Spirits Adventure</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg">

          {/* Mountain SVG illustration */}
          <div className="mb-8 flex justify-center">
            <svg
              viewBox="0 0 320 200"
              className="w-72 h-44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky */}
              <rect width="320" height="200" rx="16" fill="#EFF6FF" />
              {/* Back mountains */}
              <polygon points="240,160 290,60 340,160" fill="#BAE6FD" />
              <polygon points="180,160 240,50 300,160" fill="#93C5FD" />
              {/* Front mountains */}
              <polygon points="0,160 80,30 160,160" fill="#0369A1" />
              <polygon points="100,160 185,55 270,160" fill="#0284C7" />
              {/* Snow caps */}
              <polygon points="80,30 65,70 95,70" fill="white" opacity="0.9" />
              <polygon points="185,55 170,90 200,90" fill="white" opacity="0.9" />
              {/* Ground */}
              <rect y="158" width="320" height="42" rx="0" fill="#0F4C81" />
              {/* 404 text on ground */}
              <text x="160" y="185" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">
                404
              </text>
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Lost in the Himalayas?
          </h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            The trail you&apos;re looking for doesn&apos;t exist or may have moved.
            Let&apos;s get you back on the right path.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Back to Home
            </Link>
            <Link
              href="/trekking"
              className="inline-flex items-center justify-center gap-2 border border-sky-600 text-sky-700 hover:bg-sky-50 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Explore Treks
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Popular destinations</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Everest Base Camp', href: '/trekking?searchTerm=everest+base+camp' },
                { label: 'Annapurna Circuit', href: '/trekking?searchTerm=annapurna+circuit' },
                { label: 'Langtang Valley',   href: '/trekking?searchTerm=langtang' },
                { label: 'Custom Package',    href: '/custom-package' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs bg-white border border-gray-200 text-gray-600 hover:border-sky-400 hover:text-sky-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
