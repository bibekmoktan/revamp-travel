"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const review_validation_1 = require("./review.validation");
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
// Create Review (Authenticated users only)
const createReview = [
    protect_1.protect,
    (0, validation_1.validateBody)(review_validation_1.createReviewSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id;
        const reviewData = { ...req.body, user: userId };
        const result = await review_service_1.ReviewService.createReview(reviewData);
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: result,
        });
    }),
];
// Get All Reviews (Public)
const getAllReviews = [
    (0, validation_1.validate)(review_validation_1.reviewQuerySchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await review_service_1.ReviewService.getAllReviews(req.query);
        res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    }),
];
// Get Single Review by ID (Public)
const getReviewById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await review_service_1.ReviewService.getReviewById(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Review retrieved successfully',
        data: result,
    });
});
// Update Review (Owner only)
const updateReview = [
    protect_1.protect,
    (0, validation_1.validateBody)(review_validation_1.updateReviewSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const result = await review_service_1.ReviewService.updateReview(req.params.id, req.body, userId);
        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: result,
        });
    }),
];
// Delete Review (Owner or Admin only)
const deleteReview = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = req.user;
        const result = await review_service_1.ReviewService.deleteReview(req.params.id, user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
            data: result,
        });
    }),
];
// Respond to Review (Admin only)
const respondToReview = [
    protect_1.protect,
    (0, authorize_1.authorize)('admin'),
    (0, validation_1.validateBody)(review_validation_1.respondToReviewSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const adminId = req.user._id.toString();
        const { text } = req.body;
        const result = await review_service_1.ReviewService.respondToReview(req.params.id, text, adminId);
        res.status(200).json({
            success: true,
            message: 'Review response added successfully',
            data: result,
        });
    }),
];
// Update Review Verification (Admin only)
const updateReviewVerification = [
    protect_1.protect,
    (0, authorize_1.authorize)('admin'),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { isVerified } = req.body;
        const result = await review_service_1.ReviewService.updateReviewVerification(req.params.id, isVerified);
        res.status(200).json({
            success: true,
            message: 'Review verification updated successfully',
            data: result,
        });
    }),
];
exports.ReviewControllers = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    respondToReview,
    updateReviewVerification,
};
