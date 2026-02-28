'use client';

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import Header from './components/Header'
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname to determine if we should show header/footer
  const pathname = usePathname();
  
  // Define auth pages where we don't want header/footer
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(pathname);

  return (
    <html lang="en" className={inter.variable}>
      <head />
      <body className="bg-white text-black">
        {/* Only show Header if not on auth pages */}
        {!isAuthPage && <Header />}
        
        {children}
        
        {/* Only show Footer if not on auth pages */}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
