"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const protect_1 = require("../../middlewares/protect");
const wishlist_service_1 = require("./wishlist.service");
const errors_1 = require("../../utils/errors");
const getWishlist = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const items = await wishlist_service_1.WishlistService.getWishlist(userId);
        res.status(200).json({ success: true, data: items });
    }),
];
const getWishlistIds = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const ids = await wishlist_service_1.WishlistService.getIds(userId);
        res.status(200).json({ success: true, data: ids });
    }),
];
const addToWishlist = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const { packageId } = req.body;
        if (!packageId)
            throw new errors_1.ValidationError('packageId is required');
        await wishlist_service_1.WishlistService.add(userId, packageId);
        res.status(200).json({ success: true, message: 'Added to wishlist' });
    }),
];
const removeFromWishlist = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const { packageId } = req.params;
        await wishlist_service_1.WishlistService.remove(userId, packageId);
        res.status(200).json({ success: true, message: 'Removed from wishlist' });
    }),
];
exports.WishlistControllers = {
    getWishlist,
    getWishlistIds,
    addToWishlist,
    removeFromWishlist,
};
