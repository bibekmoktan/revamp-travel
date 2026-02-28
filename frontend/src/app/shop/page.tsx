'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Filter, Grid, List } from 'lucide-react';

// Sample product data
const products = [
  {
    id: 1,
    name: "Professional Trekking Backpack 65L",
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 124,
    image: "/images/shop/backpack.jpg",
    category: "Backpacks",
    featured: true,
    inStock: true,
    description: "Durable 65L backpack with advanced ventilation system"
  },
  {
    id: 2,
    name: "All-Weather Hiking Boots",
    price: 189,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "/images/shop/boots.jpg",
    category: "Footwear",
    featured: false,
    inStock: true,
    description: "Waterproof hiking boots with superior grip"
  },
  {
    id: 3,
    name: "Lightweight Sleeping Bag",
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    reviews: 67,
    image: "/images/shop/sleeping-bag.jpg",
    category: "Camping Gear",
    featured: false,
    inStock: true,
    description: "Ultra-light down sleeping bag for 3-season use"
  },
  {
    id: 4,
    name: "High-Altitude Trekking Poles",
    price: 89,
    originalPrice: null,
    rating: 4.6,
    reviews: 156,
    image: "/images/shop/poles.jpg",
    category: "Trekking Gear",
    featured: false,
    inStock: true,
    description: "Carbon fiber trekking poles with shock absorption"
  },
  {
    id: 5,
    name: "Technical Base Layer Set",
    price: 79,
    originalPrice: 99,
    rating: 4.5,
    reviews: 203,
    image: "/images/shop/base-layer.jpg",
    category: "Clothing",
    featured: false,
    inStock: false,
    description: "Merino wool base layer for temperature regulation"
  },
  {
    id: 6,
    name: "Professional Headlamp",
    price: 65,
    originalPrice: null,
    rating: 4.8,
    reviews: 94,
    image: "/images/shop/headlamp.jpg",
    category: "Electronics",
    featured: false,
    inStock: true,
    description: "Rechargeable LED headlamp with 500-lumen output"
  }
];

const categories = ["All Products", "Backpacks", "Footwear", "Camping Gear", "Trekking Gear", "Clothing", "Electronics"];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gray-300">
          {/* Placeholder for background image - shop themed gradient */}
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">Shop Background Image Placeholder</span>
          </div>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Gear Up for Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium outdoor equipment tested by experts for your next epic journey
            </p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 hover:shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filter and Sort Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  index === 0 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest</option>
            </select>
            
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-lg bg-orange-600 text-white">
                <Grid className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Product */}
        {products.filter(product => product.featured).map((product) => (
          <div key={product.id} className="mb-16">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-80 lg:h-96">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating} ({product.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h2>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    
                    <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(product => !product.featured).map((product) => (
            <Link 
              key={product.id} 
              href={`/shop/${product.id}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                
                {/* Product Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.originalPrice && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Sale
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {product.rating % 1 !== 0 && '☆'}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    
                    <button 
                      className={`p-2 rounded-lg transition-colors ${
                        product.inStock 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Products
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on orders over $100</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Tested</h3>
            <p className="text-gray-600">All gear tested by professional guides</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-gray-600">Easy returns within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
} 