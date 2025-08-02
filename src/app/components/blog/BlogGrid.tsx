import { BlogPost } from '@/data/blog/blogData';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  activeCategory?: string;
}

export default function BlogGrid({ posts, activeCategory = "All" }: BlogGridProps) {
  
  // Filter posts based on active category
  const filteredPosts = posts.filter(post => {
    if (activeCategory === "All") return !post.featured;
    return !post.featured && post.category === activeCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
} 