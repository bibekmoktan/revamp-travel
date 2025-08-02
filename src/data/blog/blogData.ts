// Blog post data interface
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured: boolean;
}

// Sample blog data
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Everest Base Camp Trek",
    excerpt: "Everything you need to know about preparing for the world's most famous trek, from training tips to packing essentials.",
    image: "/images/blog/bg-2.jpg",
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
    image: "/images/blog/bg-2.jpg",
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
    image: "/images/blog/bg-2.jpg",
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
    image: "/images/blog/bg-2.jpg",
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
    image: "/images/blog/bg-2.jpg",
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
    image: "/images/blog/bg-2.jpg",
    author: "Green Trek Team",
    date: "March 3, 2024",
    category: "Sustainability",
    readTime: "4 min read",
    featured: false
  }
];

// Blog categories
export const categories = [
  "All", 
  "Trekking Guide", 
  "Destinations", 
  "Gear Guide", 
  "Photography", 
  "Health & Safety", 
  "Sustainability"
]; 