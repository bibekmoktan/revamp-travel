import type { ApiPackage } from '@/types/api';

export const SITE_URL  = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://highspiritsnepal.com').replace(/\/$/, '');
export const SITE_NAME = 'Himalayan High Spirits Adventure';
export const SITE_DESCRIPTION =
  'Book expert-guided trekking, mountaineering, and adventure tours in Nepal, Bhutan & Tibet. Everest Base Camp, Annapurna Circuit, custom packages and more.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const TWITTER_HANDLE   = '@HHSAdventure';

// ── JSON-LD builders ──────────────────────────────────────────────────────────

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/trekking?searchTerm={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.jpg`,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NP',
      addressLocality: 'Kathmandu',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.facebook.com/himalayanhighspiritsadventure',
      'https://www.instagram.com/himalayanhighspiritsadventure',
    ],
  };
}

export function trekJsonLd(pkg: ApiPackage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.description?.slice(0, 250),
    url: `${SITE_URL}/trekking/${pkg.slug}`,
    image: pkg.featureImage?.url,
    touristType: 'Adventure tourist',
    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/trekking/${pkg.slug}`,
    },
    ...(pkg.duration ? { duration: pkg.duration } : {}),
    ...(pkg.location ? {
      locationCreated: {
        '@type': 'Place',
        name: pkg.location,
        address: { '@type': 'PostalAddress', addressCountry: 'NP' },
      },
    } : {}),
    ...(pkg.rating && pkg.reviews ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: pkg.rating,
        reviewCount: pkg.reviews,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  };
}

export function blogArticleJsonLd(opts: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  authorName?: string;
  ogImageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.excerpt,
    url: `${SITE_URL}/blog/${opts.slug}`,
    datePublished: opts.date,
    author: {
      '@type': 'Person',
      name: opts.authorName ?? SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/logo.jpg` },
    },
    ...(opts.ogImageUrl ? {
      image: { '@type': 'ImageObject', url: opts.ogImageUrl },
    } : {}),
  };
}
