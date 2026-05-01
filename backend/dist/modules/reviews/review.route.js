"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/', ...review_controller_1.ReviewControllers.getAllReviews);
router.get('/:id', review_controller_1.ReviewControllers.getReviewById);
// Protected routes
router.post('/', ...review_controller_1.ReviewControllers.createReview);
router.patch('/:id', ...review_controller_1.ReviewControllers.updateReview);
router.delete('/:id', ...review_controller_1.ReviewControllers.deleteReview);
// Admin only routes
router.patch('/:id/respond', ...review_controller_1.ReviewControllers.respondToReview);
router.patch('/:id/verify', ...review_controller_1.ReviewControllers.updateReviewVerification);
exports.ReviewRoutes = router;
