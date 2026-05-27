import mongoose, { Schema } from "mongoose";
import { IPackage, IItinerary, IFaq, IMoreInfo, IPricingTier, IRouteComparisonRow, ISeason, IWhyChoose } from "./package.interface";

const imageSchema = new Schema({
  url: { type: String, required: true, trim: true },
  alt: { type: String, trim: true },
  public_id: { type: String, trim: true },
}, { _id: false });

const faqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
}, { _id: false });

const moreInfoSchema = new Schema<IMoreInfo>({
  title:  { type: String, required: true },
  points: [{ type: String, required: true }],
}, { _id: false });

const whyChooseSchema = new Schema<IWhyChoose>({
  description: { type: String, default: '' },
  points:      [{ type: String }],
}, { _id: false });

const pricingTierSchema = new Schema<IPricingTier>({
  groupMin:       { type: Number, required: true },
  groupMax:       { type: Number, required: true },
  label:          { type: String, required: true, trim: true },
  pricePerPerson: { type: Number, required: true, min: 0 },
}, { _id: false });

const routeComparisonRowSchema = new Schema<IRouteComparisonRow>({
  attribute:        { type: String, required: true },
  thisRoute:        { type: String, required: true },
  alternativeRoute: { type: String, required: true },
}, { _id: false });

const seasonSchema = new Schema<ISeason>({
  name:   { type: String, required: true },
  months: { type: String, default: '' },
  notes:  { type: String, default: '' },
}, { _id: false });

const itinerarySchema = new Schema<IItinerary>({
  day: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: { type: [imageSchema], default: [] },
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
  country: { type: String, enum: ['nepal', 'bhutan', 'tibet', 'india'] },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  // Pricing tiers by group size (replaces single price for multi-tier packages)
  pricingTiers: { type: [pricingTierSchema], default: [] },

  // Season-specific descriptions
  seasons: { type: [seasonSchema], default: [] },

  // Route comparison (for packages with a notable alternative route)
  routeComparison: {
    type: new Schema({
      alternativeName: { type: String, default: '' },
      rows: { type: [routeComparisonRowSchema], default: [] },
    }, { _id: false }),
    default: undefined,
  },

  // Booking terms
  bookingTerms: {
    type: new Schema({
      depositPercent:     { type: Number, default: 25 },
      finalPaymentDays:   { type: Number, default: 30 },
      cancellationPolicy: { type: String, default: '' },
    }, { _id: false }),
    default: undefined,
  },

  // Why choose this route
  whyChoose: {
    type: whyChooseSchema,
    default: undefined,
  },

  // Packing weight guidelines
  packingNotes: {
    type: new Schema({
      maxDuffelKg:  { type: Number, default: 15 },
      maxDaypackKg: { type: Number, default: 7 },
      notes:        { type: String, default: '' },
    }, { _id: false }),
    default: undefined,
  },
}, { timestamps: true });

// Indexing for high-performance searching
packageSchema.index({ category: 1, price: 1 });
packageSchema.index({ title: "text" });
packageSchema.index({ status: 1 });
// slug index is created automatically by unique: true
packageSchema.index({ difficulty: 1 });
packageSchema.index({ bestSeason: 1 });

export const PackageModel = mongoose.model<IPackage>("Package", packageSchema);