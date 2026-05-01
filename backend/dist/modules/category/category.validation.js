"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    slug: zod_1.z.string().min(1).toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only').optional(),
    description: zod_1.z.string().max(500).default(''),
    image: zod_1.z.string().url('Must be a valid URL').or(zod_1.z.literal('')).default(''),
    order: zod_1.z.number().int().min(0).default(0),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
