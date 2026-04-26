export interface Destination {
  slug: string;
  label: string;
  locationKeyword: string;
  image: string;
  description: string;
  type: 'region' | 'trending';
}

const destinations: Destination[] = [
  // Top Destinations (Regions)
  {
    slug: 'everest-region',
    label: 'Everest Region',
    locationKeyword: 'Everest',
    image: '/images/treks/bg-1.jpg',
    description: 'Home to the world\'s highest peak, the Everest Region offers legendary trekking routes and breathtaking Himalayan scenery.',
    type: 'region',
  },
  {
    slug: 'annapurna-region',
    label: 'Annapurna Region',
    locationKeyword: 'Annapurna',
    image: '/images/treks/bg-2.jpg',
    description: 'One of the most diverse trekking areas in Nepal, featuring the famous Annapurna Circuit and Sanctuary routes.',
    type: 'region',
  },
  {
    slug: 'langtang-region',
    label: 'Langtang Region',
    locationKeyword: 'Langtang',
    image: '/images/treks/bg-1.jpg',
    description: 'The closest high Himalayan region to Kathmandu, known for its stunning valley, glaciers, and Tamang culture.',
    type: 'region',
  },
  {
    slug: 'manaslu-region',
    label: 'Manaslu Region',
    locationKeyword: 'Manaslu',
    image: '/images/treks/bg-2.jpg',
    description: 'A remote and less-trodden circuit around the world\'s eighth highest mountain.',
    type: 'region',
  },
  {
    slug: 'mustang-region',
    label: 'Mustang Region',
    locationKeyword: 'Mustang',
    image: '/images/treks/bg-1.jpg',
    description: 'The ancient kingdom beyond the Himalayas — a high-altitude desert with Tibetan culture and dramatic landscapes.',
    type: 'region',
  },
  {
    slug: 'dolpa-region',
    label: 'Dolpa Region',
    locationKeyword: 'Dolpa',
    image: '/images/treks/bg-2.jpg',
    description: 'Nepal\'s largest and most remote district, home to Shey Phoksundo Lake and pristine wilderness.',
    type: 'region',
  },

  // Trending Destinations (Specific Places)
  {
    slug: 'chitwan',
    label: 'Chitwan',
    locationKeyword: 'Chitwan',
    image: '/images/home/chitwan.jpg',
    description: 'Nepal\'s most popular wildlife destination — spot rhinos, tigers, and elephants in their natural habitat.',
    type: 'trending',
  },
  {
    slug: 'eastern-nepal',
    label: 'Eastern Nepal',
    locationKeyword: 'Eastern Nepal',
    image: '/images/home/Eastern-nepal.jpg',
    description: 'Nepal\'s far east frontier — remote trails around Kanchenjunga, the world\'s third highest mountain.',
    type: 'trending',
  },
  {
    slug: 'pokhara',
    label: 'Pokhara',
    locationKeyword: 'Pokhara',
    image: '/images/home/pokhara.jpg',
    description: 'Nepal\'s adventure capital, nestled beside Phewa Lake with stunning Annapurna views.',
    type: 'trending',
  },
  {
    slug: 'rara-lake',
    label: 'Rara Lake',
    locationKeyword: 'Rara',
    image: '/images/home/rara.jpg',
    description: 'Nepal\'s largest lake hidden in the remote mid-west — crystal clear waters and untouched wilderness.',
    type: 'trending',
  },
  {
    slug: 'kathmandu-valley',
    label: 'Kathmandu',
    locationKeyword: 'Kathmandu',
    image: '/images/home/kathmandu.jpg',
    description: 'A cultural treasure trove with 7 UNESCO World Heritage Sites, ancient temples, and vibrant bazaars.',
    type: 'trending',
  },
  {
    slug: 'upper-mustang',
    label: 'Mustang',
    locationKeyword: 'Mustang',
    image: '/images/home/mustang.jpg',
    description: 'The forbidden kingdom — ancient Tibetan-influenced culture, cave monasteries, and desert landscapes.',
    type: 'trending',
  },
];

export default destinations;

export const topDestinations = destinations.filter(d => d.type === 'region');
export const trendingDestinations = destinations.filter(d => d.type === 'trending');
