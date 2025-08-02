// Package interface definition
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

// Package categories with metadata
export const packageCategories = [
  {
    id: 1,
    title: "Nepal Trekking",
    slug: "nepal-trekking",
    packageCount: 91,
    image: "/images/treks/bg-1.jpg",
    bgColor: "bg-blue-100",
    description: "Discover the breathtaking mountain trails of Nepal with our expert-guided trekking adventures.",
    heroImage: "/images/treks/bg-1.jpg"
  },
  {
    id: 2,
    title: "One Day Activities in Nepal",
    slug: "one-day-activities-in-nepal",
    packageCount: 17,
    image: "/images/treks/bg-2.jpg",
    bgColor: "bg-purple-100",
    description: "Experience the best of Nepal in a single day with our curated activity packages.",
    heroImage: "/images/treks/bg-2.jpg"
  },
  {
    id: 3,
    title: "Nepal Tour Packages",
    slug: "nepal-tour-packages",
    packageCount: 26,
    image: "/images/treks/bg-2.jpg",
    bgColor: "bg-orange-100",
    description: "Explore Nepal's rich culture, heritage, and natural beauty with our comprehensive tour packages.",
    heroImage: "/images/treks/bg-2.jpg"
  },
  {
    id: 4,
    title: "Peak Climbing in Nepal",
    slug: "peak-climbing-in-nepal",
    packageCount: 9,
    image: "/images/treks/bg-2.jpg",
    bgColor: "bg-blue-200",
    description: "Challenge yourself with Nepal's majestic peaks and experience the thrill of high-altitude climbing.",
    heroImage: "/images/treks/bg-2.jpg"
  },
  {
    id: 5,
    title: "Helicopter Tour in Nepal",
    slug: "helicopter-tour-in-nepal",
    packageCount: 12,
    image: "/images/treks/bg-2.jpg",
    bgColor: "bg-gray-100",
    description: "See Nepal from above with our luxury helicopter tours offering stunning aerial views.",
    heroImage: "/images/treks/bg-2.jpg"
  }
];

