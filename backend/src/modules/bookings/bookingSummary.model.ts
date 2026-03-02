import mongoose, { Schema } from 'mongoose';
import { IBookingSummary } from './bookingSummary.interface';

const bookingSummarySchema = new Schema<IBookingSummary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', required: true, index: true },
    trekDate: { type: Date, required: true, index: true },
    idempotencyKey: { type: String, trim: true, maxlength: 200 },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ['reserved', 'confirmed', 'cancelled'],
      default: 'reserved',
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

bookingSummarySchema.index({ user: 1, package: 1, trekDate: 1 });
bookingSummarySchema.index(
  { user: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: 'string' },
    },
  }
);

// Performance optimization indexes
bookingSummarySchema.index({ bookingStatus: 1, expiresAt: 1 }); // For expiration cleanup
bookingSummarySchema.index({ user: 1, bookingStatus: 1, createdAt: -1 }); // For user booking lists
bookingSummarySchema.index({ package: 1, trekDate: 1, bookingStatus: 1 }); // For package availability
bookingSummarySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire documents
bookingSummarySchema.index({ paymentStatus: 1, bookingStatus: 1 }); // For payment queries

export const BookingSummaryModel = mongoose.model<IBookingSummary>('BookingSummary', bookingSummarySchema);
export type { IBookingSummary };
