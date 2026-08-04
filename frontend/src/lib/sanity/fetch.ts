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

function isSanityConfigured() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  return Boolean(
    projectId &&
      projectId.trim() !== '' &&
      projectId !== 'dummy-project-id' &&
      dataset &&
      dataset.trim() !== '' &&
      dataset !== 'production'
  );
}

async function safeSanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  if (!isSanityConfigured()) {
    return fallback;
  }

  try {
    return await client.fetch<T>(query, params, REVALIDATE);
  } catch (error) {
    console.warn('Sanity fetch failed, using fallback data.', error);
    return fallback;
  }
}

export async function getAllPosts(): Promise<BlogPostListItem[]> {
  return safeSanityFetch<BlogPostListItem[]>(ALL_POSTS_QUERY, {}, []);
}

export async function getFeaturedPosts(): Promise<BlogPostListItem[]> {
  return safeSanityFetch<BlogPostListItem[]>(FEATURED_POSTS_QUERY, {}, []);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return safeSanityFetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug }, null);
}

export async function getAllSlugs(): Promise<string[]> {
  return safeSanityFetch<string[]>(ALL_SLUGS_QUERY, {}, []);
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<BlogPostListItem[]> {
  return safeSanityFetch<BlogPostListItem[]>(
    POSTS_BY_CATEGORY_QUERY,
    { categorySlug },
    []
  );
}