// Comprehensive packages data
export const packages: Package[] = [
  // Nepal Trekking Packages
  {
    id: 1,
    slug: "everest-base-camp-trek",
    title: "Everest Base Camp Trek",
    category: "nepal-trekking",
    rating: 4.8,
    reviews: 156,
    duration: "14 Days",
    price: 1299,
    image: "/images/treks/bg-1.jpg",
    description: "The ultimate trekking adventure to the base of the world's highest mountain. Experience breathtaking views of Everest and surrounding peaks.",
    highlights: [
      "Reach Everest Base Camp at 5,364m",
      "Stunning views of Everest, Lhotse, and Nuptse",
      "Visit Sherpa villages and monasteries",
      "Experience unique Sherpa culture"
    ],
    includes: [
      "All meals during trek",
      "Experienced guide and porter",
      "Accommodation in lodges",
      "All permits and entry fees",
      "Domestic flights to/from Lukla"
    ],
    location: "Everest Region, Nepal",
    difficulty: "Challenging",
    altitude: "5,364m",
    groupSize: "2-12 people",
    bestSeason: ["March", "April", "May", "October", "November"],
    itinerary: [
      {
        day: 1,
        title: "Fly to Lukla, Trek to Phakding",
        description: "Early morning flight to Lukla followed by trek to Phakding",
        activities: ["Flight to Lukla", "Trek to Phakding", "Acclimatization walk"]
      },
      {
        day: 2,
        title: "Trek to Namche Bazaar",
        description: "Trek through beautiful rhododendron forests to the Sherpa capital",
        activities: ["Cross suspension bridges", "First views of Everest", "Arrive at Namche Bazaar"]
      }
    ]
  },
  {
    id: 2,
    slug: "annapurna-circuit-trek",
    title: "Annapurna Circuit Trek",
    category: "nepal-trekking",
    rating: 4.7,
    reviews: 203,
    duration: "16 Days",
    price: 1199,
    image: "/images/treks/bg-1.jpg",
    description: "One of the world's most popular trekking routes offering diverse landscapes, cultures, and stunning mountain views.",
    highlights: [
      "Cross Thorong La Pass at 5,416m",
      "Visit Muktinath Temple",
      "Diverse landscapes and cultures",
      "360-degree mountain views"
    ],
    includes: [
      "All meals during trek",
      "Licensed guide and porter",
      "Tea house accommodation",
      "All permits and TIMS card",
      "Transportation to/from Kathmandu"
    ],
    location: "Annapurna Region, Nepal",
    difficulty: "Moderate to Challenging",
    altitude: "5,416m",
    groupSize: "2-16 people",
    bestSeason: ["March", "April", "May", "October", "November", "December"],
    itinerary: [
      {
        day: 1,
        title: "Drive to Besisahar, Trek to Bhulbhule",
        description: "Drive from Kathmandu to trek starting point",
        activities: ["Scenic drive", "Start trekking", "Local village visit"]
      }
    ]
  },

  // One Day Activities
  {
    id: 3,
    slug: "paragliding-pokhara",
    title: "Paragliding Adventure in Pokhara",
    category: "one-day-activities-in-nepal",
    rating: 4.9,
    reviews: 89,
    duration: "Half Day",
    price: 89,
    image: "/images/treks/bg-2.jpg",
    description: "Soar above the beautiful Pokhara valley with stunning views of the Himalayas and Phewa Lake.",
    highlights: [
      "Bird's eye view of Pokhara valley",
      "Views of Annapurna range",
      "Professional tandem flight",
      "Photos and videos included"
    ],
    includes: [
      "Professional pilot",
      "Safety equipment",
      "Transportation to launch site",
      "Flight certificate",
      "Photos and videos"
    ],
    location: "Pokhara, Nepal",
    groupSize: "1-10 people",
    bestSeason: ["October", "November", "December", "January", "February", "March"],
    itinerary: [
      {
        day: 1,
        title: "Paragliding Adventure",
        description: "Full paragliding experience with stunning mountain views",
        activities: ["Safety briefing", "Tandem paragliding flight", "Certificate presentation"]
      }
    ]
  },
  {
    id: 4,
    slug: "chitwan-jungle-safari",
    title: "Chitwan Jungle Safari",
    category: "one-day-activities-in-nepal",
    rating: 4.6,
    reviews: 124,
    duration: "Full Day",
    price: 75,
    image: "/images/treks/bg-2.jpg",
    description: "Experience Nepal's wildlife in Chitwan National Park with elephant rides and jungle walks.",
    highlights: [
      "Spot one-horned rhinoceros",
      "Elephant safari experience",
      "Bird watching opportunities",
      "Tharu cultural program"
    ],
    includes: [
      "Park entrance fees",
      "Professional guide",
      "Elephant safari",
      "Lunch",
      "Transportation within park"
    ],
    location: "Chitwan National Park, Nepal",
    groupSize: "2-20 people",
    bestSeason: ["October", "November", "December", "January", "February", "March", "April"],
    itinerary: [
      {
        day: 1,
        title: "Wildlife Safari Adventure",
        description: "Full day exploring Chitwan's incredible wildlife",
        activities: ["Elephant safari", "Jungle walk", "Bird watching", "Tharu cultural show"]
      }
    ]
  },

  // Nepal Tour Packages
  {
    id: 5,
    slug: "kathmandu-valley-heritage-tour",
    title: "Kathmandu Valley Heritage Tour",
    category: "nepal-tour-packages",
    rating: 4.5,
    reviews: 178,
    duration: "7 Days",
    price: 599,
    image: "/images/treks/bg-2.jpg",
    description: "Explore the cultural treasures of Kathmandu Valley including UNESCO World Heritage Sites.",
    highlights: [
      "Visit 7 UNESCO World Heritage Sites",
      "Explore ancient temples and palaces",
      "Experience local culture and traditions",
      "Professional cultural guide"
    ],
    includes: [
      "Hotel accommodation",
      "All meals",
      "Professional guide",
      "Entry fees to monuments",
      "Private transportation"
    ],
    location: "Kathmandu Valley, Nepal",
    groupSize: "2-15 people",
    bestSeason: ["October", "November", "December", "January", "February", "March", "April"],
    itinerary: [
      {
        day: 1,
        title: "Arrival and Kathmandu Durbar Square",
        description: "Welcome to Nepal and explore the historic royal palace complex",
        activities: ["Airport pickup", "Hotel check-in", "Kathmandu Durbar Square visit", "Welcome dinner"]
      }
    ]
  },

  // Peak Climbing
  {
    id: 6,
    slug: "island-peak-climbing",
    title: "Island Peak Climbing",
    category: "peak-climbing-in-nepal",
    rating: 4.7,
    reviews: 67,
    duration: "18 Days",
    price: 2299,
    image: "/images/treks/bg-2.jpg",
    description: "Challenge yourself with one of Nepal's most popular climbing peaks at 6,189m.",
    highlights: [
      "Summit Island Peak at 6,189m",
      "Technical climbing experience",
      "Views from Everest Base Camp",
      "Professional climbing guides"
    ],
    includes: [
      "All climbing equipment",
      "Professional climbing guide",
      "All meals during expedition",
      "Camping equipment",
      "All permits and fees"
    ],
    location: "Everest Region, Nepal",
    difficulty: "Technical",
    altitude: "6,189m",
    groupSize: "2-8 people",
    bestSeason: ["March", "April", "May", "October", "November"],
    itinerary: [
      {
        day: 1,
        title: "Fly to Lukla, Trek to Phakding",
        description: "Begin the climbing expedition with flight to Lukla",
        activities: ["Flight to Lukla", "Trek to Phakding", "Equipment check"]
      }
    ]
  },

  // Helicopter Tours
  {
    id: 7,
    slug: "everest-helicopter-tour",
    title: "Everest Helicopter Tour",
    category: "helicopter-tour-in-nepal",
    rating: 4.9,
    reviews: 145,
    duration: "4 Hours",
    price: 1099,
    image: "/images/treks/bg-2.jpg",
    description: "Experience the ultimate luxury adventure with a helicopter flight to Everest Base Camp.",
    highlights: [
      "Helicopter flight to Everest Base Camp",
      "Landing at Kala Patthar",
      "Breakfast at Everest View Hotel",
      "Stunning aerial mountain views"
    ],
    includes: [
      "Helicopter charter",
      "Professional pilot",
      "Breakfast at high altitude",
      "Airport transfers",
      "Flight certificate"
    ],
    location: "Everest Region, Nepal",
    groupSize: "1-5 people",
    bestSeason: ["March", "April", "May", "October", "November", "December"],
    itinerary: [
      {
        day: 1,
        title: "Everest Helicopter Adventure",
        description: "Luxury helicopter experience to the world's highest mountains",
        activities: ["Helicopter flight", "Kala Patthar landing", "Mountain viewing", "Luxury breakfast"]
      }
    ]
  }
];

// Helper function to get packages by category
export function getPackagesByCategory(categorySlug: string): Package[] {
  return packages.filter(pkg => pkg.category === categorySlug);
}

// Helper function to get package category info
export function getPackageCategory(categorySlug: string) {
  return packageCategories.find(cat => cat.slug === categorySlug);
} 