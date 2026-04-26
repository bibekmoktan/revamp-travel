'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { User, ShoppingCart, Heart } from 'lucide-react';
import logo from '../../../public/images/home/logo.svg';
import HeroSearch from './HeroSearch';

export default function Navbar() {
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMouseEnter = (menuName: string) => setActiveMegaMenu(menuName);
    const handleMouseLeave = () => setActiveMegaMenu(null);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const megaMenuContent = {
        packages: {
            title: 'Travel Packages',
            sections: [
                {
                    title: 'By Category',
                    links: [
                        { name: '🥾 Trekking in Nepal', href: '/trekking?category=trekking' },
                        { name: '🏔️ Peak Climbing',     href: '/trekking?category=peak-climbing' },
                        { name: '🚁 Heli Tour',          href: '/trekking?category=heli-tour' },
                        { name: '🌄 One Day Tour',       href: '/trekking?category=one-day-tour' },
                    ]
                },
                {
                    title: 'Curated Lists',
                    links: [
                        { name: 'Best Seller',          href: '/trekking' },
                        { name: 'Top Destinations',     href: '/destinations' },
                        { name: 'Trending Now',         href: '/destinations' },
                        { name: 'Custom Package',       href: '/custom-package' },
                    ]
                }
            ]
        },
        destinations: {
            title: 'Destinations',
            sections: [
                {
                    title: 'By Region',
                    links: [
                        { name: 'Everest Region',    href: '/destinations/everest-region' },
                        { name: 'Annapurna Region',  href: '/destinations/annapurna-region' },
                        { name: 'Langtang Region',   href: '/destinations/langtang-region' },
                        { name: 'Manaslu Region',    href: '/destinations/manaslu-region' },
                        { name: 'Mustang Region',    href: '/destinations/mustang-region' },
                        { name: 'Dolpa Region',      href: '/destinations/dolpa-region' },
                    ]
                },
                {
                    title: 'Trending Places',
                    links: [
                        { name: 'Upper Mustang',     href: '/destinations/upper-mustang' },
                        { name: 'Pokhara',           href: '/destinations/pokhara' },
                        { name: 'Chitwan',           href: '/destinations/chitwan' },
                        { name: 'Kathmandu Valley',  href: '/destinations/kathmandu-valley' },
                        { name: 'Rara Lake',         href: '/destinations/rara-lake' },
                        { name: 'Eastern Nepal',     href: '/destinations/eastern-nepal' },
                    ]
                }
            ]
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            {/* Top Bar */}
            <div className="bg-[#607D8B] w-full">
                <div className="max-w-[1320px] mx-auto px-6 md:px-16 h-10 flex items-center justify-between text-white text-sm">
                    {/* Left — Social + Contact */}
                    <div className="flex items-center gap-5">
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                        </Link>
                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </Link>
                        <Link href="https://wa.me/61481712113" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </Link>

                        <span className="text-white/40">|</span>

                        <Link href="tel:+61481712113" className="flex items-center gap-1.5 hover:text-white/80 transition">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
                            </svg>
                            +61481712113
                        </Link>

                        <span className="text-white/40">|</span>

                        <Link href="mailto:info@highspiritsnepal.com" className="flex items-center gap-1.5 hover:text-white/80 transition">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            info@highspiritsnepal.com
                        </Link>
                    </div>

                    {/* Right — Wishlist, Cart, Login */}
                    <div className="flex items-center gap-4">
                        <Link href="/wishlist" aria-label="Wishlist" className="hover:text-white/80 transition">
                            <Heart className="w-4 h-4" />
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="hover:text-white/80 transition">
                            <ShoppingCart className="w-4 h-4" />
                        </Link>
                        <span className="text-white/40">|</span>
                        <Link href="/login" aria-label="Login" className="flex items-center gap-1.5 hover:text-white/80 transition text-xs">
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="bg-white border-b border-gray-200 shadow-sm w-full">
                <nav
                    className="flex items-center justify-between w-full px-6 md:px-16 h-[80px] max-w-[1320px] mx-auto gap-6"
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                        <div className="relative w-7 h-7">
                            <Image src={logo} alt="HI-TRAVEL logo" fill className="object-contain" priority />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">HI-TRAVEL</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-700 shrink-0">
                        <div className="relative" onMouseEnter={() => handleMouseEnter('packages')}>
                            <Link href="/packages" className="hover:text-sky-700 transition">Packages</Link>
                        </div>
                        <Link href="/trekking" className="hover:text-sky-700 transition whitespace-nowrap">Trekking in Nepal</Link>
                        <Link href="/blog" className="hover:text-sky-700 transition">Blog</Link>
                        <div className="relative" onMouseEnter={() => handleMouseEnter('destinations')}>
                            <Link href="/destinations" className="hover:text-sky-700 transition">Destinations</Link>
                        </div>
                        <Link href="/our-team" className="hover:text-sky-700 transition whitespace-nowrap">Our Team</Link>
                    </div>

                    {/* Search — takes remaining space */}
                    <div className="hidden lg:block flex-1 max-w-[340px]">
                        <HeroSearch />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/contact-us"
                            className="hidden md:flex px-5 h-[40px] items-center justify-center text-sm font-semibold bg-sky-700 text-white hover:bg-sky-800 transition whitespace-nowrap"
                        >
                            Quick Inquiry
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                            aria-label="Toggle mobile menu"
                        >
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden w-full bg-white shadow-lg border-t border-gray-200 animate-slideDown">
                    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-4">
                        {/* Mobile Search */}
                        <HeroSearch />

                        <Link href="/packages" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Packages</Link>
                        <Link href="/trekking" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Trekking in Nepal</Link>
                        <Link href="/blog" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Blog</Link>
                        <Link href="/destinations" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Destinations</Link>
                        <Link href="/our-team" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Our Team</Link>
                        <Link href="/custom-package" className="block border border-gray-300 text-gray-900 hover:bg-gray-100 rounded-xl px-6 py-3 text-center font-semibold transition mt-2" onClick={closeMobileMenu}>Plan Your Trip</Link>
                        <Link href="/contact-us" className="block bg-sky-700 text-white hover:bg-sky-800 rounded-xl px-6 py-3 text-center font-semibold transition" onClick={closeMobileMenu}>Quick Inquiry</Link>
                    </div>
                </div>
            )}

            {/* Mega Menu */}
            {activeMegaMenu && megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent] && (
                <div
                    className="hidden lg:block fixed top-[120px] w-full z-40"
                    onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex justify-center">
                        <div className="w-full max-w-[800px] bg-sky-50 shadow-2xl border-t border-gray-200 animate-fadeIn">
                            <div className="px-8 py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">Discover amazing travel experiences with our curated selection.</p>
                                    </div>
                                    {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].sections.map((section, i) => (
                                        <div key={i}>
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">{section.title}</h4>
                                            <ul className="space-y-2">
                                                {section.links.map((link, j) => (
                                                    <li key={j}>
                                                        <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition text-sm py-1 block" onClick={() => setActiveMegaMenu(null)}>
                                                            {link.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
            `}</style>
        </header>
    );
}
