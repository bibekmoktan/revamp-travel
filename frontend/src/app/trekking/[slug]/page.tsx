import { notFound } from 'next/navigation';
import { getPackageBySlug, getPackages } from '@/lib/api';
import TrekDetailPage from './components/TrekDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { data: pkg } = await getPackageBySlug(slug);
    return {
      title: `${pkg.title} | Travel Nepal`,
      description: pkg.description.slice(0, 160),
      keywords: `trek, trekking, ${pkg.location}, ${pkg.difficulty}, Nepal, Himalayas`,
    };
  } catch {
    return { title: 'Trek Not Found | Travel Nepal' };
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

  return <TrekDetailPage pkg={pkg} addOns={addOns} />;
}
