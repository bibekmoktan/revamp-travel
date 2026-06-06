import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import ContactPage from '../components/Contact/Contact';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our travel experts to plan your perfect Himalayan adventure. We respond within 24 hours.',
  alternates: { canonical: `${SITE_URL}/contact-us` },
  openGraph: { url: `${SITE_URL}/contact-us`, title: 'Contact Us', description: 'Get in touch with our travel experts to plan your perfect Himalayan adventure.' },
};

/**
 * Main Trekking Route Page
 * This is the entry point for /contact-us route
 * All logic is handled by the ContactPage component
 */     
export default function Page() {
  return <ContactPage />;
} 