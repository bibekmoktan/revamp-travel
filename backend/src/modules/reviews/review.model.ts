import mongoose, { Schema, Types } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  response: {
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    respondedAt: {
      type: Date,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
}, {
  timestamps: true,
});

// Indexes for performance
reviewSchema.index({ package: 1, createdAt: -1 });
reviewSchema.index({ user: 1, package: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1 });

// Pre-save middleware to validate rating
reviewSchema.pre('save', function(next) {
  if (this.rating < 1 || this.rating > 5) {
    return next(new Error('Rating must be between 1 and 5'));
  }
  next();
});

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);
