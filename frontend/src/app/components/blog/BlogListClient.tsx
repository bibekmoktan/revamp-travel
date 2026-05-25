'use client';

import { useState } from 'react';
import type { BlogPostListItem } from '@/lib/sanity/types';
import BlogGrid from './BlogGrid';
import CategoryFilter from './CategoryFilter';
import FeaturedPost from './FeaturedPost';

interface BlogListClientProps {
  posts: BlogPostListItem[];
  featuredPosts: BlogPostListItem[];
  categories: string[];
}

export default function BlogListClient({ posts, featuredPosts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {featuredPosts.map((post) => (
        <FeaturedPost key={post._id} post={post} />
      ))}

      <BlogGrid posts={posts} activeCategory={activeCategory} />
    </>
  );
}
