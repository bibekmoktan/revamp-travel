"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const mongoose_1 = require("mongoose");
exports.ReviewService = {
    async createReview(payload) {
        try {
            // Check if user already reviewed this package
            const existingReview = await review_model_1.ReviewModel.findOne({
                user: payload.user,
                package: payload.package,
            });
            if (existingReview) {
                logger_1.logger.warn('Attempt to create duplicate review', {
                    user: payload.user.toString(),
                    package: payload.package.toString(),
                });
                throw new errors_1.ConflictError('You have already reviewed this package');
            }
            const result = await review_model_1.ReviewModel.create({
                ...payload,
                user: new mongoose_1.Types.ObjectId(payload.user.toString()),
                package: new mongoose_1.Types.ObjectId(payload.package.toString()),
                ...(payload.response?.respondedBy && {
                    response: {
                        ...payload.response,
                        respondedBy: new mongoose_1.Types.ObjectId(payload.response.respondedBy.toString())
                    }
                })
            });
            logger_1.logger.info('Review created successfully', {
                reviewId: result._id.toString(),
                user: payload.user.toString(),
                package: payload.package.toString(),
                rating: payload.rating,
            });
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.ConflictError) {
                throw error;
            }
            logger_1.logger.error('Failed to create review', {
                payload,
                error: error.message,
            });
            throw new Error('Review creation failed');
        }
    },
    async getAllReviews(query) {
        try {
            const { page = 1, limit = 10, package: packageId, user, rating, isVerified, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            const filter = {};
            if (packageId)
                filter.package = new mongoose_1.Types.ObjectId(packageId);
            if (user)
                filter.user = new mongoose_1.Types.ObjectId(user);
            if (typeof isVerified === 'boolean')
                filter.isVerified = isVerified;
            if (rating)
                filter.rating = Number(rating);
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const skip = (Number(page) - 1) * Number(limit);
            const [reviews, total] = await Promise.all([
                review_model_1.ReviewModel.find(filter)
                    .populate('user', 'name email')
                    .populate('package', 'title')
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                review_model_1.ReviewModel.countDocuments(filter)
            ]);
            logger_1.logger.info('Retrieved reviews list', {
                count: reviews.length,
                total,
                page: Number(page),
                limit: Number(limit),
                filters: { packageId, user, rating, isVerified },
            });
            return {
                data: reviews,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit)),
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get reviews', {
                query,
                error: error.message,
            });
            throw new Error('Failed to retrieve reviews');
        }
    },
    async getReviewById(id) {
        try {
            const review = await review_model_1.ReviewModel.findById(id)
                .populate('user', 'name email')
                .populate('package', 'title')
                .populate('response.respondedBy', 'name')
                .lean();
            if (!review) {
                logger_1.logger.warn('Attempt to get non-existent review', { reviewId: id });
                throw new errors_1.NotFoundError('Review not found');
            }
            return review;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to get review by ID', {
                reviewId: id,
                error: error.message,
            });
            throw new Error('Failed to retrieve review');
        }
    },
    async updateReview(id, payload, userId) {
        try {
            const review = await review_model_1.ReviewModel.findById(id);
            if (!review) {
                logger_1.logger.warn('Attempt to update non-existent review', { reviewId: id });
                throw new errors_1.NotFoundError('Review not found');
            }
            // Check if user owns this review
            if (review.user.toString() !== userId) {
                logger_1.logger.warn('Unauthorized attempt to update review', {
                    reviewId: id,
                    userId,
                    reviewOwner: review.user.toString(),
                });
                throw new errors_1.ValidationError('You can only update your own reviews');
            }
            const updatedPayload = {
                ...payload,
                ...(payload.user && { user: new mongoose_1.Types.ObjectId(payload.user.toString()) }),
                ...(payload.package && { package: new mongoose_1.Types.ObjectId(payload.package.toString()) }),
                ...(payload.response?.respondedBy && {
                    response: {
                        ...payload.response,
                        respondedBy: new mongoose_1.Types.ObjectId(payload.response.respondedBy.toString())
                    }
                })
            };
            const updatedReview = await review_model_1.ReviewModel.findByIdAndUpdate(id, updatedPayload, { new: true, runValidators: true })
                .populate('user', 'name email')
                .populate('package', 'title')
                .lean();
            logger_1.logger.info('Review updated successfully', {
                reviewId: id,
                userId,
                updatedFields: Object.keys(payload),
            });
            return updatedReview;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError || error instanceof errors_1.ValidationError) {
                throw error;
            }
            logger_1.logger.error('Failed to update review', {
                reviewId: id,
                userId,
                payload,
                error: error.message,
            });
            throw new Error('Failed to update review');
        }
    },
    async deleteReview(id, userId, userRole) {
        try {
            const review = await review_model_1.ReviewModel.findById(id);
            if (!review) {
                logger_1.logger.warn('Attempt to delete non-existent review', { reviewId: id });
                throw new errors_1.NotFoundError('Review not found');
            }
            // Check if user owns this review or is admin
            if (review.user.toString() !== userId && userRole !== 'admin') {
                logger_1.logger.warn('Unauthorized attempt to delete review', {
                    reviewId: id,
                    userId,
                    userRole,
                    reviewOwner: review.user.toString(),
                });
                throw new errors_1.ValidationError('You can only delete your own reviews');
            }
            await review_model_1.ReviewModel.findByIdAndDelete(id);
            logger_1.logger.info('Review deleted successfully', {
                reviewId: id,
                userId,
                userRole,
            });
            return { message: 'Review deleted successfully' };
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError || error instanceof errors_1.ValidationError) {
                throw error;
            }
            logger_1.logger.error('Failed to delete review', {
                reviewId: id,
                userId,
                error: error.message,
            });
            throw new Error('Failed to delete review');
        }
    },
    async respondToReview(id, responseText, adminId) {
        try {
            const review = await review_model_1.ReviewModel.findById(id);
            if (!review) {
                logger_1.logger.warn('Attempt to respond to non-existent review', { reviewId: id });
                throw new errors_1.NotFoundError('Review not found');
            }
            const updatedReview = await review_model_1.ReviewModel.findByIdAndUpdate(id, {
                response: {
                    text: responseText,
                    respondedAt: new Date(),
                    respondedBy: new mongoose_1.Types.ObjectId(adminId),
                },
            }, { new: true })
                .populate('user', 'name email')
                .populate('response.respondedBy', 'name')
                .lean();
            logger_1.logger.info('Review response added successfully', {
                reviewId: id,
                adminId,
            });
            return updatedReview;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to respond to review', {
                reviewId: id,
                adminId,
                error: error.message,
            });
            throw new Error('Failed to respond to review');
        }
    },
    async updateReviewVerification(id, isVerified) {
        try {
            const review = await review_model_1.ReviewModel.findByIdAndUpdate(id, { isVerified }, { new: true }).lean();
            if (!review) {
                logger_1.logger.warn('Attempt to verify non-existent review', { reviewId: id });
                throw new errors_1.NotFoundError('Review not found');
            }
            logger_1.logger.info('Review verification updated', {
                reviewId: id,
                isVerified,
            });
            return review;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to update review verification', {
                reviewId: id,
                isVerified,
                error: error.message,
            });
            throw new Error('Failed to update review verification');
        }
    },
};
