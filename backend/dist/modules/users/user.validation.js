"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.updatePasswordSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name is too long')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email is too long'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password is too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: zod_1.z
        .enum(['user', 'admin'])
        .optional()
        .default('user'),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name is too long')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .optional(),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email is too long')
        .optional(),
    role: zod_1.z
        .enum(['user', 'admin'])
        .optional(),
    isBlocked: zod_1.z
        .boolean()
        .optional(),
});
exports.updatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string()
        .min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password is too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});
exports.paginationSchema = zod_1.z.object({
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
    search: zod_1.z
        .string()
        .optional(),
    role: zod_1.z
        .enum(['user', 'admin'])
        .optional(),
    isBlocked: zod_1.z
        .string()
        .regex(/^(true|false)$/, 'isBlocked must be true or false')
        .transform(Boolean)
        .optional(),
});
