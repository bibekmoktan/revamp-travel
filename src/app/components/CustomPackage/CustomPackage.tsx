'use client';

import { tr } from 'framer-motion/client';
import { useState } from 'react';

// Main component for custom trekking package form
const CustomPackage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    // Trip Details
    tripType: '',
    approxDateOfTravel: '',
    approxStartDate: '',
    approxEndDate: '',
    tripDuration: '',
    numberOfAdults: '',
    numberOfChildren: '',
    hotelType: '',
    estimatedBudget: '',
    guideLanguage: '',
    moreInformation: '',
    
    // Personal Information
    fullName: '',
    emailAddress: '',
    phoneNumberWithCountryCode: '',
    selectYourCountry: '',
    whereDidYouFindUs: ''
  });

  // State to manage popup modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(true);

  // Handle input changes for all form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Custom Trekking Package Form Data:', formData);
    // Here you would typically send data to your backend
    
    // Show success modal instead of browser alert
    setShowSuccessModal(true);
  };

  // Close the success modal
  const closeModal = () => {
    setShowSuccessModal(false);
    // Optionally reset form after successful submission
    // setFormData({ /* reset to initial state */ });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tailored Trekking Package</h1>
        
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Trip Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                Trip Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Trip Type */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Trip Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">---- Select One Option ----</option>
                    <option value="trekking">Trekking</option>
                    <option value="hiking">Hiking</option>
                    <option value="mountaineering">Mountaineering</option>
                    <option value="adventure">Adventure Tour</option>
                    <option value="cultural">Cultural Tour</option>
                  </select>
                </div>
                {/* Approx Start Date */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Approx Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="approxStartDate"
                      value={formData.approxStartDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Approx End Date */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Approx End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="approxEndDate"
                      value={formData.approxEndDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Trip Duration */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Trip Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tripDuration"
                    value={formData.tripDuration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Please enter a number greater than or equal to 1"
                  />
                </div>

                {/* Number of Adults */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Number of Adults <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfAdults"
                    value={formData.numberOfAdults}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Number of Adults"
                  />
                </div>

                {/* Number of Children */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Number of Children (Age Below 10)
                  </label>
                  <input
                    type="number"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Number of Children (Age Below 10)"
                  />
                </div>

                {/* Hotel Type */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Hotel Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hotelType"
                    value={formData.hotelType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">---- Select One Option ----</option>
                    <option value="budget">Budget Hotel</option>
                    <option value="standard">Standard Hotel</option>
                    <option value="deluxe">Deluxe Hotel</option>
                    <option value="luxury">Luxury Hotel</option>
                    <option value="teahouse">Tea House</option>
                    <option value="guesthouse">Guest House</option>
                  </select>
                </div>

                {/* Estimated Budget */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Estimated Budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">---- Select One Option ----</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-2500">$1,000 - $2,500</option>
                    <option value="2500-5000">$2,500 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="above-10000">Above $10,000</option>
                  </select>
                </div>

                {/* Guide Language */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Guide Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="guideLanguage"
                    value={formData.guideLanguage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">---- Select One Option ----</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="italian">Italian</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>

                {/* More Information */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    More Information <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="moreInformation"
                    value={formData.moreInformation}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 resize-none"
                    placeholder="Please provide more details about your trip requirements..."
                  />
                </div>

              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Full Name"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Email Address"
                  />
                </div>

                {/* Phone Number With Country Code */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number With Country Code
                  </label>
                  <input
                    type="tel"
                    name="phoneNumberWithCountryCode"
                    value={formData.phoneNumberWithCountryCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Phone Number With Country Code"
                  />
                </div>

                {/* Select Your Country */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Select Your Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectYourCountry"
                    value={formData.selectYourCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">--- Select Your Country ---</option>
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="spain">Spain</option>
                    <option value="italy">Italy</option>
                    <option value="japan">Japan</option>
                    <option value="china">China</option>
                    <option value="india">India</option>
                    <option value="nepal">Nepal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Where Did You Find Us */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Where Did You Find Us? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="whereDidYouFindUs"
                    value={formData.whereDidYouFindUs}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 bg-white text-gray-500"
                  >
                    <option value="">---- Select One Option ----</option>
                    <option value="google">Google Search</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend-recommendation">Friend Recommendation</option>
                    <option value="travel-blog">Travel Blog</option>
                    <option value="travel-agent">Travel Agent</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-8 py-3 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition-colors duration-200"
              >
                Submit Request
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all border border-gray-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="flex items-center">
                {/* Success Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Request Submitted Successfully!</h3>
              </div>
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Thank you for your interest in our custom trekking packages! Your request has been submitted successfully. 
                Our experienced travel team will carefully review your requirements and create a personalized itinerary just for you.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-blue-900 font-semibold text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  What Happens Next?
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      <strong>Review & Analysis:</strong> Our travel experts will analyze your requirements and preferences
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      <strong>Custom Proposal:</strong> You'll receive a detailed itinerary and pricing within 24 hours
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      <strong>Personal Consultation:</strong> We'll schedule a call to discuss and refine your perfect adventure
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm text-center">
                  <strong>Response Time:</strong> Within 24 hours via email
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 rounded-b-lg flex justify-end border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-sky-600 text-white text-base font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition-colors duration-200 shadow-sm"
              >
                Perfect, Got it!
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPackage;
