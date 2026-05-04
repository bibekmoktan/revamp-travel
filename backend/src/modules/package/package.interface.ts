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
  activities: string[];
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface IMoreInfo {
  title: string;
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
}