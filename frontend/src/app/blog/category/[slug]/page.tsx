import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import BlogCard from '@/app/components/blog/BlogCard';
import { getPostsByCategory } from '@/lib/sanity/fetch';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const categoryTitle = posts[0]?.category?.title ?? slug;
  return {
    title: `${categoryTitle} | Travel Nepal Blog`,
    description: `Articles in the ${categoryTitle} category.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);

  if (posts.length === 0) notFound();

  const categoryTitle = posts[0]?.category?.title ?? slug;

  return (
    <div className="min-h-screen bg-gray-50 mt-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900 mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          All articles
        </Link>

        <div className="mb-10">
          <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide mb-2">Category</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{categoryTitle}</h1>
          <p className="text-gray-600 mt-2">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
