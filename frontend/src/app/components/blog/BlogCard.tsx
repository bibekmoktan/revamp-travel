import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity/client';
import { formatPostDate } from '@/lib/sanity/format';
import type { BlogPostListItem } from '@/lib/sanity/types';

interface BlogCardProps {
  post: BlogPostListItem;
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = urlFor(post.image).width(800).height(600).fit('crop').url();
  const authorName = post.author?.name ?? 'Unknown';
  const initials = authorName.split(' ').map((n) => n[0]).join('');

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group"
    >
      <article className="bg-white max-h-[500px] min-h-[500px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">

        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.image.alt ?? post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="px-6 pb-0 pt-4">
          <div className="mb-4">
            <span className="inline-block bg-sky-100 text-sky-600 px-3 py-1 rounded-md text-sm font-medium">
              {post.category?.title ?? 'Uncategorized'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors leading-tight">
            {post.title}
          </h3>

          <p className="text-gray-600 text-smleading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4">
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
              <span className="text-white text-sm font-semibold">
                {initials}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{authorName}</div>
            <div className="text-xs text-gray-500">{formatPostDate(post.date)}</div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {post.readTime}
          </div>
        </div>
      </article>
    </Link>
  );
}
