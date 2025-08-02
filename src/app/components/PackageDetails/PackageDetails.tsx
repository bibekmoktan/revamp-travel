'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, Users, MapPin, Star, ArrowLeft, Mountain, CheckCircle,
  ChevronDown, ChevronUp, Phone, Mail 
} from 'lucide-react';
import { Package } from '../../../types/package';

interface PackageDetailsProps {
  package: Package;
}

/**
 * Complete package details component
 * Displays all package information including hero, tabs, and sidebar
 */
export default function PackageDetails({ package: pkg }: PackageDetailsProps) {
  // State for expandable itinerary sections
  const [expandedItinerary, setExpandedItinerary] = useState<number[]>([1]);
  
  // State for selected tab
  const [selectedTab, setSelectedTab] = useState('overview');

  /**
   * Toggle itinerary day expansion
   */
  const toggleItineraryDay = (day: number) => {
    setExpandedItinerary(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'includes', label: 'What\'s Included' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-end h-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {/* Back button */}
            <Link 
              href={`/packages/${pkg.category}`}
              className="inline-flex items-center gap-2 text-white mb-6 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {pkg.category.replace('-', ' ')}</span>
            </Link>
            
            {/* Main hero content */}
            <div className="text-white">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                
                {/* Package Information */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {pkg.title}
                  </h1>
                  
                  {/* Package details row */}
                  <div className="flex flex-wrap gap-4 text-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{pkg.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{pkg.groupSize}</span>
                    </div>
                  </div>
                </div>
                
                {/* Pricing and Booking Card */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 lg:min-w-[300px]">
                  <div className="text-center">
                    {/* Price */}
                    <div className="text-3xl font-bold mb-2">${pkg.price}</div>
                    <div className="text-sm opacity-90 mb-4">per person</div>
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{pkg.rating}</span>
                      <span className="opacity-90">({pkg.reviews} reviews)</span>
                    </div>
                    
                    {/* Book Now Button */}
                    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      selectedTab === tab.id
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content - Overview */}
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* Description Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Difficulty Level */}
                  {pkg.difficulty && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Difficulty Level</h3>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        pkg.difficulty === 'Technical' || pkg.difficulty === 'Challenging'
                          ? 'bg-red-100 text-red-600' 
                          : pkg.difficulty === 'Moderate to Challenging' || pkg.difficulty === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {pkg.difficulty}
                      </span>
                    </div>
                  )}
                  
                  {/* Maximum Altitude */}
                  {pkg.altitude && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2">Maximum Altitude</h3>
                      <div className="flex items-center gap-2">
                        <Mountain className="w-5 h-5 text-gray-600" />
                        <span className="text-lg font-medium">{pkg.altitude}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Best Season */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Best Season</h3>
                    <div className="flex flex-wrap gap-2">
                      {pkg.bestSeason.map((month, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Group Size */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">Group Size</h3>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="text-lg font-medium">{pkg.groupSize}</span>
                    </div>
                  </div>
                </div>

                {/* Trip Highlights */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content - Itinerary */}
            {selectedTab === 'itinerary' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Day by Day Itinerary</h2>
                
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="bg-white rounded-lg shadow-sm border">
                      {/* Day Header - Clickable to expand/collapse */}
                      <button
                        onClick={() => toggleItineraryDay(day.day)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          {/* Day Number Badge */}
                          <div className="bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                            {day.day}
                          </div>
                          
                          {/* Day Information */}
                          <div>
                            <h3 className="font-semibold text-gray-900">{day.title}</h3>
                            <p className="text-gray-600 text-sm">{day.description}</p>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Icon */}
                        {expandedItinerary.includes(day.day) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      {/* Expanded Content - Activities List */}
                      {expandedItinerary.includes(day.day) && (
                        <div className="px-6 pb-6">
                          <div className="ml-14">
                            <h4 className="font-medium text-gray-900 mb-3">Activities:</h4>
                            <ul className="space-y-2">
                              {day.activities.map((activity, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                                  <span className="text-gray-600">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content - What's Included */}
            {selectedTab === 'includes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What&apos;s Included</h2>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    {pkg.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Package</h3>
                
                <div className="space-y-4">
                  {/* Price Display */}
                  <div className="text-center py-4 bg-sky-50 rounded-lg">
                    <div className="text-3xl font-bold text-sky-600">${pkg.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{pkg.rating}</span>
                    <span className="text-gray-500">({pkg.reviews} reviews)</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    Book Now
                  </button>
                  
                  <button className="w-full border border-sky-600 text-sky-600 hover:bg-sky-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    Request Custom Quote
                  </button>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
                
                <div className="space-y-4">
                  {/* Phone Contact */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="font-medium">Call Us</div>
                      <div className="text-sm text-gray-600">+977-1-123-4567</div>
                    </div>
                  </div>
                  
                  {/* Email Contact */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="font-medium">Email Us</div>
                      <div className="text-sm text-gray-600">info@travelnepal.com</div>
                    </div>
                  </div>
                  
                  {/* Live Chat Button */}
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Live Chat
                  </button>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
                
                <div className="space-y-3 text-sm">
                  {/* Duration */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{pkg.duration}</span>
                  </div>
                  
                  {/* Group Size */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-medium">{pkg.groupSize}</span>
                  </div>
                  
                  {/* Difficulty */}
                  {pkg.difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium">{pkg.difficulty}</span>
                    </div>
                  )}
                  
                  {/* Max Altitude */}
                  {pkg.altitude && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Altitude:</span>
                      <span className="font-medium">{pkg.altitude}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 