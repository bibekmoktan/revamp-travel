'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mountain, Star, Grid, List } from 'lucide-react';
import { Package, CategoryInfo } from '../../../types/package';

interface PackageCategoryProps {
  packages: Package[];
  categoryInfo: CategoryInfo;
}

/**
 * Complete package category component
 * Displays hero, filters, package views (card/list), and CTA section
 */
export default function PackageCategory({ packages, categoryInfo }: PackageCategoryProps) {
  // State for view mode (card or list)
  const [viewMode, setViewMode] = useState('card');
  
  // State for filtered packages
  const [filteredPackages, setFilteredPackages] = useState(packages);

  /**
   * Filter packages by duration range
   */
  const filterByDuration = (duration: string) => {
    if (duration === 'all') {
      setFilteredPackages(packages);
      return;
    }
    
    const filtered = packages.filter(pkg => {
      const days = parseInt(pkg.duration);
      switch (duration) {
        case '1-3': return days >= 1 && days <= 3;
        case '4-7': return days >= 4 && days <= 7;
        case '8-15': return days >= 8 && days <= 15;
        case '15+': return days > 15;
        default: return true;
      }
    });
    setFilteredPackages(filtered);
  };

  /**
   * Filter packages by price range
   */
  const filterByPrice = (priceRange: string) => {
    if (priceRange === 'all') {
      setFilteredPackages(packages);
      return;
    }
    
    const filtered = packages.filter(pkg => {
      switch (priceRange) {
        case '0-500': return pkg.price <= 500;
        case '500-1000': return pkg.price > 500 && pkg.price <= 1000;
        case '1000-2000': return pkg.price > 1000 && pkg.price <= 2000;
        case '2000+': return pkg.price > 2000;
        default: return true;
      }
    });
    setFilteredPackages(filtered);
  };

  /**
   * Clear all filters and reset dropdowns
   */
  const clearFilters = () => {
    setFilteredPackages(packages);
    // Reset filter dropdowns to "all"
    const selects = document.querySelectorAll('select');
    selects.forEach(select => (select as HTMLSelectElement).value = 'all');
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={categoryInfo.heroImage}
            alt={categoryInfo.title}
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
              {categoryInfo.title}
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              {categoryInfo.description}
            </p>
            
            {/* Package count badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <span className="text-2xl font-bold text-white">
                {categoryInfo.packageCount} Packages Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
            {/* Duration Filter */}
            <select 
              onChange={(e) => filterByDuration(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">All Durations</option>
              <option value="1-3">1-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="8-15">8-15 Days</option>
              <option value="15+">15+ Days</option>
            </select>
            
            {/* Price Filter */}
            <select 
              onChange={(e) => filterByPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">All Prices</option>
              <option value="0-500">Under $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000+">$2000+</option>
            </select>
            
            {/* Results Count */}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">{filteredPackages.length} packages found</span>
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex bg-white border border-gray-300 rounded-lg p-1">
            {/* Card View Button */}
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
            
            {/* List View Button */}
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

        {/* Package Cards Grid View */}
        {viewMode === 'card' && filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Link 
                key={pkg.id} 
                href={`/package/${pkg.slug}`}
                className="block flex-shrink-0"
              >
                <div className="w-full max-w-[400px] max-h-[600px] bg-white rounded-[8px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200">
                  
                  {/* Package Image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Package Details */}
                  <div className="p-6">
                    {/* Location & Price Row */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">{pkg.location}</p>
                      <span className="text-md font-semibold text-gray-600">${pkg.price}</span>
                    </div>
                    
                    {/* Package Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {pkg.title}
                    </h3>
                    
                    {/* Package Info Section */}
                    <div className="space-y-3">
                      {/* Duration, Altitude & Difficulty Row */}
                      <div className="flex justify-between items-center text-sm">
                        {/* Duration */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{pkg.duration}</span>
                        </div>
                        
                        {/* Altitude */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <Mountain className="w-4 h-4" />
                          <span>{pkg.altitude}</span>
                        </div>
                        
                        {/* Difficulty Badge */}
                        {pkg.difficulty && (
                          <div>
                            <span className={`px-3 py-1 rounded-full text-[12px] font-[500] ${
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
                      </div>

                      {/* Rating & Reviews Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {/* Star Rating */}
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(pkg.rating))}
                            {pkg.rating % 1 !== 0 && '☆'}
                          </div>
                          <span className="text-sm text-gray-600">
                            {pkg.rating} ({pkg.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Best Season Section */}
                      <div className="text-sm">
                        <span className="font-medium text-gray-600 block mb-2">Best Time:</span>
                        <div className="flex flex-wrap gap-2">
                          {pkg.bestSeason.slice(0, 4).map((month, index) => (
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

                    {/* View Details Button */}
                    <button className="w-full mt-6 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Package List View */}
        {viewMode === 'list' && filteredPackages.length > 0 && (
          <div className="space-y-6">
            {filteredPackages.map((pkg) => (
              <Link 
                key={pkg.id} 
                href={`/package/${pkg.slug}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Package Image */}
                    <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      {/* Price badge - positioned in top right */}
                      <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
                        ${pkg.price}
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        
                        {/* Header: Name, Location & Rating */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                          <div>
                            {/* Package Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {pkg.title}
                            </h3>
                            {/* Location */}
                            <p className="text-gray-500">{pkg.location}</p>
                          </div>
                          
                          {/* Rating Section */}
                          <div className="mt-2 sm:mt-0 flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold">{pkg.rating}</span>
                            <span className="text-gray-500">({pkg.reviews} reviews)</span>
                          </div>
                        </div>

                        {/* Package Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {pkg.description}
                        </p>

                        {/* Package Info Row */}
                        <div className="flex flex-wrap gap-6 mb-4">
                          {/* Duration */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{pkg.duration}</span>
                          </div>
                          
                          {/* Altitude */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mountain className="w-5 h-5" />
                            <span className="font-medium">{pkg.altitude}</span>
                          </div>
                          
                          {/* Difficulty Badge */}
                          {pkg.difficulty && (
                            <div>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                        </div>

                        {/* Bottom Row: Best Season and Action Button */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                          {/* Best Season */}
                          <div className="flex-1">
                            <span className="font-medium text-gray-700 block mb-2">Best Time to Visit:</span>
                            <div className="flex flex-wrap gap-2">
                              {pkg.bestSeason.slice(0, 6).map((month, index) => (
                                <span 
                                  key={index}
                                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {month}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* View Details Button */}
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

        {/* Empty State - when no packages match filters */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            {/* No packages found heading */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No packages found
            </h3>
            
            {/* Help text */}
            <p className="text-gray-600 mb-8">
              Try adjusting your filters to see more options
            </p>
            
            {/* Clear filters button */}
            <button 
              onClick={clearFilters}
              className="bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl p-12">
          {/* Main heading */}
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          
          {/* Description text */}
          <p className="text-xl mb-8 text-sky-100">
            Experience the magic of Nepal with our carefully crafted {categoryInfo.title.toLowerCase()} packages
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Custom Package Planning Button */}
            <button className="bg-white text-sky-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Custom Package Planning
            </button>
            
            {/* Contact Experts Button */}
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-sky-600 transition-colors duration-200">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 