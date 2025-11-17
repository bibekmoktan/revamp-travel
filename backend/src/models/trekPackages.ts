const mongoose = require('mongoose');

const trekPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    state: { type: String, required: true },
    region: { type: String, required: true }, // e.g. "Himalayas", "Western Ghats"
    startPoint: { type: String },
    endPoint: { type: String }
  },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult', 'Challenging'],
    required: true
  },
  altitude: {
    type: Number, // in meters
  },
  price: {
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  bestSeason: {
    type: [String], // e.g. ["March", "April", "September", "October"]
  },
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 15 }
  },
  inclusions: {
    type: [String] // e.g. ["Meals", "Accommodation", "Guide", "Permits"]
  },
  exclusions: {
    type: [String]
  },
  itinerary: [
    {
      day: { type: Number },
      title: { type: String },
      description: { type: String }
    }
  ],
  images: {
    cover: { type: String },
    gallery: [String]
  },
  description: {
    short: { type: String },
    full: { type: String }
  },
  highlights: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrekPackage', trekPackageSchema);
