import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  user: Types.ObjectId | string;
  package: Types.ObjectId | string;
  rating: number;
  comment: string;
  title?: string;
  isVerified: boolean;
  helpfulCount: number;
  response?: {
    text: string;
    respondedAt: Date;
    respondedBy: Types.ObjectId | string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
