'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef} from 'react';
import { ChevronLeft, ChevronRight, Clock, Mountain } from 'lucide-react';

const trips = [
    {
        id: 1,
        location: 'Paris, France',
        name: 'Centipede Tour – Guided Arizona Desert Tour by ATV',
        rating: 4.8,
        reviews: 243,
        duration: '4 days',
        altitude: '2,500m',
        difficulty: 'Moderate',
        price: 189.25,
        season: ['Apr', 'May', 'Sep', 'Oct'],
        image: '/images/home/card-1.svg',
        slug: 'centipede-arizona-desert-tour'
    },
    {
        id: 2,
        location: 'New York, USA',
        name: 'All Inclusive Ultimate Circle Island Day Tour with Lunch',
        rating: 4.8,
        reviews: 243,
        duration: '4 days',
        altitude: '1,200m',
        difficulty: 'Easy',
        price: 77.00,
        season: ['Jun', 'Jul', 'Aug', 'Sep'],
        image: '/images/home/card-2.svg',
        slug: 'circle-island-day-tour'
    },
    {
        id: 3,
        location: 'Paris, France',
        name: 'Centipede Tour – Guided Arizona Desert Tour by ATV',
        rating: 5.0,
        reviews: 260,
        duration: '4 days',
        altitude: '2,800m',
        difficulty: 'Hard',
        price: 189.25,
        season: ['Mar', 'Apr', 'Oct', 'Nov'],
        image: '/images/home/card-3.svg',
        slug: 'centipede-arizona-advanced-tour'
    },
    {
        id: 4,
        location: 'London, UK',
        name: 'Westminster Walking Tour & Westminster Abbey Entry',
        rating: 5.0,
        reviews: 120,
        duration: '4 days',
        altitude: '100m',
        difficulty: 'Easy',
        price: 943.00,
        season: ['May', 'Jun', 'Jul', 'Aug'],
        image: '/images/home/card-4.svg',
        slug: 'westminster-walking-tour'
    },
    {
        id: 5,
        location: 'London, UK',
        name: 'Westminster Walking Tour & Westminster Abbey Entry',
        rating: 5.0,
        reviews: 120,
        duration: '4 days',
        altitude: '150m',
        difficulty: 'Moderate',
        price: 943.00,
        season: ['Apr', 'May', 'Sep', 'Oct'],
        image: '/images/home/card-5.svg',
        slug: 'westminster-extended-tour'
    },
];

export default function PopularTrips() {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Function to scroll the trip cards left
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -370, behavior: 'smooth' });
        }
    };

    // Function to scroll the trip cards right
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 370, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative py-4">
            <div className="max-w-[1320px] mx-auto mt-[60px]">
                {/* Header and category filter */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">Popular Trips</h2>
                    <div className="flex gap-4 text-sm">
                        <Link href="#" className='text-gray-500 bg-[#fa7436] text-white px-4 py-2 rounded-lg'>See all</Link>
                    </div>
                </div>

                {/* Trip cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {trips.map((trip) => (
                        <Link 
                            key={trip.id} 
                            href={`/trip/${trip.slug}`}
                            className="block flex-shrink-0"
                        >
                            <div className="w-[350px] bg-white rounded-[8px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">
                                {/* Trip Image */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={trip.image}
                                        alt={trip.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Trip Details */}
                                <div className="p-6">
                                    {/* Location & Price */}
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-500">{trip.location}</p>
                                        <span className="text-md font-semibold text-gray-600">${trip.price}</span>
                                    </div>
                                    
                                    {/* Trip Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {trip.name}
                                    </h3>
                                    
                                    {/* Trip Info Grid */}
                                    <div className="space-y-3">
                                        {/* Duration, Altitude & Difficulty */}
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{trip.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Mountain className="w-4 h-4" />
                                                <span>{trip.altitude}</span>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-[12px] font-[500] ${
                                                    trip.difficulty === 'Hard' 
                                                        ? 'bg-red-100 text-red-600' 
                                                        : trip.difficulty === 'Moderate'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {trip.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating & Reviews */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-yellow-400">
                                                    {'★'.repeat(Math.floor(trip.rating))}
                                                    {trip.rating % 1 !== 0 && '☆'}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {trip.rating} ({trip.reviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Best Season */}
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-600 block mb-2">Best Time:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {trip.season.slice(0, 4).map((month, index) => (
                                                    <span 
                                                        key={index}
                                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {month}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Now Button */}
                                    <button className="w-full mt-6 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Scroll Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={scrollLeft}
                        className="bg-white p-2 rounded-full shadow hover:bg-[#fa7436]/10 transition"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="bg-white p-2 rounded-full shadow hover:bg-[#fa7436]/10 transition"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
