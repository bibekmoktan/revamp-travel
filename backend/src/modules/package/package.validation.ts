import { z } from 'zod';

export const imageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  public_id: z.string().min(1, 'Public ID is required'),
});

export const itinerarySchema = z.object({
  day: z.number().int().min(1, 'Day must be a positive integer'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  activities: z.array(z.string().min(1, 'Activity cannot be empty')).min(1, 'At least one activity is required'),
});

export const createPackageSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .default(0),
  reviews: z
    .number()
    .int()
    .min(0, 'Reviews must be at least 0')
    .default(0),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration is too long'),
  price: z
    .number()
    .min(0, 'Price must be at least 0'),
  featureImage: imageSchema,
  gallery: z.array(imageSchema).default([]),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long'),
  highlights: z
    .array(z.string().min(1, 'Highlight cannot be empty'))
    .min(1, 'At least one highlight is required'),
  includes: z
    .array(z.string().min(1, 'Include item cannot be empty'))
    .min(1, 'At least one include item is required'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location is too long'),
  difficulty: z
    .enum(['easy', 'moderate', 'challenging', 'extreme'])
    .optional(),
  altitude: z
    .string()
    .max(100, 'Altitude is too long')
    .optional(),
  groupSize: z
    .string()
    .min(1, 'Group size is required')
    .max(50, 'Group size is too long'),
  bestSeason: z
    .array(z.string().min(1, 'Season cannot be empty'))
    .min(1, 'At least one best season is required'),
  itinerary: z
    .array(itinerarySchema)
    .min(1, 'At least one itinerary day is required'),
  status: z
    .enum(['active', 'inactive'])
    .default('active'),
});

export const updatePackageSchema = createPackageSchema.partial().omit({
  slug: true, // Slug updates should be handled separately
});

export const packageQuerySchema = z.object({
  searchTerm: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum price format').optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid maximum price format').optional(),
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
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'title', 'price', 'rating'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
  status: z
    .enum(['active', 'inactive'])
    .optional(),
});

export const updatePackageStatusSchema = z.object({
  status: z.enum(['active', 'inactive']),
});

export const slugUpdateSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
export type PackageQueryInput = z.infer<typeof packageQuerySchema>;
export type UpdatePackageStatusInput = z.infer<typeof updatePackageStatusSchema>;
export type SlugUpdateInput = z.infer<typeof slugUpdateSchema>;
