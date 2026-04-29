import { Types } from 'mongoose';
import { WishlistModel } from './wishlist.model';
import { NotFoundError } from '../../utils/errors';

export const WishlistService = {
  async getWishlist(userId: string) {
    const items = await WishlistModel.find({ user: new Types.ObjectId(userId) })
      .populate('package', 'title slug price duration location difficulty altitude bestSeason featureImage rating reviews')
      .sort({ createdAt: -1 })
      .lean();
    return items;
  },

  async add(userId: string, packageId: string) {
    await WishlistModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId), package: new Types.ObjectId(packageId) },
      { user: new Types.ObjectId(userId), package: new Types.ObjectId(packageId) },
      { upsert: true, new: true }
    );
  },

  async remove(userId: string, packageId: string) {
    const result = await WishlistModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      package: new Types.ObjectId(packageId),
    });
    if (!result) throw new NotFoundError('Wishlist item not found');
  },

  async getIds(userId: string): Promise<string[]> {
    const items = await WishlistModel.find({ user: new Types.ObjectId(userId) })
      .select('package')
      .lean();
    return items.map((i) => i.package.toString());
  },
};
