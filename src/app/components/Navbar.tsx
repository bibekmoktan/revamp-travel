'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../../../public/images/home/logo.svg';

export default function Navbar() {
    // Get current pathname to determine styling
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    
    // State to track which mega menu is currently open
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

    // Handle mouse enter on navigation items
    const handleMouseEnter = (menuName: string) => {
        setActiveMegaMenu(menuName);
    };

    // Handle mouse leave from navigation area
    const handleMouseLeave = () => {
        setActiveMegaMenu(null);
    };

    // Mega menu content for different navigation items
    const megaMenuContent = {
        packages: {
            title: 'Travel Packages',
            sections: [
                {
                    title: 'Popular Destinations',
                    links: [
                        { name: 'Nepal Himalaya Tours', href: '/packages/nepal-himalaya' },
                        { name: 'Everest Base Camp', href: '/packages/everest-base-camp' },
                        { name: 'Annapurna Circuit', href: '/packages/annapurna-circuit' },
                        { name: 'Langtang Valley', href: '/packages/langtang-valley' }
                    ]
                },
                {
                    title: 'Package Types',
                    links: [
                        { name: 'Adventure Tours', href: '/packages/adventure' },
                        { name: 'Cultural Tours', href: '/packages/cultural' },
                        { name: 'Luxury Tours', href: '/packages/luxury' },
                        { name: 'Budget Tours', href: '/packages/budget' }
                    ]
                }
            ]
        }
    };

    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <nav 
                className={`flex items-center justify-between sticky top-0 left-0 w-full z-50 px-6 md:px-16 py-4 h-[80px] max-w-[1320px] mx-auto w-full transition-all duration-300 ${
                    isHomePage 
                        ? 'backdrop-blur-md text-white' // Home page: transparent with white text
                        : 'text-white mt-8 rounded-[12px] bg-black/20 backdrop-blur-md' // Other pages: transparent background with white text
                }`}
                onMouseLeave={handleMouseLeave} // Close mega menu when leaving navbar area
            >

                {/* Logo - Now clickable to redirect to landing page */}
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="relative w-7 h-7">
                        <Image
                            src={logo}
                            alt="Viatours logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-lg font-semibold">HI-TRAVEL</span>
                </Link>

                {/* Nav Links with Mega Menu */}
                <div className="hidden md:flex items-center gap-[50px] text-sm lg:text-[16px] font-medium relative">
                    <div 
                        className="relative"
                        onMouseEnter={() => handleMouseEnter('packages')}
                    >
                        <Link 
                            href="/packages" 
                            className={`transition ${
                                isHomePage 
                                    ? 'hover:text-gray-300' // Home page hover: lighter gray
                                    : 'hover:text-white/80' // Other pages hover: white text
                            }`}
                        >
                            Packages
                        </Link>
                    </div>
                    
                    <Link 
                        href="/trekking" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-white/80' // Other pages hover: white text
                        }`}
                    >
                        Trekking in Nepal
                    </Link>
                    
                    <Link 
                        href="/blog" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-white/80' // Other pages hover: white text
                        }`}
                    >
                        Blog
                    </Link>
                    
                    <Link 
                        href="/shop" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-white/80' // Other pages hover: white text
                        }`}
                    >
                        Shop
                    </Link>
                    
                    <Link 
                        href="/our-team" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-white/80' // Other pages hover: white text
                        }`}
                    >
                        Our Team
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link 
                        href="/signup" 
                        className={`hidden md:inline transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-white/80' // Other pages hover: white text
                        }`}
                    >
                        Sign up
                    </Link>
                    <Link
                        href="/login"
                        className={`rounded-full px-6 h-10 flex items-center justify-center text-sm font-semibold transition ${
                            isHomePage 
                                ? 'bg-black text-white hover:bg-black/90' // Home page: black button
                                : 'bg-black text-white hover:bg-gray-800' // Other pages: black button
                        }`}
                    >
                        Log in
                    </Link>
                </div>
            </nav>

            {/* Mega Menu Dropdown - Fixed positioning for all pages */}
            {activeMegaMenu && megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent] && (
                <div 
                    className={`fixed w-full z-40 ${
                        isHomePage 
                            ? 'top-[80px]' // Home page: position right below navbar
                            : 'top-[112px]' // Other pages: account for mt-8 + navbar height
                    }`}
                    onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)} // Keep menu open when hovering over it
                    onMouseLeave={handleMouseLeave} // Close menu when leaving mega menu area
                >
                    <div className="flex justify-center">
                        <div className="w-full max-w-[800px] bg-sky-50 backdrop-blur-md shadow-2xl border-t border-gray-200 animate-fadeIn">
                            <div className="px-6 md:px-16 py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Mega menu title */}
                                    <div className="lg:col-span-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Discover amazing travel experiences with our curated selection.
                                        </p>
                                    </div>
                                    
                                    {/* Mega menu sections */}
                                    {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].sections.map((section, index) => (
                                        <div key={index} className="lg:col-span-1">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                                {section.title}
                                            </h4>
                                            <ul className="space-y-2">
                                                {section.links.map((link, linkIndex) => (
                                                    <li key={linkIndex}>
                                                        <Link 
                                                            href={link.href}
                                                            className="text-gray-600 hover:text-gray-900 transition text-sm py-1 block"
                                                            onClick={() => setActiveMegaMenu(null)} // Close menu when clicking a link
                                                        >
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

            {/* Custom CSS for fade-in animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </header>
    );
}
