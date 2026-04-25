export interface ApiImage {
  url: string;
  alt?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface MoreInfoItem {
  title: string;
  points: string[];
}

export interface ApiPackage {
  _id: string;
  slug: string;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  featureImage: ApiImage;
  gallery: ApiImage[];
  description: string;
  highlights: string[];
  includes: string[];
  notIncluded?: string[];
  location: string;
  difficulty?: 'easy' | 'moderate' | 'challenging' | 'extreme';
  altitude?: string;
  groupSize: string;
  bestSeason: string[];
  tripStart?: string;
  tripEnd?: string;
  meals?: string;
  accommodation?: string;
  mapUrl?: string;
  faq?: FaqItem[];
  moreInfo?: MoreInfoItem[];
  itinerary: ItineraryDay[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface PackageFilters {
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  difficulty?: string;
  duration?: string;
  season?: string;
  trekType?: string;
}
