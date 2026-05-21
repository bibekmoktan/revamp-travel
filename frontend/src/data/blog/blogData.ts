// Blog post data interface
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured: boolean;
  keyTakeaways?: string[];
  content?: { heading?: string; paragraph: string }[];
  finalThoughts?: { title?: string; paragraphs: string[] };
}

// Sample blog data
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "ultimate-guide-to-everest-base-camp-trek",
    title: "The Ultimate Guide to Everest Base Camp Trek",
    excerpt: "Everything you need to know about preparing for the world's most famous trek, from training tips to packing essentials.",
    image: "/images/blog/bg-2.jpg",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Trekking Guide",
    readTime: "8 min read",
    featured: true,
    keyTakeaways: [
      "The Everest Base Camp trek takes 12–14 days with steady altitude gain — no climbing experience required.",
      "Pre-monsoon (March–May) and post-monsoon (Oct–Nov) deliver the clearest views; avoid June–Aug for monsoon and flight delays.",
      "Three months of cardio + weighted hikes is the minimum prep — most injuries on the trail come from underestimating endurance.",
      "Layered clothing, a –15 °C sleeping bag, and broken-in boots are non-negotiable; everything else is preference.",
      "Two permits are required: Sagarmatha National Park + Khumbu Pasang Lhamu Rural Municipality.",
      "Acclimatization days are not optional — skipping them is the single biggest cause of altitude sickness on this trek.",
    ],
    content: [
      { paragraph: "The Everest Base Camp (EBC) trek is the bucket-list adventure for thousands of trekkers each year. Sitting at 5,364 m above sea level, the base camp itself is the gateway used by climbers attempting the world's highest summit — but for most of us, the journey to reach it is the reward." },
      { heading: "When to go", paragraph: "March–May (pre-monsoon) and late September–November (post-monsoon) offer the clearest skies and most stable weather. Winter is brutally cold but quieter on the trail; the monsoon season brings leeches, low visibility, and occasional flight cancellations to Lukla." },
      { heading: "Fitness & training", paragraph: "EBC is not a technical climb but it is a long, sustained effort — typically 12–14 days of walking 5–7 hours daily with steady altitude gain. Three months of cardio (running, cycling, stair climbing) plus weighted hikes on weekends will get you comfortably ready." },
      { heading: "Packing essentials", paragraph: "Layered clothing (base, fleece, down, shell), a sleeping bag rated to –15 °C, sturdy broken-in boots, a wide-brim hat, sunglasses with UV protection, a 1L water bottle plus purification tablets, sunscreen and lip balm with SPF, and a small first-aid kit with Diamox." },
      { heading: "Permits", paragraph: "You'll need the Sagarmatha National Park Entry Permit and the Khumbu Pasang Lhamu Rural Municipality Permit. Most agencies handle both, but solo trekkers can obtain them in Kathmandu or Monjo." },
      { heading: "Final word", paragraph: "Take the trek slowly, listen to your body, and prioritize acclimatization days. The mountains aren't going anywhere — your pace is the only thing that matters." },
    ],
    finalThoughts: {
      title: "Getting the Most Out of Your Everest Trek",
      paragraphs: [
        "Everest Base Camp gives you the route. What you take away from the journey depends on how thoughtfully you prepare. Pace, acclimatization, gear choices, route variations, and crew quality all have significant impact — and the difference between a smooth trek and a miserable one shows up directly in your altitude tolerance, daily energy, and the memories you bring home.",
        "This is where working with an experienced local operator matters. Travel Nepal has guided over a thousand trekkers up the Khumbu since 2005, with a team of certified Sherpa guides and a logistics network in every village along the trail.",
        "If you're planning your trek, considering a custom itinerary, or weighing variations like the Three Passes or a heli return, a conversation with our team is a practical starting point. We offer a free trip consultation to map out what's possible for your dates, fitness, and budget.",
      ],
    },
  },
  {
    id: 2,
    slug: "10-hidden-gems-in-the-himalayas",
    title: "10 Hidden Gems in the Himalayas",
    excerpt: "Discover lesser-known trails and peaks that offer stunning views without the crowds of popular destinations.",
    image: "/images/blog/bg-2.jpg",
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "Destinations",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 3,
    slug: "essential-gear-for-high-altitude-trekking",
    title: "Essential Gear for High Altitude Trekking",
    excerpt: "A comprehensive gear list for trekking above 4000m, tested by professional mountain guides.",
    image: "/images/blog/bg-2.jpg",
    author: "Emma Rodriguez",
    date: "March 10, 2024",
    category: "Gear Guide",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 4,
    slug: "photography-tips-for-mountain-adventures",
    title: "Photography Tips for Mountain Adventures",
    excerpt: "Capture stunning landscape photos during your treks with these professional photography techniques.",
    image: "/images/blog/bg-2.jpg",
    author: "David Park",
    date: "March 8, 2024",
    category: "Photography",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    slug: "acclimatization-key-to-safe-high-altitude-trekking",
    title: "Acclimatization: Your Key to Safe High Altitude Trekking",
    excerpt: "Understanding altitude sickness and how proper acclimatization can make or break your mountain adventure.",
    image: "/images/blog/bg-2.jpg",
    author: "Dr. Lisa Thompson",
    date: "March 5, 2024",
    category: "Health & Safety",
    readTime: "10 min read",
    featured: false
  },
  {
    id: 6,
    slug: "sustainable-trekking-leave-no-trace-principles",
    title: "Sustainable Trekking: Leave No Trace Principles",
    excerpt: "How to minimize your environmental impact while exploring the world's most pristine mountain regions.",
    image: "/images/blog/bg-2.jpg",
    author: "Green Trek Team",
    date: "March 3, 2024",
    category: "Sustainability",
    readTime: "4 min read",
    featured: false
  }
];

// Blog categories
export const categories = [
  "All", 
  "Trekking Guide", 
  "Destinations", 
  "Gear Guide", 
  "Photography", 
  "Health & Safety", 
  "Sustainability"
]; 