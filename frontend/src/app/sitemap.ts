import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getPackages } from '@/lib/api';
import { getAllSlugs } from '@/lib/sanity/fetch';

export const revalidate = 3600; // regenerate every hour

const STATIC: MetadataRoute.Sitemap = [
  { url: SITE_URL,                            lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${SITE_URL}/trekking`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  { url: `${SITE_URL}/destinations`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${SITE_URL}/blog`,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  { url: `${SITE_URL}/custom-package`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/travel-guide`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${SITE_URL}/about`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/contact-us`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/our-team`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/luxury`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Trek / package pages ────────────────────────────────────
  let packagePages: MetadataRoute.Sitemap = [];
  try {
    const { data: packages } = await getPackages({ status: 'active', limit: 1000 });
    packagePages = packages.map((pkg) => ({
      url: `${SITE_URL}/trekking/${pkg.slug}`,
      lastModified: new Date(pkg.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch {
    // API unreachable at build time — static pages still indexed
  }

  // ── Blog posts (Sanity) ─────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllSlugs();
    blogPages = slugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity unreachable
  }

  return [...STATIC, ...packagePages, ...blogPages];
}
