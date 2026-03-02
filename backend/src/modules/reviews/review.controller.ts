import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody, validate } from '../../utils/validation';
import { createReviewSchema, updateReviewSchema, respondToReviewSchema, reviewQuerySchema } from './review.validation';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';

// Create Review (Authenticated users only)
const createReview = [
  protect,
  validateBody(createReviewSchema),
  catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const reviewData = { ...req.body, user: userId };
    
    const result = await ReviewService.createReview(reviewData);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  }),
];

// Get All Reviews (Public)
const getAllReviews = [
  validate(reviewQuerySchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviews(req.query);

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),
];

// Get Single Review by ID (Public)
const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// Update Review (Owner only)
const updateReview = [
  protect,
  validateBody(updateReviewSchema),
  catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const result = await ReviewService.updateReview(req.params.id, req.body, userId);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: result,
    });
  }),
];

// Delete Review (Owner or Admin only)
const deleteReview = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await ReviewService.deleteReview(req.params.id, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: result,
    });
  }),
];

// Respond to Review (Admin only)
const respondToReview = [
  protect,
  authorize('admin'),
  validateBody(respondToReviewSchema),
  catchAsync(async (req: Request, res: Response) => {
    const adminId = (req as any).user._id;
    const { text } = req.body;
    
    const result = await ReviewService.respondToReview(req.params.id, text, adminId);

    res.status(200).json({
      success: true,
      message: 'Review response added successfully',
      data: result,
    });
  }),
];

// Update Review Verification (Admin only)
const updateReviewVerification = [
  protect,
  authorize('admin'),
  catchAsync(async (req: Request, res: Response) => {
    const { isVerified } = req.body;
    const result = await ReviewService.updateReviewVerification(req.params.id, isVerified);

    res.status(200).json({
      success: true,
      message: 'Review verification updated successfully',
      data: result,
    });
  }),
];

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  respondToReview,
  updateReviewVerification,
};
