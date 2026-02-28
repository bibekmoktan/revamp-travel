'use client';

import React from 'react';
import { Zap, MapPin, Diamond, Award } from 'lucide-react';

// Features data matching the design image
const features = [
    {
        id: 1,
        icon: Zap,
        title: 'Ultimate flexibility',
        description: 'You\'re in control, with free cancellation and payment options to satisfy any plan or budget.',
        color: 'text-orange-500'
    },
    {
        id: 2,
        icon: MapPin,
        title: 'Memorable experiences',
        description: 'Browse and book tours and activities so incredible, you\'ll want to tell your friends.',
        color: 'text-orange-500'
    },
    {
        id: 3,
        icon: Diamond,
        title: 'Quality at our core',
        description: 'High-quality standards. Millions of reviews. A Tourz company.',
        color: 'text-orange-500'
    },
    {
        id: 4,
        icon: Award,
        title: 'Award-winning support',
        description: 'New price? New plan? No problem. We\'re here to help, 24/7.',
        color: 'text-orange-500'
    }
];

export default function WhyTravelWithUs() {
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-[1320px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why choose Tourz
                    </h2>
                </div>

                {/* Features Grid - 4 columns on desktop, responsive on smaller screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div 
                                key={feature.id}
                                className="text-center"
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
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