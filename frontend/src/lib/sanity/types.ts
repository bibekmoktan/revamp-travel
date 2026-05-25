export interface SanityAsset {
  _ref?: string;
  _id?: string;
  _type?: string;
  url?: string;
}

export interface SanityImage {
  _type?: 'image';
  asset: SanityAsset;
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Author {
  name: string;
  slug: string;
  avatar?: SanityImage;
  bio?: string;
}

export interface Category {
  title: string;
  slug: string;
  description?: string;
}

export interface ContentBlock {
  heading?: string;
  paragraph: string;
}

export interface FinalThoughts {
  title?: string;
  paragraphs: string[];
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: SanityImage;
  date: string;
  readTime: string;
  featured: boolean;
  keyTakeaways?: string[];
  content?: ContentBlock[];
  finalThoughts?: FinalThoughts;
  author: Author;
  category: Category;
}

export type BlogPostListItem = Pick<
  BlogPost,
  '_id' | 'title' | 'slug' | 'excerpt' | 'image' | 'date' | 'readTime' | 'featured' | 'author' | 'category'
>;
