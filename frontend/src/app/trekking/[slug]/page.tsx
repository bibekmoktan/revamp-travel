import { notFound } from 'next/navigation';
import { getPackageBySlug } from '@/lib/api';
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

  return <TrekDetailPage pkg={pkg} />;
}
