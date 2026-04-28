import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import LenisProvider from './components/LenisProvider';
import ClientLayout from './components/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white text-black">
        <AuthProvider>
          <CartProvider>
            <LenisProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </LenisProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
