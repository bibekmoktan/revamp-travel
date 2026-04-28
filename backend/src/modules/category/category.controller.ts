import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody } from '../../utils/validation';
import { createCategorySchema, updateCategorySchema } from './category.validation';

export const createCategory = [
  validateBody(createCategorySchema),
  catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({ success: true, message: 'Category created', data: category });
  }),
];

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const onlyActive = req.query.all !== 'true';
  const categories = await CategoryService.getAllCategories(onlyActive);
  res.json({ success: true, message: 'Categories fetched', data: categories });
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.getCategoryBySlug(req.params.slug);
  res.json({ success: true, message: 'Category fetched', data: category });
});

export const updateCategory = [
  validateBody(updateCategorySchema),
  catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, message: 'Category updated', data: category });
  }),
];

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});
