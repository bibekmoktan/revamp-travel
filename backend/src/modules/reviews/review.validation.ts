import { z } from 'zod';

export const createReviewSchema = z.object({
  user: z
    .string()
    .min(1, 'User ID is required'),
  package: z
    .string()
    .min(1, 'Package ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(2000, 'Comment must be at most 2000 characters'),
  title: z
    .string()
    .max(200, 'Title must be at most 200 characters')
    .optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export const respondToReviewSchema = z.object({
  text: z
    .string()
    .min(10, 'Response must be at least 10 characters')
    .max(1000, 'Response must be at most 1000 characters'),
});

export const reviewQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .default('10'),
  package: z
    .string()
    .optional(),
  user: z
    .string()
    .optional(),
  rating: z
    .string()
    .regex(/^[1-5]$/, 'Rating must be between 1 and 5')
    .transform(Number)
    .optional(),
  isVerified: z
    .string()
    .regex(/^(true|false)$/, 'isVerified must be true or false')
    .transform(Boolean)
    .optional(),
  sortBy: z
    .enum(['createdAt', 'rating', 'helpfulCount'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type RespondToReviewInput = z.infer<typeof respondToReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
