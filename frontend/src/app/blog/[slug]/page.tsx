import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ChevronLeft, Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Link as LinkIcon } from 'lucide-react';
import BlogCard from '@/app/components/blog/BlogCard';
import PostBody from '@/app/components/blog/PostBody';
import TableOfContents from '@/app/components/blog/TableOfContents';
import { getAllSlugs, getPostBySlug, getPostsByCategory } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/client';
import { formatPostDate } from '@/lib/sanity/format';
import { slugify } from '@/lib/sanity/slugify';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article not found' };

  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://highspiritsnepal.com'}/blog/${slug}`;
  const ogImage   = post.image ? urlFor(post.image).width(1200).height(630).fit('crop').url() : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categoryPosts = post.category?.slug
    ? await getPostsByCategory(post.category.slug)
    : [];
  const related = categoryPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const authorName = post.author?.name ?? 'Unknown';
  const initials = authorName.split(' ').map((n) => n[0]).join('');
  const heroImageUrl = urlFor(post.image).width(2000).height(1100).fit('crop').url();
  const formattedDate = formatPostDate(post.date);

  type PtBlock = { _type?: string; style?: string; children?: { text?: string }[] };
  const tocEntries = ((post.content ?? []) as PtBlock[])
    .filter((b) => b?._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => {
      const text = (b.children ?? []).map((c) => c?.text ?? '').join('');
      return { text, id: slugify(text), level: b.style ?? 'h2' };
    })
    .filter((e) => e.text.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 mt-[100px]">

      {/* Article hero */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900 mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to all articles
        </Link>

        <div className="mb-4">
          {post.category?.slug ? (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="inline-block bg-sky-100 text-sky-700 hover:bg-sky-200 px-3 py-1 rounded-md text-xs font-medium transition-colors"
            >
              {post.category.title}
            </Link>
          ) : (
            <span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-xs font-medium">
              Uncategorized
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {post.author?.avatar ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={urlFor(post.author.avatar).width(80).height(80).fit('crop').url()}
                  alt={post.author.avatar.alt ?? authorName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">{initials}</span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{authorName}</p>
              <p className="text-xs text-gray-500">Travel writer</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[440px] rounded-xl overflow-hidden shadow-md">
          <Image
            src={heroImageUrl}
            alt={post.image.alt ?? post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1000px) 100vw, 1000px"
          />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-[150px] space-y-6">

              <TableOfContents entries={tocEntries} />

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-sky-700" />
                  <h4 className="text-sm font-bold text-gray-900">Subscribe</h4>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  Get trekking tips and trip updates straight to your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold py-2 rounded-md transition-colors"
                  >
                    Subscribe Newsletter
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Follow us
                </h4>
                <div className="flex items-center gap-3 text-gray-500">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-sky-800 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-800 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-sky-800 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-sky-800 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-sky-800 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </aside>

          <article className="flex-1 min-w-0">
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="bg-sky-100 rounded-xl px-6 sm:px-8 py-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Takeaways</h3>
                <ul className="space-y-3">
                  {post.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex gap-3 text-[15px] text-gray-700 leading-relaxed">
                      <span className="text-[#0F4C81] font-bold shrink-0 mt-0.5">»</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {post.content && post.content.length > 0 ? (
              <PostBody value={post.content} />
            ) : (
              <p className="text-gray-700 leading-relaxed text-base">{post.excerpt}</p>
            )}

            {post.finalThoughts && post.finalThoughts.content?.length > 0 && (
              <div className="bg-gray-100 rounded-xl px-6 sm:px-8 py-6 mt-10">
                {post.finalThoughts.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {post.finalThoughts.title}
                  </h3>
                )}
                <PostBody value={post.finalThoughts.content} />
              </div>
            )}

            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Share this article:</span>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-700 flex items-center justify-center transition-colors" aria-label="Share on Facebook">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-700 flex items-center justify-center transition-colors" aria-label="Share on Twitter">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-700 flex items-center justify-center transition-colors" aria-label="Share on LinkedIn">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-700 flex items-center justify-center transition-colors" aria-label="Copy link">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </article>

        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
