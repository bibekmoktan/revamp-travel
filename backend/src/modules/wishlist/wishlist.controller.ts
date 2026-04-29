import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { protect } from '../../middlewares/protect';
import { WishlistService } from './wishlist.service';
import { ValidationError } from '../../utils/errors';

const getWishlist = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const items = await WishlistService.getWishlist(userId);
    res.status(200).json({ success: true, data: items });
  }),
];

const getWishlistIds = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const ids = await WishlistService.getIds(userId);
    res.status(200).json({ success: true, data: ids });
  }),
];

const addToWishlist = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { packageId } = req.body;
    if (!packageId) throw new ValidationError('packageId is required');
    await WishlistService.add(userId, packageId);
    res.status(200).json({ success: true, message: 'Added to wishlist' });
  }),
];

const removeFromWishlist = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { packageId } = req.params;
    await WishlistService.remove(userId, packageId);
    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  }),
];

export const WishlistControllers = {
  getWishlist,
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
};
