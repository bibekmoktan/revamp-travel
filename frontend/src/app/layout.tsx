'use client';

import "./globals.css";
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from "./components/Footer";
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = ['/login', '/signup'].includes(pathname) || pathname.startsWith('/admin');

  return (
    <html lang="en">
      <head />
      <body className="bg-white text-black">
        <AuthProvider>
          {!hideChrome && <Header />}
          {children}
          {!hideChrome && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
