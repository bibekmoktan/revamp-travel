import mongoose, { Schema } from 'mongoose';
import { IWishlist } from './wishlist.interface';

const wishlistSchema = new Schema<IWishlist>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User',    required: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, package: 1 }, { unique: true });
wishlistSchema.index({ user: 1, createdAt: -1 });

export const WishlistModel = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
