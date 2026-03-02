import { z } from 'zod';

export const travelerInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(200, 'Full name is too long'),
  age: z.number().int().min(0).max(120).optional(),
  gender: z.string().max(20, 'Gender is too long').optional(),
  idProof: z.string().max(200, 'idProof is too long').optional(),
});

export const createBookingSchema = z.object({
  packageId: z.string().min(1, 'packageId is required'),
  trekDate: z
    .string()
    .datetime({ message: 'trekDate must be an ISO datetime string' })
    .transform((val) => new Date(val)),
  idempotencyKey: z.string().min(8, 'idempotencyKey is required').max(200, 'idempotencyKey is too long').optional(),
  travelers: z.array(travelerInfoSchema).min(1, 'At least one traveler is required').max(20, 'Maximum 20 travelers are allowed'),
});

export const bookingQuerySchema = z.object({
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
  status: z.enum(['reserved', 'confirmed', 'cancelled']).optional(),
  sortBy: z.enum(['createdAt', 'trekDate', 'bookingStatus']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
