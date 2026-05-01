"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingSchema = exports.bookingQuerySchema = exports.createBookingSchema = exports.travelerInfoSchema = void 0;
const zod_1 = require("zod");
exports.travelerInfoSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name is required').max(200, 'Full name is too long'),
    age: zod_1.z.number().int().min(1, 'Age must be at least 1').max(120, 'Age must be 120 or below'),
    gender: zod_1.z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Gender must be male, female, or other' }) }),
    idProof: zod_1.z.string().min(1, 'Passport / ID number is required').max(200, 'idProof is too long'),
});
exports.createBookingSchema = zod_1.z.object({
    packageId: zod_1.z.string().min(1, 'packageId is required'),
    trekDate: zod_1.z
        .string()
        .datetime({ message: 'trekDate must be an ISO datetime string' })
        .transform((val) => new Date(val))
        .refine((date) => date > new Date(), { message: 'Departure date must be in the future' }),
    idempotencyKey: zod_1.z.string().min(8, 'idempotencyKey is required').max(200, 'idempotencyKey is too long').optional(),
    travelers: zod_1.z.array(exports.travelerInfoSchema).min(1, 'At least one traveler is required').max(20, 'Maximum 20 travelers are allowed'),
});
exports.bookingQuerySchema = zod_1.z.object({
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
    status: zod_1.z.enum(['reserved', 'confirmed', 'cancelled']).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'trekDate', 'bookingStatus']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.cancelBookingSchema = zod_1.z.object({
    reason: zod_1.z.string().max(500).optional(),
});
