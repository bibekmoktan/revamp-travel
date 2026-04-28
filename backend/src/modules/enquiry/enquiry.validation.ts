import { z } from 'zod';

export const createEnquirySchema = z.object({
  name:         z.string().min(1, 'Name is required').max(100),
  email:        z.string().email('Valid email is required'),
  phone:        z.string().max(20).optional(),
  message:      z.string().min(5, 'Message is required').max(1000),
  packageId:    z.string().optional(),
  packageTitle: z.string().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied']),
});
