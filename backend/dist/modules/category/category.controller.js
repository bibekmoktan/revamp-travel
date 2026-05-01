"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const category_validation_1 = require("./category.validation");
exports.createCategory = [
    (0, validation_1.validateBody)(category_validation_1.createCategorySchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const category = await category_service_1.CategoryService.createCategory(req.body);
        res.status(201).json({ success: true, message: 'Category created', data: category });
    }),
];
exports.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const onlyActive = req.query.all !== 'true';
    const categories = await category_service_1.CategoryService.getAllCategories(onlyActive);
    res.json({ success: true, message: 'Categories fetched', data: categories });
});
exports.getCategoryBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await category_service_1.CategoryService.getCategoryBySlug(req.params.slug);
    res.json({ success: true, message: 'Category fetched', data: category });
});
exports.updateCategory = [
    (0, validation_1.validateBody)(category_validation_1.updateCategorySchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const category = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
        res.json({ success: true, message: 'Category updated', data: category });
    }),
];
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await category_service_1.CategoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
});
