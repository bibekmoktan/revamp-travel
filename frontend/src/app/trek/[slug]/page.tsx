import { redirect } from 'next/navigation';

export default async function TrekPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/trekking/${slug}`);
}
