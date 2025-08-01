'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Mountain } from 'lucide-react';
import { motion } from "motion/react";
import { treks } from '../../data/treks';

// Travel package categories data
const travelPackages = [
    {
        id: 1,
        title: "Nepal Trekking",
        packageCount: "91 Packages",
        image: "/images/treks/bg-1.jpg", // Using string path instead of import
        bgColor: "bg-blue-100"
    },
    {
        id: 2,
        title: "One Day Activities in Nepal",
        packageCount: "17 Packages", 
        image: "/images/treks/bg-2.jpg",
        bgColor: "bg-purple-100"
    },
    {
        id: 3,
        title: "Nepal Tour Packages",
        packageCount: "26 Packages",
        image: "/images/treks/bg-2.jpg",
        bgColor: "bg-orange-100"
    },
    {
        id: 4,
        title: "Peak Climbing in Nepal",
        packageCount: "9 Packages",
        image: "/images/treks/bg-2.jpg",
        bgColor: "bg-blue-200"
    },
    {
        id: 5,
        title: "Helicopter Tour in Nepal",
        packageCount: "12 Packages",
        image: "/images/treks/bg-2.jpg",
        bgColor: "bg-gray-100"
    }
];

export default function FeaturedTrips() {
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
        <motion.section 
            className="relative z-20 bg-sky-50 py-8 px-6 md:px-16 rounded-t-[100px] -mt-[280px]"
            initial={{ y: 300, opacity: 1 }} // Start from bottom (100px down) with no opacity
            animate={{ y: 1, opacity: 1 }} // Move to original position with full opacity
            transition={{ 
                duration: 1, // Animation duration
                ease: "easeOut", // Smooth easing
                delay: 0.2 // Small delay for better effect
            }}
        >
            <div className="max-w-[1320px] mx-auto">
                {/* Travel Packages Section - Added before header */}
                <div className="mb-12">
                    {/* Package cards container */}
                    <div className="relative">
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                        >
                            {travelPackages.map((packageItem) => (
                                <Link 
                                    key={packageItem.id}
                                    href={`/packages/${packageItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block flex-shrink-0"
                                >
                                    <div className="w-full max-w-[250px] max-h-[200px] bg-white rounded-[0px] overflow-hidden shadow-md group">
                                        {/* Package Image */}
                                        <div className="relative min-h-[120px] w-full overflow-hidden ">
                                            <Image
                                                src={packageItem.image}
                                                alt={packageItem.title}
                                                fill
                                                className="object-cover group-hover:scale-120 transition-all duration-600"
                                            />
                                        </div>

                                        {/* Package Content */}
                                        <div className="p-6">
                                            <h3 className="text-[16px] font-[500] text-black mb-1 leading-tight">
                                                {packageItem.title}
                                            </h3>
                                            <p className="text-sky-600 font-[500] text-[14px]">
                                                {packageItem.packageCount}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Header and category filter */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">Featured Treks</h2>
                    <div className="flex gap-4 text-sm">
                        <Link href="/treks" className='text-gray-500 bg-sky-600 text-white px-4 py-2 rounded-lg'>View All</Link>
                    </div>
                </div>

                {/* Trek cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {treks.map((trek) => (
                        <Link 
                            key={trek.id} 
                            href={`/trek/${trek.slug}`}
                            className="block flex-shrink-0"
                        >
                            <div className="w-[350px] bg-white rounded-[8px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">
                                {/* Trek Image */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={trek.image}
                                        alt={trek.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Trek Details */}
                                <div className="p-6">
                                    {/* Location & Price */}
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-500">{trek.location}</p>
                                        <span className="text-md font-semibold text-gray-600">${trek.price}</span>
                                    </div>
                                    
                                    {/* Trek Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {trek.name}
                                    </h3>
                                    
                                    {/* Trek Info Grid */}
                                    <div className="space-y-3">
                                        {/* Duration, Altitude & Difficulty */}
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{trek.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Mountain className="w-4 h-4" />
                                                <span>{trek.altitude}</span>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-[12px] font-[500] ${
                                                    trek.difficulty === 'Hard' 
                                                        ? 'bg-red-100 text-red-600' 
                                                        : trek.difficulty === 'Moderate'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {trek.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating & Reviews */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-yellow-400">
                                                    {'★'.repeat(Math.floor(trek.rating))}
                                                    {trek.rating % 1 !== 0 && '☆'}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {trek.rating} ({trek.reviews} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Best Season */}
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-600 block mb-2">Best Time:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {trek.season.slice(0, 4).map((month, index) => (
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
                                    <button className="w-full mt-6 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg">
                                        View Details
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
        </motion.section>
    );
}
