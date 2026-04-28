import { z } from 'zod';

export const createCategorySchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100),
  slug:        z.string().min(1).toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only').optional(),
  description: z.string().max(500).default(''),
  image:       z.string().url('Must be a valid URL').or(z.literal('')).default(''),
  order:       z.number().int().min(0).default(0),
  isActive:    z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();
