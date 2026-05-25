import type { BlogPostListItem } from '@/lib/sanity/types';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: BlogPostListItem[];
  activeCategory?: string;
}

export default function BlogGrid({ posts, activeCategory = "All" }: BlogGridProps) {

  const filteredPosts = posts.filter((post) => {
    if (post.featured) return false;
    if (activeCategory === "All") return true;
    return post.category?.title === activeCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
