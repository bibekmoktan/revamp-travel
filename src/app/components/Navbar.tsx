'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../../public/images/home/logo.svg';

export default function Navbar() {
    // Get current pathname to determine styling
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <nav className={`flex items-center justify-between sticky top-0 left-0 w-full z-50 px-6 md:px-16 py-4 h-[80px] max-w-[1320px] mx-auto w-full transition-all duration-300 ${
                isHomePage 
                    ? 'backdrop-blur-md text-white' // Home page: transparent with white text
                    : 'text-white mt-8 rounded-[12px] bg-black/20 backdrop-blur-md' // Other pages: transparent background with white text
            }`}>

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
                    <span className="text-lg font-semibold">viatours</span>
                </Link>

                {/* Nav Links - Home button removed */}
                <div className="hidden md:flex items-center gap-[50px] text-sm lg:text-[16px] font-medium">
                    <Link 
                        href="/tour-details" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-gray-600' // Other pages hover: darker gray
                        }`}
                    >
                        Tours
                    </Link>
                    <Link 
                        href="/trekking" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-gray-600' // Other pages hover: darker gray
                        }`}
                    >
                        Trekking
                    </Link>
                    <Link 
                        href="/blog" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-gray-600' // Other pages hover: darker gray
                        }`}
                    >
                        Blog
                    </Link>
                    <Link 
                        href="/shop" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-gray-600' // Other pages hover: darker gray
                        }`}
                    >
                        Shop
                    </Link>
                    <Link 
                        href="/our-team" 
                        className={`transition ${
                            isHomePage 
                                ? 'hover:text-gray-300' // Home page hover: lighter gray
                                : 'hover:text-gray-600' // Other pages hover: darker gray
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
                                : 'hover:text-gray-600' // Other pages hover: darker gray
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
        </header>
    );
}
