"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
function toSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
exports.CategoryService = {
    async createCategory(payload) {
        if (!payload.slug) {
            payload.slug = toSlug(payload.name);
        }
        const existing = await category_model_1.CategoryModel.findOne({ slug: payload.slug });
        if (existing)
            throw new errors_1.ConflictError('Category with this slug already exists');
        const category = await category_model_1.CategoryModel.create(payload);
        logger_1.logger.info('Category created', { id: category._id, slug: category.slug });
        return category;
    },
    async getAllCategories(onlyActive = false) {
        const filter = onlyActive ? { isActive: true } : {};
        return category_model_1.CategoryModel.find(filter).sort({ order: 1, name: 1 }).lean();
    },
    async getCategoryBySlug(slug) {
        const category = await category_model_1.CategoryModel.findOne({ slug }).lean();
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        return category;
    },
    async updateCategory(id, payload) {
        const category = await category_model_1.CategoryModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        logger_1.logger.info('Category updated', { id });
        return category;
    },
    async deleteCategory(id) {
        const category = await category_model_1.CategoryModel.findByIdAndDelete(id);
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        logger_1.logger.info('Category deleted', { id });
        return category;
    },
};
