import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ChevronLeft, Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Link as LinkIcon } from 'lucide-react';
import { blogPosts } from '@/data/blog/blogData';
import BlogCard from '@/app/components/blog/BlogCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: `${post.title} | Travel Nepal Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const initials = post.author
    .split(' ')
    .map((n) => n[0])
    .join('');

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

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
          <span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-md text-xs font-medium">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

        {/* Author / meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">Travel writer</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
        </div>
      </div>

      {/* Hero image — full width of 1366px container */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[440px] rounded-xl overflow-hidden shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1000px) 100vw, 1000px"
          />
        </div>
      </div>

      {/* Body — two-column: TOC sidebar (left) + article (right) */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left sidebar — TOC + Subscribe + Socials */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-[150px] space-y-6">

              {/* Table of contents */}
              {post.content && post.content.some((b) => b.heading) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    In this article
                  </h4>
                  <nav className="border-l border-gray-200">
                    <ul className="space-y-1">
                      {post.content
                        .map((b, i) => ({ ...b, i }))
                        .filter((b) => !!b.heading)
                        .map((b) => {
                          const id = `section-${b.i}`;
                          return (
                            <li key={id}>
                              <a
                                href={`#${id}`}
                                className="block text-sm text-gray-600 hover:text-sky-700 hover:border-sky-700 -ml-px pl-3 py-1 border-l-2 border-transparent transition-colors"
                              >
                                {b.heading}
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Subscribe newsletter card */}
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

              {/* Social icons */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Follow us
                </h4>
                <div className="flex items-center gap-3 text-gray-500">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-sky-800 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-sky-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="hover:text-sky-800 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-sky-800 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="hover:text-sky-800 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </aside>

          {/* Article body */}
          <article className="flex-1 min-w-0">
            {/* Key Takeaways */}
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
              <div className="space-y-6">
                {post.content.map((block, i) => (
                  <div key={i} id={`section-${i}`} className="scroll-mt-[120px]">
                    {block.heading && (
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {block.heading}
                      </h2>
                    )}
                    <p className="text-gray-700 leading-relaxed text-base">{block.paragraph}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed text-base">{post.excerpt}</p>
            )}

            {/* Final Thoughts */}
            {post.finalThoughts && post.finalThoughts.paragraphs.length > 0 && (
              <div className="bg-gray-100 rounded-xl px-6 sm:px-8 py-6 mt-10">
                {post.finalThoughts.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {post.finalThoughts.title}
                  </h3>
                )}
                <div className="space-y-4">
                  {post.finalThoughts.paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Share row */}
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

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
