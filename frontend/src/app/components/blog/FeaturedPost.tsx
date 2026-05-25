import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/sanity/client';
import { formatPostDate } from '@/lib/sanity/format';
import type { BlogPostListItem } from '@/lib/sanity/types';

interface FeaturedPostProps {
  post: BlogPostListItem;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const imageUrl = urlFor(post.image).width(1200).height(900).fit('crop').url();
  const authorName = post.author?.name ?? 'Unknown';

  return (
    <div className="mb-16">
      <div className="bg-white overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative h-80 lg:h-96">
            <Image
              src={imageUrl}
              alt={post.image.alt ?? post.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full">
                {post.category?.title ?? 'Uncategorized'}
              </span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h2>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
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
                  <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{authorName}</div>
                  <div className="text-sm text-gray-500">{formatPostDate(post.date)}</div>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
