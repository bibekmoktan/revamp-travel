import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import LenisProvider from './components/LenisProvider';
import ClientLayout from './components/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white text-black">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LenisProvider>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </LenisProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
