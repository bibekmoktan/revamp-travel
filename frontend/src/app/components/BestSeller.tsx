'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrekCard from './TrekCard';
import type { ApiPackage } from '@/types/api';
import { getPackages } from '@/lib/api';

export default function BestSeller() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [packages, setPackages] = useState<ApiPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPackages({ limit: 8, status: 'active' })
            .then(res => setPackages(res.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -370, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 370, behavior: 'smooth' });

    return (
        <section className="py-16 px-6 md:px-16">
            <div className="max-w-[1366px] mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Best Sellers</h2>
                    <p className="text-gray-500 text-sm max-w-[440px] mx-auto mb-5">
                        Top-rated packages loved by thousands of travelers across Nepal and beyond.
                    </p>
                    <Link href="/trekking" className="inline-block bg-sky-600 hover:bg-sky-700 text-white text-sm px-5 py-2 transition">
                        View All
                    </Link>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="flex gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-[320px] flex-shrink-0 h-[500px] bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                        {packages.map((pkg) => (
                            <div key={pkg._id} className="w-[320px] flex-shrink-0 relative">
                                <div className="absolute top-3 left-3 z-10 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                                    Best Seller
                                </div>
                                <TrekCard package={pkg} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Scroll buttons */}
                {!loading && packages.length > 0 && (
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={scrollLeft} className="bg-white p-2 rounded-full shadow hover:bg-sky-50 transition">
                            <ChevronLeft />
                        </button>
                        <button onClick={scrollRight} className="bg-white p-2 rounded-full shadow hover:bg-sky-50 transition">
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
