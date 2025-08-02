import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/data/blog/blogData';

interface FeaturedPostProps {
  post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="mb-16">
      <div className="bg-white overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-80 lg:h-96">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full">
                {post.category}
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
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.date}</div>
                </div>
              </div>
              
              <Link href={`/blog/${post.id}`}>
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