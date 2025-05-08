'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef} from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const trips = [
    {
        id: 1,
        city: 'Paris, France',
        title: 'Centipede Tour – Guided Arizona Desert Tour by ATV',
        rating: 4.8,
        reviews: 243,
        duration: '4 days',
        price: '$189.25',
        image: '/images/home/card-1.svg',
    },
    {
        id: 2,
        city: 'New York, USA',
        title: 'All Inclusive Ultimate Circle Island Day Tour with Lunch',
        rating: 4.8,
        reviews: 243,
        duration: '4 days',
        price: '$77.00',
        image: '/images/home/card-2.svg',
    },
    {
        id: 3,
        city: 'Paris, France',
        title: 'Centipede Tour – Guided Arizona Desert Tour by ATV',
        rating: 5.0,
        reviews: 260,
        duration: '4 days',
        price: '$189.25',
        image: '/images/home/card-3.svg',
    },
    {
        id: 4,
        city: 'London, UK',
        title: 'Westminster Walking Tour & Westminster Abbey Entry',
        rating: 5.0,
        reviews: 120,
        duration: '4 days',
        price: '$943.00',
        image: '/images/home/card-4.svg',
    },
    {
        id: 5,
        city: 'London, UK',
        title: 'Westminster Walking Tour & Westminster Abbey Entry',
        rating: 5.0,
        reviews: 120,
        duration: '4 days',
        price: '$943.00',
        image: '/images/home/card-5.svg',
    },
];

export default function PopularTrips() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative py-16 px-6 md:px-16">
            <div className="max-w-[1320px] mx-auto mt-[60px]">
                {/* Header and category filter */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">Popular Trips</h2>
                    <div className="flex gap-4 text-sm">
                        <Link href="#">See all</Link>
                    </div>

                </div>

                {/* Trip cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-2 no-scrollbar"
                >
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="w-[300px] h-[392px] bg-white rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md flex-shrink-0"
                        >
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
                                <h3 className="text-sm font-semibold mt-1 line-clamp-2">
                                    {trip.title}
                                </h3>
                                <div className="flex items-center gap-1 text-xs mt-2 text-gray-600">
                                    ⭐ {trip.rating} ({trip.reviews})
                                </div>
                                <div className="flex justify-between items-center mt-4 text-sm">

                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {trip.duration}
                                    </span>
                                    <span className="font-semibold text-right">
                                        From {trip.price}
                                    </span>
                                </div>
                                <Link href="/booking" className="">
                                    <button className="bg-[#fa7436] mt-6 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md hover:bg-[#e96124] transition">
                                        Book Now
                                    </button>
                                </Link>
                            </div>
                        </div>

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
