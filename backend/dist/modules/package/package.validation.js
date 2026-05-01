"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugUpdateSchema = exports.updatePackageStatusSchema = exports.packageQuerySchema = exports.updatePackageSchema = exports.createPackageSchema = exports.itinerarySchema = exports.imageSchema = void 0;
const zod_1 = require("zod");
exports.imageSchema = zod_1.z.object({
    url: zod_1.z.string().url('Invalid image URL'),
    alt: zod_1.z.string().optional(),
    public_id: zod_1.z.string().min(1, 'Public ID is required'),
});
exports.itinerarySchema = zod_1.z.object({
    day: zod_1.z.number().int().min(1, 'Day must be a positive integer'),
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
    activities: zod_1.z.array(zod_1.z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity is required'),
});
exports.createPackageSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .min(3, 'Slug must be at least 3 characters')
        .max(100, 'Slug is too long')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title is too long'),
    category: zod_1.z
        .string()
        .min(1, 'Category is required')
        .max(50, 'Category is too long'),
    rating: zod_1.z
        .number()
        .min(0, 'Rating must be at least 0')
        .max(5, 'Rating must be at most 5')
        .default(0),
    reviews: zod_1.z
        .number()
        .int()
        .min(0, 'Reviews must be at least 0')
        .default(0),
    duration: zod_1.z
        .string()
        .min(1, 'Duration is required')
        .max(50, 'Duration is too long'),
    price: zod_1.z
        .number()
        .min(0, 'Price must be at least 0'),
    featureImage: exports.imageSchema,
    gallery: zod_1.z.array(exports.imageSchema).default([]),
    description: zod_1.z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description is too long'),
    highlights: zod_1.z
        .array(zod_1.z.string().min(1, 'Highlight cannot be empty'))
        .min(1, 'At least one highlight is required'),
    includes: zod_1.z
        .array(zod_1.z.string().min(1, 'Include item cannot be empty'))
        .min(1, 'At least one include item is required'),
    notIncluded: zod_1.z
        .array(zod_1.z.string().min(1, 'Not-included item cannot be empty'))
        .default([]),
    location: zod_1.z
        .string()
        .min(1, 'Location is required')
        .max(200, 'Location is too long'),
    difficulty: zod_1.z
        .enum(['easy', 'moderate', 'challenging', 'extreme'])
        .optional(),
    altitude: zod_1.z
        .string()
        .max(100, 'Altitude is too long')
        .optional(),
    groupSize: zod_1.z
        .string()
        .min(1, 'Group size is required')
        .max(50, 'Group size is too long'),
    bestSeason: zod_1.z
        .array(zod_1.z.string().min(1, 'Season cannot be empty'))
        .min(1, 'At least one best season is required'),
    tripStart: zod_1.z.string().max(200).default(''),
    tripEnd: zod_1.z.string().max(200).default(''),
    meals: zod_1.z.string().max(200).default(''),
    accommodation: zod_1.z.string().max(200).default(''),
    mapUrl: zod_1.z.string().url('Invalid map URL').optional().or(zod_1.z.literal('')),
    faq: zod_1.z
        .array(zod_1.z.object({
        question: zod_1.z.string().min(1, 'Question is required'),
        answer: zod_1.z.string().min(1, 'Answer is required'),
    }))
        .default([]),
    moreInfo: zod_1.z
        .array(zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        points: zod_1.z.array(zod_1.z.string().min(1, 'Point cannot be empty'))
            .min(1, 'At least one bullet point is required'),
    }))
        .default([]),
    itinerary: zod_1.z
        .array(exports.itinerarySchema)
        .min(1, 'At least one itinerary day is required'),
    status: zod_1.z
        .enum(['active', 'inactive'])
        .default('active'),
});
exports.updatePackageSchema = exports.createPackageSchema.partial().omit({
    slug: true, // Slug updates should be handled separately
});
exports.packageQuerySchema = zod_1.z.object({
    searchTerm: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum price format').optional(),
    maxPrice: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid maximum price format').optional(),
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
    sortBy: zod_1.z
        .enum(['createdAt', 'updatedAt', 'title', 'price', 'rating'])
        .default('createdAt'),
    sortOrder: zod_1.z
        .enum(['asc', 'desc'])
        .default('desc'),
    status: zod_1.z
        .enum(['active', 'inactive'])
        .optional(),
    difficulty: zod_1.z
        .enum(['easy', 'moderate', 'challenging', 'extreme'])
        .optional(),
    duration: zod_1.z
        .enum(['1', '2-3', '4-7', '8+'])
        .optional(),
    season: zod_1.z.string().optional(),
});
exports.updatePackageStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['active', 'inactive']),
});
exports.slugUpdateSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .min(3, 'Slug must be at least 3 characters')
        .max(100, 'Slug is too long')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});
