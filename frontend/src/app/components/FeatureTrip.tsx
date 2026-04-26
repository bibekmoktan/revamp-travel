'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from "motion/react";
import { packageCategories } from '../../data/packages';
import TrekCard from './TrekCard';
import type { ApiPackage } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

export default function FeaturedTrips() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [packages, setPackages] = useState<ApiPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams({ limit: '8', status: 'active' });
        fetch(`${API_BASE}/packages?${params}`)
            .then(r => r.json())
            .then(json => setPackages(json.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -370, behavior: 'smooth' });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 370, behavior: 'smooth' });

    return (
        <motion.section
            className="relative z-20 bg-sky-50 py-8 md:py-16 px-6 md:px-16 md:mt-[-150px]"
            initial={{ y: 300, opacity: 1 }}
            animate={{ y: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
            <div className="max-w-[1366px] mx-auto">

                {/* ── Category cards — untouched ── */}
                <div className="mb-12">
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {packageCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/packages/${category.slug}`}
                                    className="block flex-shrink-0"
                                >
                                    <div className="w-full max-w-[250px] max-h-[200px] bg-white rounded-[0px] overflow-hidden shadow-md group">
                                        {/* Package Image */}
                                        <div className="relative min-h-[120px] w-full overflow-hidden ">
                                            <Image
                                                src={category.image}
                                                alt={category.title}
                                                fill
                                                className="object-cover group-hover:scale-120 transition-all duration-600"
                                            />
                                        </div>

                                        {/* Package Content */}
                                        <div className="p-6">
                                            <h3 className="text-[16px] font-[500] text-black mb-1 leading-tight">
                                                {category.title}
                                            </h3>
                                            <p className="text-sky-600 font-[500] text-[14px]">
                                                {category.packageCount} Packages In the
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Best Seller header ── */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1e1e1e]">Best Seller</h2>
                    <Link href="/trekking" className="bg-sky-600 text-white text-sm px-4 py-2">
                        View All
                    </Link>
                </div>

                {/* ── Package cards from API ── */}
                {loading ? (
                    <div className="flex gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-[320px] flex-shrink-0 h-[500px] bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                        {packages.map((pkg) => (
                            <div key={pkg._id} className="w-[320px] flex-shrink-0">
                                <TrekCard package={pkg} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Scroll buttons */}
                {!loading && packages.length > 0 && (
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={scrollLeft}
                            className="bg-white p-2 rounded-full shadow hover:bg-sky-50 transition"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="bg-white p-2 rounded-full shadow hover:bg-sky-50 transition"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
