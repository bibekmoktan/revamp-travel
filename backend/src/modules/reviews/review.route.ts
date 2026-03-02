import { Router } from 'express';
import { ReviewControllers } from './review.controller';

const router = Router();

// Public routes
router.get('/', ...ReviewControllers.getAllReviews);
router.get('/:id', ReviewControllers.getReviewById);

// Protected routes
router.post('/', ...ReviewControllers.createReview);
router.patch('/:id', ...ReviewControllers.updateReview);
router.delete('/:id', ...ReviewControllers.deleteReview);

// Admin only routes
router.patch('/:id/respond', ...ReviewControllers.respondToReview);
router.patch('/:id/verify', ...ReviewControllers.updateReviewVerification);

export const ReviewRoutes = router;
