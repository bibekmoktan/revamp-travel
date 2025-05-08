import "./globals.css";
import { Inter } from "next/font/google";
import Header from './components/Header'
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head />
      <body className="bg-white text-black">
        <Header />  
        {children}
        <Footer />
      </body>
    </html>
  );
}
