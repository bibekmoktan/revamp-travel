import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import CustomPackage from '../components/CustomPackage/CustomPackage';

export const metadata: Metadata = {
  title: 'Customise Your Trek — Build a Personalised Package',
  description: 'Tell us your dream itinerary and our experts will craft a personalised Nepal trekking or adventure package just for you. Custom duration, group size, accommodation, and budget.',
  alternates: { canonical: `${SITE_URL}/custom-package` },
  openGraph: { url: `${SITE_URL}/custom-package`, title: 'Customise Your Trek', description: 'Build a personalised Nepal adventure package tailored to your dates, group, and budget.' },
};

/**
 * Main Trekking Route Page
 * This is the entry point for /contact-us route
 * All logic is handled by the ContactPage component
 */     
export default function Page() {
  return <CustomPackage />;
} 