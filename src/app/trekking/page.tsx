'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain } from 'lucide-react';
import { treks } from '../../data/treks';

export default function TrekkingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-300">
          {/* Placeholder for background image */}
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">Background Image Placeholder</span>
          </div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Adventure Awaits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover breathtaking mountain adventures across the Himalayas
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 hover:shadow-lg">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Moderate</option>
            <option>Hard</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option>All Locations</option>
            <option>Nepal</option>
            <option>India</option>
            <option>Ladakh</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option>All Durations</option>
            <option>1-5 Days</option>
            <option>6-10 Days</option>
            <option>10+ Days</option>
          </select>
        </div>

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map((trek) => (
            <Link 
              key={trek.id} 
              href={`/trek/${trek.slug}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                
                {/* Trek Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={trek.image}
                    alt={trek.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trek.difficulty === 'Hard' 
                        ? 'bg-red-100 text-red-700' 
                        : trek.difficulty === 'Moderate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {trek.difficulty}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${trek.price}
                    </span>
                  </div>
                </div>

                {/* Trek Details */}
                <div className="p-6">
                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-2">{trek.location}</p>
                  
                  {/* Trek Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {trek.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {trek.description}
                  </p>

                  {/* Trek Info Grid */}
                  <div className="space-y-3">
                    {/* Duration & Altitude */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{trek.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mountain className="w-4 h-4" />
                        <span>{trek.altitude}</span>
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
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Best Time:</span> {trek.season.slice(0, 3).join(', ')}
                      {trek.season.length > 3 && '...'}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of trekkers who have experienced the magic of the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Custom Trek Planning
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors">
              Download Gear List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 