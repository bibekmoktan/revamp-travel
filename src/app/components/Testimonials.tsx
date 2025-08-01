"use client";
import Image from "next/image";
import { useState } from "react";

export default function Testimonials() {
  // Sample testimonial data with trekker images
  const testimonials = [
    {
      id: 1,
      name: "TREKKER NAME",
      location: "Nepal",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor ut sed mauris, tempor vehicula mauris ut. Sed eros, elit quis scelerisque ororem sit tristique.",
      image: "/images/testimonials/trekker1.jpg"
    },
    {
      id: 2,
      name: "TREKKER NAME",
      location: "Nepal",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor ut sed mauris, tempor vehicula mauris ut. Sed eros, elit quis scelerisque ororem sit tristique.",
      image: "/images/testimonials/trekker2.jpg"
    },
    {
      id: 3,
      name: "TREKKER NAME",
      location: "Nepal",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor ut sed mauris, tempor vehicula mauris ut. Sed eros, elit quis scelerisque ororem sit tristique.",
      image: "/images/testimonials/trekker3.jpg"
    },
    {
      id: 4,
      name: "TREKKER NAME",
      location: "Nepal",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor ut sed mauris, tempor vehicula mauris ut. Sed eros, elit quis scelerisque ororem sit tristique.",
      image: "/images/testimonials/trekker4.jpg"
    },
    {
      id: 5,
      name: "TREKKER NAME",
      location: "Nepal",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor ut sed mauris, tempor vehicula mauris ut. Sed eros, elit quis scelerisque ororem sit tristique.",
      image: "/images/testimonials/trekker5.jpg"
    }
  ];

  // State to track current starting index for slider
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Number of cards to show at once
  const cardsToShow = 3;
  
  // Calculate if we can go to next/previous
  const canGoNext = currentIndex < testimonials.length - cardsToShow;
  const canGoPrevious = currentIndex > 0;

  // Function to go to previous set of testimonials
  const goToPrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Function to go to next set of testimonials
  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get visible testimonials
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + cardsToShow);

  return (
    <section className="px-6 py-10 md:py-16 md:px-20 bg-gray-100">
      <div className="max-w-[1320px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What They Say About Us?
          </h2>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Main Content Layout - Image Left, Content Right */}
              <div className="flex items-start gap-4">
                {/* Trekker Image - Left Side */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-400 rounded-md overflow-hidden">
                    {/* Placeholder for trekker image */}
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                      <span className="text-white text-xs">IMG</span>
                    </div>
                  </div>
                  {/* Green accent shape */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-teal-600 rounded-sm"></div>
                </div>

                {/* Content - Right Side */}
                <div className="flex-1">
                  {/* Customer Info */}
                  <div className="mb-3">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`p-2 rounded border transition-colors duration-200 ${
              canGoPrevious
                ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Previous testimonials"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(testimonials.length / cardsToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  Math.floor(currentIndex / cardsToShow) === index
                    ? "bg-gray-800"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`p-2 rounded border transition-colors duration-200 ${
              canGoNext
                ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Next testimonials"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
