import React from 'react';
import { Tour } from '../../../data/tours';

// Define props interface for TourDetails component
interface TourDetailsProps {
  tour: Tour;
}

const TourDetails = ({ tour }: TourDetailsProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Home</span>
        <span>&gt;</span>
        <span>Tours</span>
        <span>&gt;</span>
        <span className="text-gray-900">{tour.city}</span>
      </div>

      {/* Tour Title and Info */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            Bestseller
          </span>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            Free cancellation
          </span>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {tour.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium text-gray-900">{tour.rating}</span>
            <span>({tour.reviews})</span>
          </div>
          <div>
            <span>{tour.location}</span>
          </div>
          <div>
            <span>300+ booked</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px] rounded-lg overflow-hidden">
        {/* Main Large Image - Left Side */}
        <div className="lg:col-span-2 relative">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">Main Image Placeholder</span>
          </div>
        </div>

        {/* Small Images Grid - Right Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Right Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image 2</span>
            </div>
          </div>

          {/* Top Right Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image 3</span>
            </div>
          </div>

          {/* Bottom Left Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image 4</span>
            </div>
          </div>

          {/* Bottom Right Image with "See all Photos" Button */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image 5</span>
            </div>
            
            {/* See all Photos Button - Positioned over the last image */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                See all Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details Content Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tour Overview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Overview</h2>
            
            {/* Tour Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                <p className="text-gray-900 font-medium">{tour.duration}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Group Size</h4>
                <p className="text-gray-900 font-medium">{tour.groupSize}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Ages</h4>
                <p className="text-gray-900 font-medium">{tour.ages}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Languages</h4>
                <p className="text-gray-900 font-medium">{tour.languages.join(', ')}</p>
              </div>
            </div>

            {/* Tour Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{tour.description}</p>
            
            {tour.additionalDescription && (
              <p className="text-gray-600 leading-relaxed">
                {tour.additionalDescription}
              </p>
            )}
          </div>

          {/* Tour Highlights */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tour Highlights</h3>
            <ul className="space-y-3">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">What&apos;s included</h3>
            
            {/* Two column grid for included items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {tour.includes.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Itinerary</h3>
            <div className="space-y-4">
              {tour.itinerary.map((day, index) => (
                <div key={index} className={`${day.highlighted ? 'bg-orange-50 border-orange-200' : 'border-gray-200'} border rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 ${day.highlighted ? 'bg-orange-500' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                      {day.day}
                    </div>
                    <h4 className="font-medium text-gray-900">Day {day.day}: {day.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm ml-8">
                    {day.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Map */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tour Map</h3>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {/* Map Container */}
              <div className="relative h-[400px] bg-gradient-to-br from-blue-900 via-blue-800 to-green-600">
                {/* Map Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {/* Location Markers */}
                    <div className="relative w-full h-full">
                      {/* Sample location markers */}
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                    
                    {/* Map Overlay Message */}
                    <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Google</span>
                        <button className="text-blue-600 text-sm">OK</button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">This page can't load Google Maps correctly.</p>
                      <p className="text-xs text-blue-600 underline cursor-pointer">Do you own this website?</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Labels */}
                <div className="absolute bottom-4 left-4 text-xs text-white opacity-70">
                  For development purposes only
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-white opacity-70">
                  For development purposes only
                </div>
                
                {/* Geographic Labels */}
                <div className="absolute top-16 left-16 text-white text-sm font-medium">
                  United States
                </div>
                <div className="absolute bottom-20 left-1/3 text-white text-sm font-medium">
                  Mexico
                </div>
                <div className="absolute top-1/3 right-16 text-white text-sm font-medium">
                  Atlantic Ocean
                </div>
              </div>
            </div>
          </div>

          {/* Availability Calendar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Availability Calendar</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex gap-8">
                  {/* February 2024 */}
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-4">February, 2024</h4>
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      {/* Header Days */}
                      <div className="text-orange-500 font-medium text-xs p-2">Sun</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Mon</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Tue</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Wed</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Thu</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Fri</div>
                      <div className="text-orange-500 font-medium text-xs p-2">Sat</div>
                      
                      {/* Calendar Days - February */}
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2 text-gray-600">1</div>
                      <div className="p-2 text-gray-600">2</div>
                      <div className="p-2 text-gray-600">3</div>
                      
                      <div className="p-2 text-gray-600">4</div>
                      <div className="p-2 text-gray-600">5</div>
                      <div className="p-2 text-gray-600">6</div>
                      <div className="p-2 text-gray-600">7</div>
                      <div className="p-2 text-gray-600">8</div>
                      <div className="p-2 bg-yellow-400 text-white rounded-lg font-medium">9</div>
                      <div className="p-2 text-gray-600">10</div>
                      
                      <div className="p-2 text-gray-600">11</div>
                      <div className="p-2 text-gray-600">12</div>
                      <div className="p-2 text-gray-600">13</div>
                      <div className="p-2 text-gray-600">14</div>
                      <div className="p-2 text-gray-600">15</div>
                      <div className="p-2 text-gray-600">16</div>
                      <div className="p-2 text-gray-600">17</div>
                      
                      <div className="p-2 text-gray-600">18</div>
                      <div className="p-2 text-gray-600">19</div>
                      <div className="p-2 text-gray-600">20</div>
                      <div className="p-2 text-gray-600">21</div>
                      <div className="p-2 text-gray-600">22</div>
                      <div className="p-2 text-gray-600">23</div>
                      <div className="p-2 text-gray-600">24</div>
                      
                      <div className="p-2 text-gray-600">25</div>
                      <div className="p-2 text-gray-600">26</div>
                      <div className="p-2 text-gray-600">27</div>
                      <div className="p-2 text-gray-600">28</div>
                      <div className="p-2 text-gray-600">29</div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                    </div>
                  </div>

                  {/* March 2024 */}
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-4">March, 2024</h4>
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      {/* Header Days */}
                      <div className="text-orange-500 font-medium text-xs p-2">Sun</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Mon</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Tue</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Wed</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Thu</div>
                      <div className="text-gray-600 font-medium text-xs p-2">Fri</div>
                      <div className="text-orange-500 font-medium text-xs p-2">Sat</div>
                      
                      {/* Calendar Days - March */}
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2 text-gray-600">1</div>
                      <div className="p-2 text-gray-600">2</div>
                      
                      <div className="p-2 text-gray-600">3</div>
                      <div className="p-2 text-gray-600">4</div>
                      <div className="p-2 text-gray-600">5</div>
                      <div className="p-2 text-gray-600">6</div>
                      <div className="p-2 text-gray-600">7</div>
                      <div className="p-2 text-gray-600">8</div>
                      <div className="p-2 text-gray-600">9</div>
                      
                      <div className="p-2 text-gray-600">10</div>
                      <div className="p-2 text-gray-600">11</div>
                      <div className="p-2 text-gray-600">12</div>
                      <div className="p-2 text-gray-600">13</div>
                      <div className="p-2 text-gray-600">14</div>
                      <div className="p-2 text-gray-600">15</div>
                      <div className="p-2 text-gray-600">16</div>
                      
                      <div className="p-2 text-gray-600">17</div>
                      <div className="p-2 text-gray-600">18</div>
                      <div className="p-2 text-gray-600">19</div>
                      <div className="p-2 text-gray-600">20</div>
                      <div className="p-2 text-gray-600">21</div>
                      <div className="p-2 text-gray-600">22</div>
                      <div className="p-2 text-gray-600">23</div>
                      
                      <div className="p-2 text-gray-600">24</div>
                      <div className="p-2 text-gray-600">25</div>
                      <div className="p-2 text-gray-600">26</div>
                      <div className="p-2 text-gray-600">27</div>
                      <div className="p-2 text-gray-600">28</div>
                      <div className="p-2 text-gray-600">29</div>
                      <div className="p-2 text-gray-600">30</div>
                      
                      <div className="p-2 text-gray-600">31</div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                      <div className="p-2"></div>
                    </div>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">FAQ</h3>
            <div className="space-y-4">
              {tour.faq.map((faqItem, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50">
                    <span className="font-medium text-gray-900">{faqItem.question}</span>
                    <div className={`w-6 h-6 ${faqItem.isExpanded ? 'bg-orange-500' : 'border border-gray-300'} rounded-full flex items-center justify-center`}>
                      <svg className={`w-4 h-4 ${faqItem.isExpanded ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {faqItem.isExpanded && faqItem.answer && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faqItem.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-500">From</span>
                <span className="text-3xl font-bold text-gray-900">{tour.price}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">From</span>
                <span className="text-sm text-gray-600">February 05 - March 14</span>
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Time</h4>
              <p className="text-sm text-gray-600">Full-day tour</p>
            </div>

            {/* Tickets */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tickets</h4>
              
              <div className="space-y-3">
                {tour.tickets.map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <span className="text-sm text-gray-900">{ticket.type} ({ticket.ageRange}) ${ticket.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{ticket.quantity}</span>
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Extra */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Extra</h4>
              
              <div className="space-y-3">
                {tour.extras.map((extra, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-900">{extra.name}</span>
                      </div>
                      <span className="text-sm text-gray-900">${extra.price}</span>
                    </div>
                    {extra.description && (
                      <div className="text-xs text-gray-500 ml-6 mt-1">
                        {extra.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-semibold text-gray-900">$530.00</span>
              </div>
            </div>

            {/* Book Now Button */}
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-3">
              Book Now
            </button>
            
            {/* Free Cancellation */}
            <p className="text-center text-sm text-gray-500">
              Free cancellation up to 24 hours before
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;

