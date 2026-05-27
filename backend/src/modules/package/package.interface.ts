export interface IImage {
  url: string;
  alt?: string;
  public_id: string;
}
export interface IVideo {
  url: string;
  public_id: string;
  thumbnail?: string;
}

export interface IItinerary {
  day: number;
  title: string;
  description: string;
  images?: IImage[];
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface IMoreInfo {
  title: string;
  points: string[];
}

export interface IPricingTier {
  groupMin: number;
  groupMax: number;
  label: string;
  pricePerPerson: number;
}

export interface IRouteComparisonRow {
  attribute: string;
  thisRoute: string;
  alternativeRoute: string;
}

export interface ISeason {
  name: string;
  months?: string;
  notes?: string;
}

export interface IRouteComparison {
  alternativeName: string;
  rows: IRouteComparisonRow[];
}

export interface IBookingTerms {
  depositPercent: number;
  finalPaymentDays: number;
  cancellationPolicy: string;
}

export interface IPackingNotes {
  maxDuffelKg: number;
  maxDaypackKg: number;
  notes: string;
}

export interface IWhyChoose {
  description: string;
  points: string[];
}

export interface IPackage {
  slug: string;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  featureImage: IImage;
  gallery: IImage[];
  description: string;
  highlights: string[];
  includes: string[];
  notIncluded: string[];
  location: string;
  difficulty?: string;
  altitude?: string;
  groupSize: string;
  bestSeason: string[];
  tripStart: string;
  tripEnd: string;
  meals: string;
  accommodation: string;
  mapUrl?: string;
  faq: IFaq[];
  moreInfo: IMoreInfo[];
  itinerary: IItinerary[];
  country?: 'nepal' | 'bhutan' | 'tibet' | 'india';
  status?: 'active' | 'inactive';
  pricingTiers: IPricingTier[];
  seasons: ISeason[];
  routeComparison?: IRouteComparison;
  bookingTerms?: IBookingTerms;
  packingNotes?: IPackingNotes;
  whyChoose?: IWhyChoose;
}