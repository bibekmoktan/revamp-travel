'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain, Grid, List } from 'lucide-react';
import { treks } from '../../data/treks';
import HeroImage from '../../../public/images/treks/bg-1.jpg';

export default function TrekkingPage() {
  // State to manage the current view (card or list)
  const [viewMode, setViewMode] = useState('card');

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={HeroImage}
            alt="Trekking adventure in the mountains"
            fill
            className="object-cover"
            priority
          />
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
        
        {/* Filter Section with View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
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

          {/* View Toggle Buttons */}
          <div className="flex bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'card'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trek Cards Grid View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <Link 
                key={trek.id} 
                href={`/trek/${trek.slug}`}
                className="block"
              >
                <div className="bg-white rounded-[8px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">
                  
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
        )}

        {/* Trek List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {treks.map((trek) => (
              <Link 
                key={trek.id} 
                href={`/trek/${trek.slug}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Trek Image */}
                    <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={trek.image}
                        alt={trek.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Trek Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        
                        {/* Header: Name, Location, Price */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {trek.name}
                            </h3>
                            <p className="text-gray-500">{trek.location}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className="text-2xl font-bold text-green-600">${trek.price}</span>
                          </div>
                        </div>

                        {/* Trek Info Row */}
                        <div className="flex flex-wrap gap-6 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{trek.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mountain className="w-5 h-5" />
                            <span className="font-medium">{trek.altitude}</span>
                          </div>
                          <div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-400 text-lg">
                            {'★'.repeat(Math.floor(trek.rating))}
                            {trek.rating % 1 !== 0 && '☆'}
                          </div>
                          <span className="text-gray-600">
                            {trek.rating} ({trek.reviews} reviews)
                          </span>
                        </div>

                        {/* Best Season and Action Button Row */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                          {/* Best Season */}
                          <div className="flex-1">
                            <span className="font-medium text-gray-700 block mb-2">Best Time to Visit:</span>
                            <div className="flex flex-wrap gap-2">
                              {trek.season.slice(0, 6).map((month, index) => (
                                <span 
                                  key={index}
                                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {month}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 whitespace-nowrap">
                              View Details & Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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