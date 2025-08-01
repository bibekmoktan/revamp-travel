"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  // Updated testimonial data to match the design style
  const testimonials = [
    {
      id: 1,
      text: "Our travel experience with this company was absolutely incredible. The attention to detail, personalized service, and expertly planned itinerary made our Nepal trek an unforgettable adventure. Every moment was perfectly orchestrated.",
      author: "Sarah Johnson",
      position: "Adventure Enthusiast",
      company: "Mountain Explorers"
    },
    {
      id: 2,
      text: "From the initial consultation to the final farewell, everything exceeded our expectations. The local guides were knowledgeable, the accommodations were excellent, and the entire journey was seamless and worry-free.",
      author: "Michael Chen",
      position: "Travel Blogger",
      company: "Wanderlust Chronicles"
    },
    {
      id: 3,
      text: "What sets this travel company apart is their genuine care for creating authentic experiences. They didn't just show us tourist spots - they immersed us in the local culture and created memories that will last a lifetime.",
      author: "Emma Rodriguez",
      position: "Cultural Explorer",
      company: "Heritage Travels"
    },
    {
      id: 4,
      text: "The professionalism and expertise of the team made our family vacation stress-free and enjoyable. They handled every detail perfectly, allowing us to focus on creating beautiful memories together.",
      author: "David Thompson",
      position: "Family Traveler",
      company: "Adventure Families"
    }
  ];

  // State to track current testimonial
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality - changes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to go to next testimonial
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to previous testimonial
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Function to go to specific testimonial
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Animation variants for smooth sliding
  const slideVariants = {
    enter: {
      x: "100%",
    },
    center: {
      x: 0,
    },
    exit: {
      x: "-100%",
    },
  };

  return (
    <section className="px-6 py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-gray-600">
            See what our customers are saying
          </p>
        </div>

        {/* Main Testimonial Content */}
        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }}
              className="text-center px-8 md:px-16 py-8 w-full"
            >
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                {currentTestimonial.text}
              </p>
              
              {/* Author Attribution */}
              <div className="text-gray-600">
                <p className="font-semibold text-gray-800">
                  {currentTestimonial.author}
                </p>
                <p className="text-sm">
                  {currentTestimonial.position}, {currentTestimonial.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-6 mt-12">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrevious}
            className="p-2 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-4 h-4"
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

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-sky-600 w-4 h-4"
                    : "bg-gray-400 hover:bg-gray-600 w-3 h-3"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            className="p-2 bg-white border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Next testimonial"
          >
            <svg
              className="w-4 h-4"
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
