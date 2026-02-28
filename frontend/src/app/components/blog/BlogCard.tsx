import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/data/blog/blogData';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="block group"
    >
      <article className="bg-white max-h-[500px] min-h-[500px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">

        {/* Post Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Post Content */}
        <div className="px-6 pb-0 pt-4">
          {/* Category Badge - Purple accent like in the image */}
          <div className="mb-4">
            <span className="inline-block bg-sky-100 text-sky-600 px-3 py-1 rounded-md text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title - Clean and bold like in the image */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors leading-tight">
            {post.title}
          </h3>

          {/* Excerpt - Subtle gray text */}
          <p className="text-gray-600 text-smleading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Author section - Clean layout like in the image */}
        <div className="flex items-center gap-3 px-6 py-4">
          {/* Author avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {post.author.split(' ').map(name => name[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{post.author}</div>
            <div className="text-xs text-gray-500">{post.date}</div>
          </div>
          {/* Read time badge */}
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {post.readTime}
          </div>
        </div>
      </article>
    </Link>
  );
} 