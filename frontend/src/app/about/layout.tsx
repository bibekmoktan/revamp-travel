import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us — Our Story & Mission',
  description: 'Learn about Himalayan High Spirits Adventure — our history, our guides, and our commitment to responsible trekking in Nepal, Bhutan, and Tibet.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    url: `${SITE_URL}/about`,
    title: 'About Us — Our Story & Mission',
    description: 'Learn about Himalayan High Spirits Adventure — our history, our guides, and our commitment to responsible trekking.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
