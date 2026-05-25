import { client } from './client';
import {
  ALL_POSTS_QUERY,
  ALL_SLUGS_QUERY,
  FEATURED_POSTS_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  POST_BY_SLUG_QUERY,
} from './queries';
import type { BlogPost, BlogPostListItem } from './types';

const REVALIDATE = { next: { revalidate: 60 } };

export async function getAllPosts(): Promise<BlogPostListItem[]> {
  return client.fetch<BlogPostListItem[]>(ALL_POSTS_QUERY, {}, REVALIDATE);
}

export async function getFeaturedPosts(): Promise<BlogPostListItem[]> {
  return client.fetch<BlogPostListItem[]>(FEATURED_POSTS_QUERY, {}, REVALIDATE);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug }, REVALIDATE);
}

export async function getAllSlugs(): Promise<string[]> {
  return client.fetch<string[]>(ALL_SLUGS_QUERY, {}, REVALIDATE);
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<BlogPostListItem[]> {
  return client.fetch<BlogPostListItem[]>(
    POSTS_BY_CATEGORY_QUERY,
    { categorySlug },
    REVALIDATE
  );
}
