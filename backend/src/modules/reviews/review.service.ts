import { ReviewModel } from './review.model';
import { IReview } from './review.interface';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { Types } from 'mongoose';


export const ReviewService = {
  async createReview(payload: IReview) {
    try {
      // Check if user already reviewed this package
      const existingReview = await ReviewModel.findOne({
        user: payload.user,
        package: payload.package,
      });

      if (existingReview) {
        logger.warn('Attempt to create duplicate review', {
          user: payload.user.toString(),
          package: payload.package.toString(),
        });
        throw new ConflictError('You have already reviewed this package');
      }

      const result = await ReviewModel.create({
        ...payload,
        user: new Types.ObjectId(payload.user.toString()),
        package: new Types.ObjectId(payload.package.toString()),
        ...(payload.response?.respondedBy && {
          response: {
            ...payload.response,
            respondedBy: new Types.ObjectId(payload.response.respondedBy.toString())
          }
        })
      });

      logger.info('Review created successfully', {
        reviewId: result._id.toString(),
        user: payload.user.toString(),
        package: payload.package.toString(),
        rating: payload.rating,
      });

      return result;
    } catch (error: any) {
      if (error instanceof ConflictError) {
        throw error;
      }

      logger.error('Failed to create review', {
        payload,
        error: error.message,
      });
      throw new Error('Review creation failed');
    }
  },

  async getAllReviews(query: Record<string, any>) {
    try {
      const { page = 1, limit = 10, package: packageId, user, rating, isVerified, sortBy = 'createdAt', sortOrder = 'desc' } = query;
      
      const filter: any = {};
      
      if (packageId) filter.package = new Types.ObjectId(packageId);
      if (user) filter.user = new Types.ObjectId(user);
      if (typeof isVerified === 'boolean') filter.isVerified = isVerified;
      if (rating) filter.rating = Number(rating);

      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (Number(page) - 1) * Number(limit);
      
      const [reviews, total] = await Promise.all([
        ReviewModel.find(filter)
          .populate('user', 'name email')
          .populate('package', 'title')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        ReviewModel.countDocuments(filter)
      ]);

      logger.info('Retrieved reviews list', {
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
    } catch (error: any) {
      logger.error('Failed to get reviews', {
        query,
        error: error.message,
      });
      throw new Error('Failed to retrieve reviews');
    }
  },

  async getReviewById(id: string) {
    try {
      const review = await ReviewModel.findById(id)
        .populate('user', 'name email')
        .populate('package', 'title')
        .populate('response.respondedBy', 'name')
        .lean();

      if (!review) {
        logger.warn('Attempt to get non-existent review', { reviewId: id });
        throw new NotFoundError('Review not found');
      }

      return review;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get review by ID', {
        reviewId: id,
        error: error.message,
      });
      throw new Error('Failed to retrieve review');
    }
  },

  async updateReview(id: string, payload: Partial<IReview>, userId: string) {
    try {
      const review = await ReviewModel.findById(id);

      if (!review) {
        logger.warn('Attempt to update non-existent review', { reviewId: id });
        throw new NotFoundError('Review not found');
      }

      // Check if user owns this review
      if (review.user.toString() !== userId) {
        logger.warn('Unauthorized attempt to update review', {
          reviewId: id,
          userId,
          reviewOwner: review.user.toString(),
        });
        throw new ValidationError('You can only update your own reviews');
      }

      const updatedPayload = {
        ...payload,
        ...(payload.user && { user: new Types.ObjectId(payload.user.toString()) }),
        ...(payload.package && { package: new Types.ObjectId(payload.package.toString()) }),
        ...(payload.response?.respondedBy && {
          response: {
            ...payload.response,
            respondedBy: new Types.ObjectId(payload.response.respondedBy.toString())
          }
        })
      };

      const updatedReview = await ReviewModel.findByIdAndUpdate(
        id,
        updatedPayload,
        { new: true, runValidators: true }
      )
        .populate('user', 'name email')
        .populate('package', 'title')
        .lean();

      logger.info('Review updated successfully', {
        reviewId: id,
        userId,
        updatedFields: Object.keys(payload),
      });

      return updatedReview;
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to update review', {
        reviewId: id,
        userId,
        payload,
        error: error.message,
      });
      throw new Error('Failed to update review');
    }
  },

  async deleteReview(id: string, userId: string, userRole: string) {
    try {
      const review = await ReviewModel.findById(id);

      if (!review) {
        logger.warn('Attempt to delete non-existent review', { reviewId: id });
        throw new NotFoundError('Review not found');
      }

      // Check if user owns this review or is admin
      if (review.user.toString() !== userId && userRole !== 'admin') {
        logger.warn('Unauthorized attempt to delete review', {
          reviewId: id,
          userId,
          userRole,
          reviewOwner: review.user.toString(),
        });
        throw new ValidationError('You can only delete your own reviews');
      }

      await ReviewModel.findByIdAndDelete(id);

      logger.info('Review deleted successfully', {
        reviewId: id,
        userId,
        userRole,
      });

      return { message: 'Review deleted successfully' };
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to delete review', {
        reviewId: id,
        userId,
        error: error.message,
      });
      throw new Error('Failed to delete review');
    }
  },

  async respondToReview(id: string, responseText: string, adminId: string) {
    try {
      const review = await ReviewModel.findById(id);

      if (!review) {
        logger.warn('Attempt to respond to non-existent review', { reviewId: id });
        throw new NotFoundError('Review not found');
      }

      const updatedReview = await ReviewModel.findByIdAndUpdate(
        id,
        {
          response: {
            text: responseText,
            respondedAt: new Date(),
            respondedBy: new Types.ObjectId(adminId),
          },
        },
        { new: true }
      )
        .populate('user', 'name email')
        .populate('response.respondedBy', 'name')
        .lean();

      logger.info('Review response added successfully', {
        reviewId: id,
        adminId,
      });

      return updatedReview;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to respond to review', {
        reviewId: id,
        adminId,
        error: error.message,
      });
      throw new Error('Failed to respond to review');
    }
  },

  async updateReviewVerification(id: string, isVerified: boolean) {
    try {
      const review = await ReviewModel.findByIdAndUpdate(
        id,
        { isVerified },
        { new: true }
      ).lean();

      if (!review) {
        logger.warn('Attempt to verify non-existent review', { reviewId: id });
        throw new NotFoundError('Review not found');
      }

      logger.info('Review verification updated', {
        reviewId: id,
        isVerified,
      });

      return review;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to update review verification', {
        reviewId: id,
        isVerified,
        error: error.message,
      });
      throw new Error('Failed to update review verification');
    }
  },
};
