import mongoose, { Schema } from "mongoose";
import { IPackage, IItinerary, IFaq, IMoreInfo } from "./package.interface";

const imageSchema = new Schema({
  url: { type: String, required: true, trim: true },
  alt: { type: String, trim: true },
}, { _id: false });

const faqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
}, { _id: false });

const moreInfoSchema = new Schema<IMoreInfo>({
  title:  { type: String, required: true },
  points: [{ type: String, required: true }],
}, { _id: false });

const itinerarySchema = new Schema<IItinerary>({
  day: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  activities: [{ type: String, required: true }],
}, { _id: false });

const packageSchema = new Schema<IPackage>({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  duration: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  featureImage: { type: imageSchema, required: true },
  gallery: { type: [imageSchema], default: [] },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  includes:    [{ type: String }],
  notIncluded: { type: [String], default: [] },
  location: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'challenging', 'extreme'] },
  altitude: { type: String },
  groupSize: { type: String, required: true },
  bestSeason: [{ type: String }],
  tripStart:  { type: String, default: '' },
  tripEnd:    { type: String, default: '' },
  meals:         { type: String, default: '' },
  accommodation: { type: String, default: '' },
  mapUrl:        { type: String, default: '' },
  faq:        { type: [faqSchema], default: [] },
  moreInfo:   { type: [moreInfoSchema], default: [] },
  itinerary: [itinerarySchema],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Indexing for high-performance searching
packageSchema.index({ category: 1, price: 1 });
packageSchema.index({ title: "text" });
packageSchema.index({ status: 1 });
// slug index is created automatically by unique: true
packageSchema.index({ difficulty: 1 });
packageSchema.index({ bestSeason: 1 });

export const PackageModel = mongoose.model<IPackage>("Package", packageSchema);