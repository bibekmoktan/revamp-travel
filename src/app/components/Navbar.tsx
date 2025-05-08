'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/images/home/logo.svg';

export default function Navbar() {
    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <nav className="flex items-center justify-between px-6 md:px-16 py-4 backdrop-blur-md text-white h-[80px] max-w-[1320px] mx-auto w-full">

                {/* Logo */}
                <div className="flex items-center gap-2">
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
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-[50px] text-sm lg:text-[16px] font-medium">
                    {['Home', 'Treking', 'Blog', 'Shop', 'About'].map((label) => (
                        <Link key={label} href={label} className="hover:text-gray-900 transition">
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link href="#" className="hidden md:inline hover:text-black">
                        Sign up
                    </Link>
                    <Link
                        href="#"
                        className="bg-black text-white rounded-full px-6 h-10 flex items-center justify-center text-sm font-semibold hover:bg-black/90 transition"
                    >
                        Log in
                    </Link>

                </div>
            </nav>
        </header>
    );
}
