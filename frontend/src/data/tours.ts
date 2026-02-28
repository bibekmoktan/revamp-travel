// Tour interface definition
export interface Tour {
  id: number;
  slug: string;
  city: string;
  title: string;
  rating: number;
  reviews: number;
  duration: string;
  price: string;
  image: string;
  description: string;
  highlights: string[];
  includes: string[];
  location: string;
  // Extended tour information
  groupSize: string;
  ages: string;
  languages: string[];
  additionalDescription?: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
    highlighted?: boolean;
  }[];
  faq: {
    question: string;
    answer?: string;
    isExpanded?: boolean;
  }[];
  tickets: {
    type: string;
    ageRange: string;
    price: number;
    quantity: number;
  }[];
  extras: {
    name: string;
    type: 'per_booking' | 'per_person';
    price: number;
    description?: string;
  }[];
}

// Tours data array
export const tours: Tour[] = [
  {
    id: 1,
    slug: 'phi-phi-islands-speedboat-adventure',
    city: 'Phuket, Thailand',
    title: 'Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat',
    rating: 4.8,
    reviews: 243,
    duration: '8 days',
    price: '$1,200',
    image: '/images/home/card-1.svg',
    description: 'The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip whisks you around the islands in one day.',
    additionalDescription: 'Some places of Phi Lagoon island at Phi Phi Leh island at bamboo island, and visit Monkey Beach and Maya Bay, immortalized in "The Beach," boat transfers, snacks, buffet lunch, snorkeling equipment, and Phuket hotel pickup and drop-off all included.',
    highlights: [
      'Experience the thrill of a speedboat to the stunning Phi Phi islands',
      'Be amazed by the variety of marine life in the archipelago',
      'Enjoy relaxing in paradise with white sand beaches and azure turquoise water',
      'Feel the comfort of a tour limited to 35 passengers',
      'Catch a glimpse of the wild monkeys around Monkey Beach'
    ],
    includes: [
      'Beverages, drinking water, morning tea and buffet lunch',
      'Local taxes',
      'Hotel pickup and drop-off by air-conditioned minivan',
      'Insurance/transfer to a private pier',
      'Soft drinks',
      'Tour Guide',
      'Towel',
      'Tips',
      'Alcoholic Beverages'
    ],
    location: 'Phi Phi Islands, Thailand',
    groupSize: '10 people',
    ages: '18-99 yrs',
    languages: ['English', 'Japanese'],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pick Up',
        description: 'Your adventure begins with a convenient pickup from your hotel or the airport. Get ready for an exciting day exploring the beautiful Phi Phi Islands.',
        highlighted: true
      },
      {
        day: 2,
        title: 'Temples & River Cruise',
        description: 'Explore ancient temples and enjoy a peaceful river cruise through stunning landscapes.'
      },
      {
        day: 3,
        title: 'Massage & Overnight Train',
        description: 'Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have the freedom to explore the city and get settled in.'
      },
      {
        day: 4,
        title: 'Khao Sok National Park',
        description: 'Discover the natural beauty of Khao Sok National Park with jungle trekking and wildlife spotting.'
      },
      {
        day: 5,
        title: 'Travel to Koh Phangan',
        description: 'Journey to the beautiful island of Koh Phangan for beach relaxation and island activities.'
      },
      {
        day: 6,
        title: 'Morning Chill & Muay Thai Lesson',
        description: 'Start with a relaxing morning and learn traditional Muay Thai martial arts.'
      },
      {
        day: 7,
        title: 'Island Boat Trip',
        description: 'End your adventure with an exciting island hopping boat trip exploring hidden beaches and crystal clear waters.',
        highlighted: true
      }
    ],
    faq: [
      {
        question: 'Can I get the refund?',
        answer: 'Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat cancellation policy: For a full refund, cancel at least 24 hours in advance of the start date of the experience. Discover and book Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat',
        isExpanded: true
      },
      {
        question: 'Can I change the travel date?',
        isExpanded: false
      },
      {
        question: 'When and where does the tour end?',
        isExpanded: false
      },
      {
        question: 'Do you arrange airport transfer?',
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: 'Adult',
        ageRange: '18+ years',
        price: 262.00,
        quantity: 3
      },
      {
        type: 'Youth',
        ageRange: '13-17 years',
        price: 198.50,
        quantity: 2
      },
      {
        type: 'Children',
        ageRange: '6-12 years',
        price: 80.00,
        quantity: 4
      }
    ],
    extras: [
      {
        name: 'Add Service per booking',
        type: 'per_booking',
        price: 40,
        description: 'Additional service fee per booking'
      },
      {
        name: 'Add Service per person',
        type: 'per_person',
        price: 40,
        description: 'Adult: $170.00 · Youth: $94.00'
      }
    ]
  },
  {
    id: 2,
    slug: 'ultimate-circle-island-day-tour-lunch',
    city: 'New York, USA',
    title: 'All Inclusive Ultimate Circle Island Day Tour with Lunch',
    rating: 4.8,
    reviews: 243,
    duration: '4 days',
    price: '$77.00',
    image: '/images/home/card-2.svg',
    description: 'Discover the beauty of the entire island with this comprehensive tour that includes lunch and all major attractions.',
    highlights: ['Full island tour', 'Delicious lunch included', 'Multiple stops', 'Expert local guide'],
    includes: ['Transportation', 'Lunch meal', 'Entry fees', 'Professional guide'],
    location: 'Circle Island, New York',
    groupSize: '15 people',
    ages: '16-80 yrs',
    languages: ['English'],
    itinerary: [],
    faq: [],
    tickets: [],
    extras: []
  },
  {
    id: 3,
    slug: 'paris-france-adventure-tour',
    city: 'Paris, France',
    title: 'Centipede Tour – Guided Arizona Desert Tour by ATV',
    rating: 5.0,
    reviews: 260,
    duration: '4 days',
    price: '$189.25',
    image: '/images/home/card-3.svg',
    description: 'Experience the romantic city of Paris with this comprehensive adventure tour covering all major landmarks.',
    highlights: ['Eiffel Tower visit', 'Seine River cruise', 'Louvre Museum', 'Local cuisine tasting'],
    includes: ['Transportation', 'Museum tickets', 'River cruise', 'Professional guide'],
    location: 'Paris, France',
    groupSize: '12 people',
    ages: '18-75 yrs',
    languages: ['English', 'French'],
    itinerary: [],
    faq: [],
    tickets: [],
    extras: []
  },
  {
    id: 4,
    slug: 'westminster-walking-tour-abbey-entry',
    city: 'London, UK',
    title: 'Westminster Walking Tour & Westminster Abbey Entry',
    rating: 5.0,
    reviews: 120,
    duration: '4 days',
    price: '$943.00',
    image: '/images/home/card-4.svg',
    description: 'Explore the heart of London with this historical walking tour including exclusive access to Westminster Abbey.',
    highlights: ['Westminster Abbey entry', 'Historical walking tour', 'Royal landmarks', 'Expert historian guide'],
    includes: ['Abbey entry ticket', 'Walking tour', 'Professional guide', 'Historical insights'],
    location: 'Westminster, London',
    groupSize: '20 people',
    ages: '12-85 yrs',
    languages: ['English'],
    itinerary: [],
    faq: [],
    tickets: [],
    extras: []
  },
  {
    id: 5,
    slug: 'london-historical-heritage-tour',
    city: 'London, UK',
    title: 'Westminster Walking Tour & Westminster Abbey Entry',
    rating: 5.0,
    reviews: 120,
    duration: '4 days',
    price: '$943.00',
    image: '/images/home/card-5.svg',
    description: 'Immerse yourself in London\'s rich history with this comprehensive heritage tour of the city\'s most iconic locations.',
    highlights: ['Multiple heritage sites', 'Expert guide', 'Photo opportunities', 'Cultural insights'],
    includes: ['Heritage site entries', 'Walking tour', 'Professional guide', 'Cultural briefing'],
    location: 'Central London, UK',
    groupSize: '18 people',
    ages: '15-80 yrs',
    languages: ['English'],
    itinerary: [],
    faq: [],
    tickets: [],
    extras: []
  },
];

// Helper function to get tour by slug
export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find(tour => tour.slug === slug);
}

// Helper function to get all tour slugs (useful for static generation)
export function getAllTourSlugs(): string[] {
  return tours.map(tour => tour.slug);
} 