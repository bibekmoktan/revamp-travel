'use client';

import { Trek } from '../../../data/treks';
import Image from 'next/image';
import { Star, Clock, Mountain, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import PopularTreks from '../PopularTreks';

interface TrekDetailsProps {
  trek: Trek;
}

const TrekDetails = ({ trek }: TrekDetailsProps) => {
  // State for FAQ expansion
  const [expandedFaq, setExpandedFaq] = useState<number[]>(
    trek.faq.map((faq, index) => faq.isExpanded ? index : -1).filter(index => index !== -1)
  );

  // State for itinerary expansion - Day 1 (index 0) open by default
  const [expandedItinerary, setExpandedItinerary] = useState<number[]>([0]);

  // State for description expansion
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // State for ticket quantities
  const [ticketQuantities, setTicketQuantities] = useState<{[key: string]: number}>(
    trek.tickets.reduce((acc, ticket) => ({
      ...acc,
      [ticket.type]: ticket.quantity
    }), {})
  );

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaq(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Toggle itinerary expansion
  const toggleItinerary = (index: number) => {
    setExpandedItinerary(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Toggle description expansion
  const toggleDescription = () => {
    setIsDescriptionExpanded(prev => !prev);
  };

  // Update ticket quantity
  const updateTicketQuantity = (type: string, change: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + change)
    }));
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    trek.tickets.forEach(ticket => {
      total += ticket.price * (ticketQuantities[ticket.type] || 0);
    });
    return total;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Home</span>
        <span>&gt;</span>
        <span>Trekking</span>
        <span>&gt;</span>
        <span className="text-gray-900">{trek.location}</span>
      </div>

      {/* Trek Title and Info */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
            {trek.difficulty} Trek
          </span>
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
            {trek.season.length > 3 ? 'Year Round' : 'Seasonal'}
          </span>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {trek.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{trek.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mountain className="w-4 h-4" />
            <span>Max Altitude: {trek.altitude}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{trek.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Group Size: {trek.groupSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{trek.rating} ({trek.reviews} reviews)</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery Section - Same design as TourDetails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px] rounded-lg overflow-hidden mb-12">
        {/* Main Large Image - Left Side */}
        <div className="lg:col-span-2 relative">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <Image
              src={trek.image}
              alt={trek.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Small Images Grid - Right Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Left Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={trek.image}
                alt={`${trek.name} - View 2`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Top Right Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={trek.image}
                alt={`${trek.name} - View 3`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Left Image */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={trek.image}
                alt={`${trek.name} - View 4`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Right Image with "See all Photos" Button */}
          <div className="relative">
            <div className="w-full h-[192px] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={trek.image}
                alt={`${trek.name} - View 5`}
                fill
                className="object-cover"
              />
            </div>
            
            {/* See all Photos Button - Positioned over the last image */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                See all Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          
          {/* Best Season */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Trekking Season</h2>
            <div className="flex flex-wrap gap-2">
              {trek.season.map((month, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-sky-100 text-sky-700 text-sm font-medium rounded-full"
                >
                  {month}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trek</h2>
            <p className="text-gray-600 mb-4">{trek.description}</p>
            
            {trek.additionalDescription && (
              <>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isDescriptionExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-gray-600 mb-4">{trek.additionalDescription}</p>
                </div>
                
                <button
                  onClick={toggleDescription}
                  className="text-gray-600 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                >
                  {isDescriptionExpanded ? (
                    <>
                      See less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      See more
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Highlights */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trek Highlights</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trek.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included & Not Included */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* What's Included - Left Side */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {trek.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Not Included - Right Side */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  What&apos;s Not Included
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Personal trekking equipment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Travel insurance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Personal expenses (drinks, snacks, souvenirs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Tips for guides and porters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Emergency evacuation costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">International flights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Visa fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Extra accommodation in cities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Customize & Download Itinerary */}
          <div className="bg-gradient-to-r from-sky-300 to-gray-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of trekkers who have experienced the magic of the Himalayas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-sky-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg">
                Custom Trek Planning
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-sky-600 font-semibold py-3 px-8 rounded-full transition-all duration-200">
                Download Itinerary
              </button>
            </div>
          </div>

          {/* Itinerary */}
          {trek.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {trek.itinerary.map((day, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg transition-all duration-300 ease-in-out ${
                      expandedItinerary.includes(index) ? 'border-sky-200 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleItinerary(index)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">Day {day.day}: {day.title}</h3>
                      </div>
                      <div className="transition-transform duration-300 ease-in-out">
                        {expandedItinerary.includes(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedItinerary.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-4 pb-4">
                        <p className="text-gray-600 ml-11 leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trek Route to Everest</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Everest+Base+Camp+Trek+Route,+Nepal&t=p&z=11&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Everest Base Camp Trek Route Map"
                className="w-full"
              />
            </div>
          </div>

          {/* FAQ Section */}
          {trek.faq.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {trek.faq.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFaq.includes(index) && faq.answer && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Widget */}
        <div className="lg:col-span-1">
          <div className="">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              
              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">${trek.price}</span>
                <span className="text-gray-600 ml-1">per person</span>
              </div>

              {/* Trek Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium">{trek.groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ages:</span>
                  <span className="font-medium">{trek.ages}</span>
                </div>
              </div>

              {/* Ticket Selection */}
              {trek.tickets.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Select Tickets</h3>
                  {trek.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-medium">{ticket.type}</div>
                        <div className="text-sm text-gray-600">{ticket.ageRange}</div>
                        <div className="text-sm font-medium">${ticket.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateTicketQuantity(ticket.type, -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{ticketQuantities[ticket.type] || 0}</span>
                        <button
                          onClick={() => updateTicketQuantity(ticket.type, 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extras */}
              {trek.extras.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Add-on Services</h3>
                  {trek.extras.map((extra, index) => (
                    <div key={index} className="flex justify-between items-center mb-2 text-sm">
                      <div>
                        <div className="font-medium">{extra.name}</div>
                        {extra.description && (
                          <div className="text-gray-600">{extra.description}</div>
                        )}
                      </div>
                      <span className="font-medium">${extra.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Price */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Book This Trek
              </button>

              {/* Contact Info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Questions? Call us at <span className="font-medium">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Trips Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">You may also like</h2>
          <p className="text-gray-600">Discover more amazing trekking adventures</p>
        </div>
        <PopularTreks />
      </div>
    </div>
  );
};

export default TrekDetails; 