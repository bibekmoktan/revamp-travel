/**
 * Shared package types used across the application
 * Matches the data structure defined in src/data/packages.ts
 */
export interface Package {
  id: number;
  slug: string;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  image: string;
  description: string;
  highlights: string[];
  includes: string[];
  location: string;
  difficulty?: string;
  altitude?: string;
  groupSize: string;
  bestSeason: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
}

/**
 * Package category interface
 */
export interface PackageCategory {
  id: number;
  title: string;
  slug: string;
  packageCount: number;
  image: string;
  bgColor: string;
  description: string;
  heroImage: string;
}

/**
 * Category information interface
 */
export interface CategoryInfo {
  title: string;
  description: string;
  heroImage: string;
  packageCount: number;
} 