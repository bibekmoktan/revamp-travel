"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquiryStatusSchema = exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
exports.createEnquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    email: zod_1.z.string().email('Valid email is required'),
    phone: zod_1.z.string().max(20).optional(),
    message: zod_1.z.string().min(5, 'Message is required').max(1000),
    packageId: zod_1.z.string().optional(),
    packageTitle: zod_1.z.string().optional(),
});
exports.updateEnquiryStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['new', 'read', 'replied']),
});
