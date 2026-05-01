"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const imageSchema = new mongoose_1.Schema({
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
}, { _id: false });
const faqSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { _id: false });
const moreInfoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    points: [{ type: String, required: true }],
}, { _id: false });
const itinerarySchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    activities: [{ type: String, required: true }],
}, { _id: false });
const packageSchema = new mongoose_1.Schema({
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
    includes: [{ type: String }],
    notIncluded: { type: [String], default: [] },
    location: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'moderate', 'challenging', 'extreme'] },
    altitude: { type: String },
    groupSize: { type: String, required: true },
    bestSeason: [{ type: String }],
    tripStart: { type: String, default: '' },
    tripEnd: { type: String, default: '' },
    meals: { type: String, default: '' },
    accommodation: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    faq: { type: [faqSchema], default: [] },
    moreInfo: { type: [moreInfoSchema], default: [] },
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
exports.PackageModel = mongoose_1.default.model("Package", packageSchema);
