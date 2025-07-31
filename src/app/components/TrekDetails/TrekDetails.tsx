'use client';

import { Trek } from '../../../data/treks';
import Image from 'next/image';
import { Star, Clock, Mountain, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface TrekDetailsProps {
  trek: Trek;
}

const TrekDetails = ({ trek }: TrekDetailsProps) => {
  // State for FAQ expansion
  const [expandedFaq, setExpandedFaq] = useState<number[]>(
    trek.faq.map((faq, index) => faq.isExpanded ? index : -1).filter(index => index !== -1)
  );

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            {trek.difficulty} Trek
          </span>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden">
            <Image
              src={trek.image}
              alt={trek.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trek</h2>
            <p className="text-gray-600 mb-4">{trek.description}</p>
            {trek.additionalDescription && (
              <p className="text-gray-600">{trek.additionalDescription}</p>
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

          {/* What's Included */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trek.includes.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary */}
          {trek.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {trek.itinerary.map((day, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      day.highlighted ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        day.highlighted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {day.day}
                      </div>
                      <h3 className="font-semibold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-11">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          <div className="sticky top-24">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              
              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">${trek.price}</span>
                <span className="text-gray-600 ml-1">per person</span>
              </div>

              {/* Trek Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{trek.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`font-medium ${
                    trek.difficulty === 'Hard' ? 'text-red-600' :
                    trek.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{trek.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium">{trek.groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ages:</span>
                  <span className="font-medium">{trek.ages}</span>
                </div>
              </div>

              {/* Best Season */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Best Trekking Season</h3>
                <div className="flex flex-wrap gap-2">
                  {trek.season.map((month, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {month}
                    </span>
                  ))}
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
    </div>
  );
};

export default TrekDetails; 