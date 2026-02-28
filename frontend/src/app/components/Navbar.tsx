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
    
    // State to track mobile menu visibility
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle mouse enter on navigation items
    const handleMouseEnter = (menuName: string) => {
        setActiveMegaMenu(menuName);
    };

    // Handle mouse leave from navigation area
    const handleMouseLeave = () => {
        setActiveMegaMenu(null);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking on a link
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
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

                {/* Desktop Nav Links with Mega Menu - Hidden on mobile and tablet */}
                <div className="hidden lg:flex items-center gap-[50px] text-sm lg:text-[16px] font-medium relative">
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

                {/* Right Side - Desktop Contact Button and Mobile Menu Button */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    {/* Plan Your Trip Button - Hidden on mobile, visible on tablet and desktop */}
                    <Link
                        href="/custom-package"
                        className={`hidden md:flex rounded-[12px] px-6 h-[48px] items-center justify-center text-sm font-semibold transition ${
                            isHomePage 
                                ? 'bg-sky-700 text-white hover:bg-sky-800 ' // Home page: transparent with border
                                : 'bg-sky-700 text-white hover:bg-sky-800 ' // Other pages: transparent with border
                        }`}
                    >
                        Plan Your Trip
                    </Link>

                    {/* Contact Button - Hidden on mobile, visible on tablet and desktop */}
                    <Link
                        href="/contact-us"
                        className={`hidden md:flex rounded-[12px] px-6 h-[48px] items-center justify-center text-sm font-semibold transition ${
                            isHomePage 
                                ? 'bg-sky-700 text-white hover:bg-sky-800' // Home page: black button
                                : 'bg-sky-700 text-white hover:bg-sky-800' // Other pages: black button
                        }`}
                    >
                        Quick Inquiry
                    </Link>

                    {/* Hamburger Menu Button - Visible only on mobile and tablet (up to 1024px) */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        {/* Hamburger icon lines with animation */}
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown - Visible only when hamburger is clicked */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-[80px] left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 z-40 animate-slideDown">
                    <div className="px-6 py-6 max-w-[1320px] mx-auto">
                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col space-y-4">
                            <Link 
                                href="/packages" 
                                className="text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium"
                                onClick={closeMobileMenu}
                            >
                                Packages
                            </Link>
                            
                            <Link 
                                href="/trekking" 
                                className="text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium"
                                onClick={closeMobileMenu}
                            >
                                Trekking in Nepal
                            </Link>
                            
                            <Link 
                                href="/blog" 
                                className="text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium"
                                onClick={closeMobileMenu}
                            >
                                Blog
                            </Link>
                            
                            <Link 
                                href="/shop" 
                                className="text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium"
                                onClick={closeMobileMenu}
                            >
                                Shop
                            </Link>
                            
                            <Link 
                                href="/our-team" 
                                className="text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium"
                                onClick={closeMobileMenu}
                            >
                                Our Team
                            </Link>

                            {/* Mobile Plan Your Trip Button */}
                            <Link
                                href="/plan-trip"
                                className="bg-white/10 text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-[12px] px-6 py-3 text-center font-semibold transition mt-4"
                                onClick={closeMobileMenu}
                            >
                                Plan Your Trip
                            </Link>

                            {/* Mobile Contact Button */}
                            <Link
                                href="/contact-us"
                                className="bg-sky-700 text-white hover:bg-sky-800 rounded-[12px] px-6 py-3 text-center font-semibold transition mt-4"
                                onClick={closeMobileMenu}
                            >
                                Quick Inquiry
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Mega Menu Dropdown - Only visible on desktop screens */}
            {activeMegaMenu && megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent] && (
                <div 
                    className={`hidden lg:block fixed w-full z-40 ${
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

            {/* Custom CSS for animations */}
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
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </header>
    );
}
