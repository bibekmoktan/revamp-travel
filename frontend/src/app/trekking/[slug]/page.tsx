import { notFound } from 'next/navigation';
import { getPackageBySlug, getPackages } from '@/lib/api';
import TrekDetailPage from './components/TrekDetailPage';
import { SITE_URL, SITE_NAME, trekJsonLd } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { data: pkg } = await getPackageBySlug(slug);
    const canonical = `${SITE_URL}/trekking/${slug}`;
    const ogImage   = pkg.featureImage?.url ?? `${SITE_URL}/og-default.jpg`;
    const description = pkg.description.slice(0, 160);
    return {
      title: pkg.title,
      description,
      keywords: `${pkg.title}, trekking Nepal, ${pkg.location}, ${pkg.difficulty ?? ''} trek, Himalayan adventure, ${SITE_NAME}`,
      alternates: { canonical },
      openGraph: {
        type: 'website',
        url: canonical,
        title: pkg.title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: pkg.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: pkg.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Trek Not Found' };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let pkg;
  try {
    const result = await getPackageBySlug(slug);
    pkg = result.data;
  } catch {
    notFound();
  }

  let addOns: import('@/types/api').ApiPackage[] = [];
  try {
    const { data } = await getPackages({ category: pkg.category, limit: 7 });
    addOns = data.filter(p => p.slug !== slug).slice(0, 6);
  } catch {
    // non-critical, proceed without add-ons
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trekJsonLd(pkg)) }}
      />
      <TrekDetailPage pkg={pkg} addOns={addOns} />
    </>
  );
}
