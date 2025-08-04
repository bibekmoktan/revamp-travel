'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Twitter, Instagram, Linkedin } from 'lucide-react';

// Define types for form data to ensure type safety
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  subject: string;
  message: string;
}

// Define type for form errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  subject?: string;
  message?: string;
}

/**
 * Contact component - A modern split-layout contact form
 * Features: Dark contact info section, white form section, radio button subjects
 */
export default function Contact() {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    subject: 'General Inquiry',
    message: ''
  });

  // State for form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Subject options for radio buttons
  const subjectOptions = [
    'General Inquiry',
    'Booking Inquiry', 
    'Travel Packages',
    'Customer Support'
  ];

  // Country codes for phone number dropdown
  const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+7', country: 'RU', flag: '🇷🇺' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+31', country: 'NL', flag: '🇳🇱' },
    { code: '+46', country: 'SE', flag: '🇸🇪' }
  ];

  /**
   * Validates email format using regex
   * @param email - Email string to validate
   * @returns boolean indicating if email is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates phone number format
   * @param phone - Phone string to validate
   * @returns boolean indicating if phone is valid
   */
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  /**
   * Validates all form fields and returns error object
   * @param data - Form data to validate
   * @returns FormErrors object with validation errors
   */
  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    // First name validation
    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!data.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Message validation
    if (!data.message.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  /**
   * Handles input changes and updates form data
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  /**
   * Handles form submission
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData);
    
    // If there are errors, show them and stop submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Start submission process
    setIsSubmitting(true);
    
    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - reset form and show success message
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '+1',
        subject: 'General Inquiry',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-24">
      {/* Header */}
      <div className="text-center py-8 bg-white">
        <h1 className="text-[24px] font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="text-[16px] text-gray-600">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-5">
            
            {/* Contact Information - Dark Section */}
            <div className="lg:col-span-2 bg-sky-100 text-gray-800 p-6 lg:p-8 relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-sky-300 rounded-full opacity-50"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-sky-400 rounded-full opacity-30"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">Contact Information</h2>
                <p className="text-gray-700 mb-8">Say something to start a live chat!</p>
                
                {/* Contact Details */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-800">+102 3456 789</span>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-800">demo@gmail.com</span>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 mt-1 text-gray-700" />
                    <div>
                      <p className="text-gray-800">132 Dartmouth Street Boston,</p>
                      <p className="text-gray-800">Massachusetts 02156 United States</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-8">
                  <div className="w-8 h-8 bg-sky-300 rounded-full flex items-center justify-center hover:bg-sky-400 cursor-pointer transition-colors">
                    <Twitter className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="w-8 h-8 bg-sky-300 rounded-full flex items-center justify-center hover:bg-sky-400 cursor-pointer transition-colors">
                    <Instagram className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="w-8 h-8 bg-sky-300 rounded-full flex items-center justify-center hover:bg-sky-400 cursor-pointer transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - White Section */}
            <div className="lg:col-span-3 p-6 lg:p-8 relative">
              {/* Decorative airplane icon */}
              <div className="absolute bottom-4 right-4 opacity-20">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Thank you! Your message has been sent successfully.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-0 py-2 border-0 border-b-2 focus:ring-0 focus:border-sky-600 focus:outline-none transition-colors bg-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-0 py-2 border-0 border-b-2 focus:ring-0 focus:border-sky-600 focus:outline-none transition-colors bg-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-0 py-2 border-0 border-b-2 focus:ring-0 focus:border-sky-600 focus:outline-none transition-colors bg-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="border-0 border-b-2 border-gray-300 focus:border-sky-600 focus:outline-none focus:ring-0 bg-transparent text-sm pr-8 py-2"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`flex-1 px-3 py-2 border-0 border-b-2 focus:ring-0 focus:border-sky-600 focus:outline-none transition-colors bg-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Subject Selection */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-3">Select Subject?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {subjectOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="subject"
                          value={option}
                          checked={formData.subject === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-0 py-2 border-0 border-b-2 focus:ring-0 focus:border-sky-600 focus:outline-none transition-colors bg-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Write your message..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-sky-600 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isSubmitting 
                        ? 'opacity-75 cursor-not-allowed' 
                        : 'hover:bg-sky-700 transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
