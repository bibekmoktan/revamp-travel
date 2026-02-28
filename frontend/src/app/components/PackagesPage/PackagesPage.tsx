import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { PackageCategory } from '../../../types/package';

interface PackagesPageProps {
    categories: PackageCategory[];
    totalPackages: number;
}

/**
 * Complete packages page component
 * Displays hero, introduction, categories grid, benefits, and CTA sections
 */
export default function PackagesPage({ categories, totalPackages }: PackagesPageProps) {
    return (
        <div className="min-h-screen bg-[#F3F6FB]">
            {/* Hero Section */}
            <div className="relative w-full h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/treks/bg-1.jpg"
                        alt="Nepal Travel Packages"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center text-white max-w-4xl px-4">
                        {/* Main title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Travel Packages
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl mb-8 text-gray-200">
                            Discover Nepal&apos;s diverse adventures with our carefully crafted travel packages
                        </p>

                        {/* Total packages badge */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                            <span className="text-2xl font-bold text-white">
                                {totalPackages} Total Packages
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Introduction Section */}
                <div className="text-center mb-16">
                    {/* Main heading */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Choose Your Adventure
                    </h2>

                    {/* Description text */}
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From challenging mountain treks to cultural heritage tours, from thrilling helicopter rides to peaceful one-day activities.
                        Find the perfect package that matches your travel style and adventure spirit.
                    </p>
                </div>

                {/* Package Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/packages/${category.slug}`}
                            className="group block"
                        >
                            <div className="flex flex-col bg-white max-w-[400px] min-h-[450px] max-h-[450px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 relative">

                                {/* Category Image */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />

                                    {/* Package count badge */}
                                    <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-lg font-bold">
                                        {category.packageCount} Packages
                                    </div>

                                    {/* Gradient overlay - appears on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Category Content */}
                                <div className="p-4 flex flex-col justify-between">
                                    {/* Category title */}
                                    <h3 className="text-[24px] font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">
                                        {category.title}
                                    </h3>

                                    {/* Category description */}
                                    <p className="text-gray-600 mb-2 leading-[1.22] text-[16px]">
                                        {category.description}
                                    </p>
                                </div>
                                {/* Footer: Package count and explore link */}
                                <div className="flex items-center justify-between gap-[100px] absolute bottom-8 left-4">
                                    <span className="text-sky-600 font-semibold">
                                        {category.packageCount} packages available
                                    </span>

                                    {/* Explore link with arrow - slides on hover */}
                                    <div className="flex items-center gap-2 text-sky-600 group-hover:translate-x-2 transition-transform duration-200">
                                        <span className="font-medium">Explore</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Why Choose Our Packages Section */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Packages?
                        </h2>
                        <p className="text-xl text-gray-600">
                            We provide complete travel solutions with expert guidance and local knowledge
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Complete Packages Benefit */}
                        <div className="text-center">
                            <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-sky-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Packages</h3>
                            <p className="text-gray-600">
                                Everything included - accommodation, meals, guides, permits, and transportation
                            </p>
                        </div>

                        {/* Expert Guides Benefit */}
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guides</h3>
                            <p className="text-gray-600">
                                Local, licensed, and experienced guides who know the terrain and culture
                            </p>
                        </div>

                        {/* Safety First Benefit */}
                        <div className="text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
                            <p className="text-gray-600">
                                Comprehensive safety measures, insurance coverage, and emergency support
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="mt-16 text-center bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl p-12">
                    {/* Main heading */}
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Your Adventure?
                    </h2>

                    {/* Description text */}
                    <p className="text-xl mb-8 text-sky-100">
                        Browse our packages or contact us for a custom itinerary tailored to your preferences
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Browse All Packages Button */}
                        <button className="bg-white text-sky-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            Browse All Packages
                        </button>

                        {/* Plan Custom Trip Button */}
                        <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-sky-600 transition-colors duration-200">
                            Plan Custom Trip
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 