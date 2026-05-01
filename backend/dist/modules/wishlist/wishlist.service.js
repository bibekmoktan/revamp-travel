"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const mongoose_1 = require("mongoose");
const wishlist_model_1 = require("./wishlist.model");
const errors_1 = require("../../utils/errors");
exports.WishlistService = {
    async getWishlist(userId) {
        const items = await wishlist_model_1.WishlistModel.find({ user: new mongoose_1.Types.ObjectId(userId) })
            .populate('package', 'title slug price duration location difficulty altitude bestSeason featureImage rating reviews')
            .sort({ createdAt: -1 })
            .lean();
        return items;
    },
    async add(userId, packageId) {
        await wishlist_model_1.WishlistModel.findOneAndUpdate({ user: new mongoose_1.Types.ObjectId(userId), package: new mongoose_1.Types.ObjectId(packageId) }, { user: new mongoose_1.Types.ObjectId(userId), package: new mongoose_1.Types.ObjectId(packageId) }, { upsert: true, new: true });
    },
    async remove(userId, packageId) {
        const result = await wishlist_model_1.WishlistModel.findOneAndDelete({
            user: new mongoose_1.Types.ObjectId(userId),
            package: new mongoose_1.Types.ObjectId(packageId),
        });
        if (!result)
            throw new errors_1.NotFoundError('Wishlist item not found');
    },
    async getIds(userId) {
        const items = await wishlist_model_1.WishlistModel.find({ user: new mongoose_1.Types.ObjectId(userId) })
            .select('package')
            .lean();
        return items.map((i) => i.package.toString());
    },
};
