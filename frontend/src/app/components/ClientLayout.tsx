'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = ['/login', '/signup'].includes(pathname) || pathname.startsWith('/admin');

    return (
        <>
            {!hideChrome && <Header />}
            {children}
            {!hideChrome && <Footer />}
        </>
    );
}
