'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { tours } from '../../data/tours';

const categories = ['Adventure', 'Nature', 'Food'];

export default function FeaturedTrips() {
    const [activeCategory, setActiveCategory] = useState('Adventure');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Function to scroll the trip cards left
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    // Function to scroll the trip cards right
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative z-20 bg-[#fef6f3] py-16 px-6 md:px-16 rounded-t-[100px] -mt-[100px]">
            <div className="max-w-[1320px] mx-auto mt-[60px]">
                {/* Header and category filter */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">Featured Trips</h2>
                    <div className="flex gap-4 text-sm">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full border transition ${activeCategory === cat
                                    ? 'bg-[#fff] text-[#fa7436] border-[#fa7436]'
                                    : 'text-[#1e1e1e] border-transparent hover:bg-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trip cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 no-scrollbar"
                >
                    {tours.map((trip) => (
                        <Link 
                            key={trip.id} 
                            href={`/tour/${trip.slug}`}
                            className="block flex-shrink-0"
                        >
                            <div className="w-[300px] h-[392px] bg-white rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md cursor-pointer">
                                {/* Trip image */}
                                <div className="relative h-[192px] w-full z-0">
                                    <Image
                                        src={trip.image}
                                        alt={trip.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content section overlapping the image */}
                                <div className="relative z-10 -mt-6 bg-white rounded-t-[18px] p-4">
                                    <p className="text-xs text-gray-400">{trip.city}</p>
                                    <h3 className="text-sm font-semibold mt-1 line-clamp-2 hover:text-[#fa7436] transition-colors">
                                        {trip.title}
                                    </h3>
                                    
                                    {/* Rating display */}
                                    <div className="flex items-center gap-1 text-xs mt-2 text-gray-600">
                                        ⭐ {trip.rating} ({trip.reviews})
                                    </div>
                                    
                                    {/* Duration and price */}
                                    <div className="flex justify-between items-center mt-4 text-sm">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {trip.duration}
                                        </span>
                                        <span className="font-semibold text-right">
                                            From {trip.price}
                                        </span>
                                    </div>
                                    
                                    {/* Action buttons */}
                                    <div className="flex gap-2 mt-6">
                                        <button 
                                            className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-gray-200 transition"
                                            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking button
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className="flex-1 bg-[#fa7436] text-white text-sm font-medium px-4 py-2 rounded-full shadow-md hover:bg-[#e96124] transition"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent card navigation
                                                window.location.href = '/booking'; // Navigate to booking
                                            }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
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
