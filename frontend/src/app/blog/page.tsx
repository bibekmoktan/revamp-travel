import type { Metadata } from 'next';
import { BlogListClient, NewsletterSignup } from '@/app/components/blog';
import { getAllPosts, getFeaturedPosts } from '@/lib/sanity/fetch';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Travel Blog — Trekking Tips, Route Guides & Nepal Travel Advice',
  description: 'Expert trekking tips, Himalayan route guides, packing lists, and Nepal travel advice from our guides and past adventurers.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: { url: `${SITE_URL}/blog`, title: 'Travel Blog — Trekking Tips & Nepal Travel Advice', description: 'Expert trekking tips, route guides, and Nepal travel advice from our Himalayan guides.' },
};

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, featuredPosts] = await Promise.all([
    getAllPosts(),
    getFeaturedPosts(),
  ]);

  const categories = Array.from(
    new Set(posts.map((p) => p.category?.title).filter((t): t is string => Boolean(t)))
  );
  const categoriesWithAll = ['All', ...categories];

  return (
    <div className="min-h-screen bg-gray-50 mt-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogListClient
          posts={posts}
          featuredPosts={featuredPosts}
          categories={categoriesWithAll}
        />

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Articles
          </button>
        </div>

        <NewsletterSignup />
      </div>
    </div>
  );
}
