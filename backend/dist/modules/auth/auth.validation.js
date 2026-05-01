"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email is too long'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(128, 'Password is too long'),
});
exports.registerSchema = zod_1.z.object({
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
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string()
        .min(1, 'Refresh token is required'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email is too long'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z
        .string()
        .min(1, 'Reset token is required'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(128, 'Password is too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});
