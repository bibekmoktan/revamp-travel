'use client';

import React from 'react';
import { CalendarCheck, MapPin, Route, ShieldCheck, BadgeDollarSign, HeadphonesIcon } from 'lucide-react';

const features = [
    {
        id: 1,
        icon: CalendarCheck,
        title: '20+ Years of Experience',
        description: 'Trusted by thousands of travelers across two decades of crafting Nepal journeys.',
    },
    {
        id: 2,
        icon: MapPin,
        title: 'Certified Local Guides',
        description: 'Government-certified guides with deep local knowledge on every route.',
    },
    {
        id: 3,
        icon: Route,
        title: 'Personalized Itineraries',
        description: 'Every trip tailored to your pace, preferences, and budget.',
    },
    {
        id: 4,
        icon: ShieldCheck,
        title: 'Safety First Approach',
        description: 'Rigorous safety protocols and emergency planning on all expeditions.',
    },
    {
        id: 5,
        icon: BadgeDollarSign,
        title: 'Transparent Pricing',
        description: 'No hidden costs — full price clarity from booking to return.',
    },
    {
        id: 6,
        icon: HeadphonesIcon,
        title: '24/7 Customer Support',
        description: 'Our team is always on call before, during, and after your trip.',
    },
];

export default function WhyTravelWithUs() {
    return (
        <section className="py-16 px-6 bg-[#F2FAFF]">
            <div className="max-w-[1320px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-[40px] font-bold text-gray-800 mb-3">
                        Why Travel With Us
                    </h2>
                    <p className="text-gray-500 text-[16px] max-w-[400px] mx-auto">
                        We go beyond booking we build journeys that stay with you long after you return home.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[900px] mx-auto">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.id} className="flex flex-col items-center text-center bg-white px-6 py-8 shadow-[0_1px_8px_rgba(0,0,0,0.08)] max-w-[300px] mx-auto w-full">
                                <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8 text-sky-700" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-[13px] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
