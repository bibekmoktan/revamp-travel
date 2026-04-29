import { Router } from 'express';
import { WishlistControllers } from './wishlist.controller';

const router = Router();

router.get('/',              ...WishlistControllers.getWishlist);
router.get('/ids',           ...WishlistControllers.getWishlistIds);
router.post('/',             ...WishlistControllers.addToWishlist);
router.delete('/:packageId', ...WishlistControllers.removeFromWishlist);

export const WishlistRoutes = router;
