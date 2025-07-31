// Trek interface definition
export interface Trek {
  id: number;
  slug: string;
  name: string;
  location: string;
  duration: string;
  difficulty: string;
  price: number;
  rating: number;
  reviews: number;
  altitude: string;
  season: string[];
  image: string;
  description: string;
  highlights: string[];
  includes: string[];
  // Extended trek information
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

// Treks data array
export const treks: Trek[] = [
  {
    id: 1,
    slug: 'everest-base-camp-trek',
    name: "Everest Base Camp Trek",
    location: "Nepal",
    duration: "14 Days",
    difficulty: "Hard",
    price: 1299,
    rating: 4.9,
    reviews: 215,
    altitude: "5,364 m",
    season: ["March", "April", "May", "September", "October", "November"],
    image: "/images/treks/everest.jpeg",
    description: "Experience the breathtaking beauty of the Himalayas and reach the base of the world's highest mountain.",
    additionalDescription: "This iconic trek takes you through Sherpa villages, ancient monasteries, and stunning mountain landscapes. You'll experience the unique culture of the Khumbu region while challenging yourself physically and mentally on this once-in-a-lifetime adventure.",
    highlights: [
      "Scenic flight to Lukla",
      "Namche Bazaar cultural experience",
      "Panoramic views of Mt. Everest",
      "Kala Patthar sunrise"
    ],
    includes: [
      "Airport transfers in Kathmandu",
      "Domestic flights (Kathmandu-Lukla-Kathmandu)",
      "All accommodation during trek",
      "All meals during trek",
      "English speaking trekking guide",
      "Porter service (2 trekkers : 1 porter)",
      "All necessary permits and entry fees",
      "First aid medical kit",
      "All government and local taxes"
    ],
    groupSize: "12 people",
    ages: "16-65 yrs",
    languages: ["English", "Nepali"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Arrive at Tribhuvan International Airport. Transfer to hotel and trek briefing. Rest and prepare for the adventure ahead.",
        highlighted: true
      },
      {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        description: "Early morning scenic flight to Lukla (2,840m). Begin trek to Phakding (2,610m). Walking time: 3-4 hours."
      },
      {
        day: 3,
        title: "Phakding to Namche Bazaar",
        description: "Trek through beautiful pine forests and cross suspension bridges. Reach Namche Bazaar (3,440m), the gateway to Everest. Walking time: 6-7 hours."
      },
      {
        day: 4,
        title: "Acclimatization Day in Namche",
        description: "Rest day for acclimatization. Explore Namche Bazaar, visit local museums, and enjoy mountain views."
      },
      {
        day: 5,
        title: "Namche to Tengboche",
        description: "Trek to Tengboche (3,860m) with spectacular views of Everest, Lhotse, and Ama Dablam. Visit famous Tengboche Monastery. Walking time: 5-6 hours."
      },
      {
        day: 6,
        title: "Tengboche to Dingboche",
        description: "Continue to Dingboche (4,410m) through rhododendron forests and alpine landscapes. Walking time: 5-6 hours."
      },
      {
        day: 7,
        title: "Acclimatization Day in Dingboche",
        description: "Rest day for acclimatization. Optional hike to Nangkartshang Peak for better views and altitude adjustment."
      },
      {
        day: 8,
        title: "Dingboche to Lobuche",
        description: "Trek to Lobuche (4,910m) with stunning mountain views. Pass memorials of mountaineers. Walking time: 5-6 hours."
      },
      {
        day: 9,
        title: "Lobuche to EBC and back to Gorak Shep",
        description: "Early start to Everest Base Camp (5,364m). Return to Gorak Shep (5,140m) for overnight. Walking time: 7-8 hours.",
        highlighted: true
      },
      {
        day: 10,
        title: "Kala Patthar and return to Pheriche",
        description: "Early morning hike to Kala Patthar (5,545m) for sunrise views of Everest. Descend to Pheriche (4,240m). Walking time: 7-8 hours.",
        highlighted: true
      },
      {
        day: 11,
        title: "Pheriche to Namche Bazaar",
        description: "Descend through Tengboche to Namche Bazaar. Walking time: 6-7 hours."
      },
      {
        day: 12,
        title: "Namche to Lukla",
        description: "Final day of trekking back to Lukla. Celebrate completion of the trek. Walking time: 6-7 hours."
      },
      {
        day: 13,
        title: "Fly back to Kathmandu",
        description: "Morning flight back to Kathmandu. Rest and explore the city. Farewell dinner."
      },
      {
        day: 14,
        title: "Departure",
        description: "Transfer to airport for final departure or continue with other travel plans."
      }
    ],
    faq: [
      {
        question: "What is the best time for Everest Base Camp Trek?",
        answer: "The best times are pre-monsoon (March-May) and post-monsoon (September-November) when the weather is clear and stable.",
        isExpanded: true
      },
      {
        question: "Do I need previous trekking experience?",
        answer: "While previous trekking experience is helpful, it's not mandatory. Good physical fitness and mental preparation are essential.",
        isExpanded: false
      },
      {
        question: "What about altitude sickness?",
        answer: "We include acclimatization days and our guides are trained to recognize altitude sickness symptoms. Proper acclimatization is key.",
        isExpanded: false
      },
      {
        question: "What should I pack for the trek?",
        answer: "Essential items include warm clothing, trekking boots, sleeping bag, and personal medications. We provide a detailed packing list.",
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: "Adult",
        ageRange: "16+ years",
        price: 1299.00,
        quantity: 1
      },
      {
        type: "Student",
        ageRange: "16-25 years with ID",
        price: 1199.00,
        quantity: 1
      }
    ],
    extras: [
      {
        name: "Single Room Supplement",
        type: "per_booking",
        price: 150,
        description: "Private room accommodation in Kathmandu and during trek where available"
      },
      {
        name: "Personal Porter",
        type: "per_person",
        price: 200,
        description: "Dedicated porter for personal gear (up to 15kg)"
      },
      {
        name: "Helicopter Return from EBC",
        type: "per_person",
        price: 500,
        description: "Helicopter flight from Everest Base Camp to Lukla"
      }
    ]
  },
  {
    id: 2,
    slug: 'kedarkantha-trek',
    name: "Kedarkantha Trek",
    location: "Uttarakhand, India",
    duration: "6 Days",
    difficulty: "Moderate",
    price: 799,
    rating: 4.7,
    reviews: 180,
    altitude: "3,800 m",
    season: ["December", "January", "February", "March"],
    image: "/images/treks/kedarkantha.jpg",
    description: "Perfect for beginners, the Kedarkantha trek offers a snowy adventure with stunning summit views.",
    additionalDescription: "Known as the 'Queen of Winter Treks', Kedarkantha offers spectacular snow-covered landscapes, frozen lakes, and panoramic Himalayan views. This trek is perfect for first-time winter trekkers.",
    highlights: [
      "Snow-covered pine forests",
      "Stargazing nights at Juda Ka Talab",
      "Summit views of Swargarohini peaks"
    ],
    includes: [
      "Accommodation in base camp",
      "All meals during trek",
      "Experienced trek leader",
      "All necessary permits",
      "First aid medical kit",
      "Transportation from Dehradun"
    ],
    groupSize: "15 people",
    ages: "12-60 yrs",
    languages: ["English", "Hindi"],
    itinerary: [
      {
        day: 1,
        title: "Dehradun to Sankri",
        description: "Drive from Dehradun to Sankri village (1,950m). Check into guesthouse and rest.",
        highlighted: true
      },
      {
        day: 2,
        title: "Sankri to Juda Ka Talab",
        description: "Trek through beautiful oak and pine forests to Juda Ka Talab (2,438m). Frozen lake in winter. Walking time: 4-5 hours."
      },
      {
        day: 3,
        title: "Juda Ka Talab to Kedarkantha Base",
        description: "Ascend to Kedarkantha base camp (3,400m) through snow-covered meadows. Walking time: 4-5 hours."
      },
      {
        day: 4,
        title: "Summit Day and Return to Base",
        description: "Early morning summit attempt to Kedarkantha peak (3,800m). Return to base camp. Walking time: 7-8 hours.",
        highlighted: true
      },
      {
        day: 5,
        title: "Base to Sankri",
        description: "Descend back to Sankri village. Celebrate trek completion. Walking time: 6-7 hours."
      },
      {
        day: 6,
        title: "Sankri to Dehradun",
        description: "Drive back to Dehradun. End of trek."
      }
    ],
    faq: [
      {
        question: "Is this trek suitable for beginners?",
        answer: "Yes, Kedarkantha is perfect for beginners with moderate fitness. The trail is well-defined and gradual.",
        isExpanded: true
      },
      {
        question: "What gear do I need for winter trekking?",
        isExpanded: false
      },
      {
        question: "How cold does it get?",
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: "Adult",
        ageRange: "18+ years",
        price: 799.00,
        quantity: 1
      },
      {
        type: "Student",
        ageRange: "12-25 years",
        price: 699.00,
        quantity: 1
      }
    ],
    extras: [
      {
        name: "Sleeping Bag Rental",
        type: "per_person",
        price: 50,
        description: "High-quality winter sleeping bag rental"
      },
      {
        name: "Trekking Gear Package",
        type: "per_person",
        price: 100,
        description: "Complete trekking gear including jacket, pants, gloves, and gaiters"
      }
    ]
  },
  {
    id: 3,
    slug: 'markha-valley-trek',
    name: "Markha Valley Trek",
    location: "Ladakh, India",
    duration: "9 Days",
    difficulty: "Moderate",
    price: 999,
    rating: 4.8,
    reviews: 140,
    altitude: "5,200 m",
    season: ["June", "July", "August", "September"],
    image: "/images/treks/markha.jpg",
    description: "Traverse the high mountain passes and remote villages in the majestic Ladakhi landscapes.",
    additionalDescription: "Experience the unique culture of Ladakh while trekking through dramatic landscapes, ancient monasteries, and traditional villages. This trek offers stunning views of snow-capped peaks and insight into Ladakhi Buddhist culture.",
    highlights: [
      "Kongmaru La Pass",
      "Traditional Ladakhi homestays",
      "Scenic Hemis Monastery"
    ],
    includes: [
      "Accommodation in Leh",
      "All meals during trek",
      "Experienced local guide",
      "Homestay experiences",
      "All permits and fees",
      "Airport transfers in Leh"
    ],
    groupSize: "10 people",
    ages: "16-65 yrs",
    languages: ["English", "Ladakhi"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh",
        description: "Arrive in Leh (3,500m). Rest for acclimatization. Explore Leh market and palace.",
        highlighted: true
      },
      {
        day: 2,
        title: "Acclimatization Day",
        description: "Visit Hemis Monastery, Thiksey Monastery, and Shanti Stupa. Gentle acclimatization walks."
      },
      {
        day: 3,
        title: "Leh to Chilling to Skiu",
        description: "Drive to Chilling, begin trek to Skiu village (3,350m). Walking time: 3-4 hours."
      },
      {
        day: 4,
        title: "Skiu to Markha Village",
        description: "Trek through beautiful gorges to Markha village (3,750m). Experience village life. Walking time: 6-7 hours."
      },
      {
        day: 5,
        title: "Markha to Thachungtse",
        description: "Continue through Markha valley to Thachungtse (4,250m). Walking time: 5-6 hours."
      },
      {
        day: 6,
        title: "Thachungtse to Nimaling",
        description: "Trek to high altitude meadows at Nimaling (4,700m). Walking time: 4-5 hours."
      },
      {
        day: 7,
        title: "Nimaling via Kongmaru La to Chokdo",
        description: "Cross Kongmaru La pass (5,200m) and descend to Chokdo (3,750m). Walking time: 8-9 hours.",
        highlighted: true
      },
      {
        day: 8,
        title: "Chokdo to Hemis to Leh",
        description: "Trek to Hemis Monastery and drive back to Leh. Walking time: 2-3 hours."
      },
      {
        day: 9,
        title: "Departure from Leh",
        description: "Transfer to airport for departure."
      }
    ],
    faq: [
      {
        question: "When is the best time to trek in Ladakh?",
        answer: "June to September when the passes are open and weather is favorable for trekking.",
        isExpanded: true
      },
      {
        question: "Do I need special permits?",
        isExpanded: false
      },
      {
        question: "What about acute mountain sickness?",
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: "Adult",
        ageRange: "16+ years",
        price: 999.00,
        quantity: 1
      }
    ],
    extras: [
      {
        name: "Monastery Photography Permit",
        type: "per_person",
        price: 25,
        description: "Special permit for photography inside monasteries"
      }
    ]
  },
  {
    id: 4,
    slug: 'hampta-pass-trek',
    name: "Hampta Pass Trek",
    location: "Himachal Pradesh, India",
    duration: "5 Days",
    difficulty: "Moderate",
    price: 649,
    rating: 4.6,
    reviews: 130,
    altitude: "4,270 m",
    season: ["June", "July", "August", "September"],
    image: "/images/treks/hampta.jpg",
    description: "A dramatic crossover trek from lush green valleys of Kullu to arid landscapes of Spiti.",
    additionalDescription: "This unique trek showcases the dramatic contrast between the lush green Kullu valley and the barren beauty of Spiti. Cross the historic Hampta Pass and witness some of the most diverse landscapes in the Himalayas.",
    highlights: [
      "River crossings and alpine meadows",
      "Chandratal Lake visit",
      "Panoramic mountain views"
    ],
    includes: [
      "Accommodation in base camps",
      "All meals during trek",
      "Experienced trek guide",
      "Transportation from Manali",
      "All permits and fees"
    ],
    groupSize: "12 people",
    ages: "14-55 yrs",
    languages: ["English", "Hindi"],
    itinerary: [
      {
        day: 1,
        title: "Manali to Jobra to Chika",
        description: "Drive to Jobra (2,900m), trek to Chika campsite (3,050m). Walking time: 3-4 hours.",
        highlighted: true
      },
      {
        day: 2,
        title: "Chika to Balu Ka Gera",
        description: "Trek through forests and meadows to Balu Ka Gera (3,750m). Walking time: 4-5 hours."
      },
      {
        day: 3,
        title: "Balu Ka Gera via Hampta Pass to Shea Goru",
        description: "Cross Hampta Pass (4,270m) and descend to Shea Goru (3,750m). Walking time: 8-9 hours.",
        highlighted: true
      },
      {
        day: 4,
        title: "Shea Goru to Chandratal",
        description: "Trek to the beautiful Chandratal Lake (4,300m). Camp by the moonlight lake. Walking time: 5-6 hours."
      },
      {
        day: 5,
        title: "Chandratal to Manali",
        description: "Drive back to Manali via Rohtang Pass. End of trek."
      }
    ],
    faq: [
      {
        question: "What makes this trek special?",
        answer: "The dramatic landscape change from green valleys to desert mountains makes this trek unique in the Himalayas.",
        isExpanded: true
      },
      {
        question: "Is river crossing difficult?",
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: "Adult",
        ageRange: "14+ years",
        price: 649.00,
        quantity: 1
      }
    ],
    extras: [
      {
        name: "Chandratal Extension",
        type: "per_person",
        price: 150,
        description: "Extra day at Chandratal Lake with additional activities"
      }
    ]
  },
  {
    id: 5,
    slug: 'sandakphu-trek',
    name: "Sandakphu Trek",
    location: "West Bengal, India",
    duration: "7 Days",
    difficulty: "Easy to Moderate",
    price: 599,
    rating: 4.5,
    reviews: 90,
    altitude: "3,636 m",
    season: ["March", "April", "October", "November"],
    image: "/images/treks/sandakphu.jpg",
    description: "See four of the five highest peaks in the world in a single view along the India-Nepal border.",
    additionalDescription: "Known as the 'Trekker's Wonderland', this trek offers stunning views of the world's highest peaks including Everest, Kanchenjunga, Lhotse, and Makalu. Experience the unique culture of the Darjeeling hills and Nepal border region.",
    highlights: [
      "Views of Everest, Kanchenjunga, Lhotse, and Makalu",
      "Local Nepalese culture",
      "Rhododendron forests"
    ],
    includes: [
      "Accommodation in tea houses",
      "All meals during trek",
      "Local guide",
      "All permits and fees",
      "Transportation from Siliguri"
    ],
    groupSize: "14 people",
    ages: "12-65 yrs",
    languages: ["English", "Bengali", "Nepali"],
    itinerary: [
      {
        day: 1,
        title: "Siliguri to Manebhanjan to Chitrey",
        description: "Drive to Manebhanjan (2,134m), begin trek to Chitrey (2,850m). Walking time: 3-4 hours.",
        highlighted: true
      },
      {
        day: 2,
        title: "Chitrey to Sandakphu",
        description: "Trek to Sandakphu peak (3,636m) with stunning mountain views. Walking time: 5-6 hours."
      },
      {
        day: 3,
        title: "Sandakphu to Kalipokhri",
        description: "Trek along the Singalila Ridge to Kalipokhri (3,186m). Walking time: 4-5 hours."
      },
      {
        day: 4,
        title: "Kalipokhri to Bhalukop",
        description: "Continue ridge walk to Bhalukop (3,595m) with panoramic views. Walking time: 4-5 hours."
      },
      {
        day: 5,
        title: "Bhalukop to Rimbik",
        description: "Descend through rhododendron forests to Rimbik (2,286m). Walking time: 5-6 hours."
      },
      {
        day: 6,
        title: "Rimbik to Siliguri",
        description: "Drive back to Siliguri. Visit local tea gardens en route."
      },
      {
        day: 7,
        title: "Departure",
        description: "Transfer to airport or railway station for onward journey."
      }
    ],
    faq: [
      {
        question: "Can we really see 4 highest peaks?",
        answer: "Yes, on clear days you can see Everest, Kanchenjunga, Lhotse, and Makalu from Sandakphu peak.",
        isExpanded: true
      },
      {
        question: "When do rhododendrons bloom?",
        isExpanded: false
      }
    ],
    tickets: [
      {
        type: "Adult",
        ageRange: "12+ years",
        price: 599.00,
        quantity: 1
      }
    ],
    extras: [
      {
        name: "Tea Garden Tour",
        type: "per_person",
        price: 75,
        description: "Guided tour of famous Darjeeling tea gardens"
      }
    ]
  }
];

// Helper function to get trek by id
export function getTrekById(id: number): Trek | undefined {
  return treks.find(trek => trek.id === id);
}

// Helper function to get trek by slug
export function getTrekBySlug(slug: string): Trek | undefined {
  return treks.find(trek => trek.slug === slug);
}

// Helper function to get treks by difficulty level
export function getTreksByDifficulty(difficulty: string): Trek[] {
  return treks.filter(trek => trek.difficulty === difficulty);
}

// Helper function to get treks by location
export function getTreksByLocation(location: string): Trek[] {
  return treks.filter(trek => trek.location.includes(location));
}

// Helper function to get all trek IDs (useful for static generation)
export function getAllTrekIds(): number[] {
  return treks.map(trek => trek.id);
}

// Helper function to get all trek slugs (useful for static generation)
export function getAllTrekSlugs(): string[] {
  return treks.map(trek => trek.slug);
} 