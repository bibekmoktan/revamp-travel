import mongoose, { Schema } from 'mongoose';
import { ITraveler } from './traveler.interface';

const travelerSchema = new Schema<ITraveler>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'BookingSummary', required: true },
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, trim: true, maxlength: 20 },
    idProof: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

travelerSchema.index({ booking: 1, status: 1 });

// Performance optimization indexes
travelerSchema.index({ status: 1 }); // For status-based queries
travelerSchema.index({ booking: 1 }); // Simple booking lookup

export const TravelerModel = mongoose.model<ITraveler>('Traveler', travelerSchema);
export type { ITraveler };
