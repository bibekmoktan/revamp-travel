'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Everest Base Camp Trek",
    excerpt: "Everything you need to know about preparing for the world's most famous trek, from training tips to packing essentials.",
    image: "/images/blog/everest-guide.jpg",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Trekking Guide",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "10 Hidden Gems in the Himalayas",
    excerpt: "Discover lesser-known trails and peaks that offer stunning views without the crowds of popular destinations.",
    image: "/images/blog/hidden-gems.jpg",
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "Destinations",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 3,
    title: "Essential Gear for High Altitude Trekking",
    excerpt: "A comprehensive gear list for trekking above 4000m, tested by professional mountain guides.",
    image: "/images/blog/gear-guide.jpg",
    author: "Emma Rodriguez",
    date: "March 10, 2024",
    category: "Gear Guide",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 4,
    title: "Photography Tips for Mountain Adventures",
    excerpt: "Capture stunning landscape photos during your treks with these professional photography techniques.",
    image: "/images/blog/photography.jpg",
    author: "David Park",
    date: "March 8, 2024",
    category: "Photography",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    title: "Acclimatization: Your Key to Safe High Altitude Trekking",
    excerpt: "Understanding altitude sickness and how proper acclimatization can make or break your mountain adventure.",
    image: "/images/blog/acclimatization.jpg",
    author: "Dr. Lisa Thompson",
    date: "March 5, 2024",
    category: "Health & Safety",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 6,
    title: "Sustainable Trekking: Leave No Trace Principles",
    excerpt: "How to minimize your environmental impact while exploring the world's most pristine mountain regions.",
    image: "/images/blog/sustainable.jpg",
    author: "Green Trek Team",
    date: "March 3, 2024",
    category: "Sustainability",
    readTime: "4 min read",
    featured: false
  }
];

const categories = ["All", "Trekking Guide", "Destinations", "Gear Guide", "Photography", "Health & Safety", "Sustainability"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gray-300">
          {/* Placeholder for background image - blog themed gradient */}
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">Blog Background Image Placeholder</span>
          </div>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Travel Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Expert guides, inspiring stories, and insider tips from our adventures around the world
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 hover:shadow-lg">
              Explore Articles
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full transition-colors ${
                index === 0 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="mb-16">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
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
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
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
                      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}`}
              className="block group"
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                
                {/* Post Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.author}</div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Articles
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Latest Adventures
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get travel tips, destination guides, and exclusive offers delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 