"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQuerySchema = exports.respondToReviewSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    user: zod_1.z
        .string()
        .min(1, 'User ID is required'),
    package: zod_1.z
        .string()
        .min(1, 'Package ID is required'),
    rating: zod_1.z
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    comment: zod_1.z
        .string()
        .min(10, 'Comment must be at least 10 characters')
        .max(2000, 'Comment must be at most 2000 characters'),
    title: zod_1.z
        .string()
        .max(200, 'Title must be at most 200 characters')
        .optional(),
});
exports.updateReviewSchema = exports.createReviewSchema.partial();
exports.respondToReviewSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .min(10, 'Response must be at least 10 characters')
        .max(1000, 'Response must be at most 1000 characters'),
});
exports.reviewQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, 'Page must be a number')
        .transform(Number)
        .default('1'),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, 'Limit must be a number')
        .transform(Number)
        .default('10'),
    package: zod_1.z
        .string()
        .optional(),
    user: zod_1.z
        .string()
        .optional(),
    rating: zod_1.z
        .string()
        .regex(/^[1-5]$/, 'Rating must be between 1 and 5')
        .transform(Number)
        .optional(),
    isVerified: zod_1.z
        .string()
        .regex(/^(true|false)$/, 'isVerified must be true or false')
        .transform(Boolean)
        .optional(),
    sortBy: zod_1.z
        .enum(['createdAt', 'rating', 'helpfulCount'])
        .default('createdAt'),
    sortOrder: zod_1.z
        .enum(['asc', 'desc'])
        .default('desc'),
});
