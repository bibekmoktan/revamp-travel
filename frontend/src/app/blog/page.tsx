'use client';

import { useState } from 'react';
import { blogPosts, categories } from '@/data/blog/blogData';
import { 
  BlogHero, 
  CategoryFilter, 
  FeaturedPost, 
  BlogGrid, 
  NewsletterSignup 
} from '@/app/components/blog';

export default function BlogPage() {
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState("All");

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <BlogHero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Featured Posts */}
        {featuredPosts.map((post) => (
          <FeaturedPost key={post.id} post={post} />
        ))}

        {/* Blog Posts Grid */}
        <BlogGrid 
          posts={blogPosts} 
          activeCategory={activeCategory}
        />

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Articles
          </button>
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </div>
  );
} 