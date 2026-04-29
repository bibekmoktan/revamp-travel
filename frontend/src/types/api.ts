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

export interface ApiEnquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  packageId?: string;
  packageTitle?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TravelerInput {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idProof: string;
}

export interface BookingSummary {
  _id: string;
  package: Pick<ApiPackage, '_id' | 'title' | 'slug' | 'featureImage' | 'duration' | 'location'>;
  trekDate: string;
  numberOfPeople: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  bookingStatus: 'reserved' | 'confirmed' | 'cancelled';
  expiresAt: string;
  createdAt: string;
}

export interface CartItem {
  cartId: string;
  packageId: string;
  slug: string;
  title: string;
  image: string;
  duration: string;
  location: string;
  date: string;
  travelers: number;
  pricePerPerson: number;
  totalAmount: number;
}

export interface ApiReview {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  package: { _id: string; title: string } | string;
  rating: number;
  comment: string;
  title?: string;
  isVerified: boolean;
  helpfulCount: number;
  response?: {
    text: string;
    respondedAt: string;
    respondedBy: { name: string } | string;
  };
  createdAt: string;
  updatedAt: string;
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
