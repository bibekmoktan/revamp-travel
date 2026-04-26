export interface TravelCategory {
  slug: string;
  label: string;
  apiCategory: string;
  description: string;
  image: string;
  icon: string;
}

const categories: TravelCategory[] = [
  {
    slug: 'trekking-in-nepal',
    label: 'Trekking in Nepal',
    apiCategory: 'trekking',
    description: 'Explore legendary Himalayan trails with expert local guides.',
    image: '/images/treks/bg-1.jpg',
    icon: '🥾',
  },
  {
    slug: 'peak-climbing',
    label: 'Peak Climbing',
    apiCategory: 'peak-climbing',
    description: 'Summit Nepal\'s iconic peaks with certified climbing guides.',
    image: '/images/treks/bg-2.jpg',
    icon: '🏔️',
  },
  {
    slug: 'heli-tour',
    label: 'Heli Tour',
    apiCategory: 'heli-tour',
    description: 'Experience breathtaking aerial views of the Himalayas.',
    image: '/images/treks/bg-1.jpg',
    icon: '🚁',
  },
  {
    slug: 'one-day-tour',
    label: 'One Day Tour',
    apiCategory: 'one-day-tour',
    description: 'Discover Nepal\'s best highlights in a single unforgettable day.',
    image: '/images/treks/bg-2.jpg',
    icon: '🌄',
  },
];

export default categories;
