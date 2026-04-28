// Package categories with metadata — used for static nav, category pages, and FeatureTrip component
// apiCategory must match the exact value stored in MongoDB (set via admin package form)
export const packageCategories = [
  {
    id: 1,
    title: "Nepal Trekking",
    slug: "nepal-trekking",
    apiCategory: "trekking",
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
    apiCategory: "adventures",
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
    apiCategory: "tour",
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
    apiCategory: "peak-climbing",
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
    apiCategory: "heli-tour",
    packageCount: 12,
    image: "/images/treks/bg-2.jpg",
    bgColor: "bg-gray-100",
    description: "See Nepal from above with our luxury helicopter tours offering stunning aerial views.",
    heroImage: "/images/treks/bg-2.jpg"
  }
];
